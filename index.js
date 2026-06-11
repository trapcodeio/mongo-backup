#!/usr/bin/env node

const { env, cwd } = require("./env");
const { execSync } = require("child_process");
const ora = require("ora");
const os = require("os");
const fs = require("fs");

const { DB_USER, DB_PASSWORD, DB_NAME, DB_SERVER } = env;

/**
 * ============================================================
 * ======================== FUNCTIONS =========================
 * ============================================================
 */

function parseServer() {
    // encode password
    const password = encodeURIComponent(DB_PASSWORD);

    return (DB_SERVER || "")
        .replace("<USER>", DB_USER)
        .replace("<user>", DB_USER)

        .replace("<PASSWORD>", password)
        .replace("<password>", password)

        .replace("<DATABASE>", DB_NAME)
        .replace("<database>", DB_NAME);
}

function splitServer(server) {
    // split uri into host part, database and query string
    // e.g mongodb://user:pass@host:27017/myDb?authSource=admin
    // => { host: "mongodb://user:pass@host:27017", database: "myDb", query: "?authSource=admin" }
    const queryIndex = server.indexOf("?");
    const base = queryIndex === -1 ? server : server.slice(0, queryIndex);
    const query = queryIndex === -1 ? "" : server.slice(queryIndex);

    const schemeEnd = base.indexOf("://");
    const slashIndex = base.indexOf("/", schemeEnd === -1 ? 0 : schemeEnd + 3);

    return {
        host: slashIndex === -1 ? base : base.slice(0, slashIndex),
        database: slashIndex === -1 ? "" : base.slice(slashIndex + 1),
        query
    };
}

/**
 * ============================================================
 * ======================== MAIN CODE =========================
 * ============================================================
 */

const todo = String(process.argv[2] || "").toLowerCase();
const todos = ["backup", "restore"];

if (!todos.includes(todo)) {
    console.log("Todo is required!");
    process.exit();
}

// Spacing
console.log();

// Set isBackup to true if todo is backup
const isBackup = todo === "backup";

// Create yaml file
const parsedServer = parseServer();
const { host, database, query } = splitServer(parsedServer);

// database to backup/restore: the one in the server string wins
const dbName = database || DB_NAME || "";

// where mongodump writes and mongorestore reads
const dumpFolder = `${cwd}/dump`;

// yaml file
const yamlFile = `${cwd}/mongo-${todo}-config.yaml`;

let uri;
let command;

if (isBackup) {
    if (!dbName) {
        console.log("A database is required for backup! Set DB_NAME or include it in DB_SERVER.");
        process.exit(1);
    }

    uri = `${host}/${dbName}${query}`;
    command = `mongodump --config=${yamlFile} --out="${dumpFolder}" --forceTableScan`;
} else {
    uri = parsedServer;
    command = `mongorestore --config=${yamlFile}`;

    if (database) {
        // a database in the uri makes mongorestore expect the database-level
        // dump folder, not the top-level dump folder
        const dbDumpFolder = `${dumpFolder}/${DB_NAME || database}`;

        if (!fs.existsSync(dbDumpFolder)) {
            console.log(`No dump found for database at: ${dbDumpFolder}`);
            process.exit(1);
        }

        command += ` --dir="${dbDumpFolder}"`;
    } else {
        command += ` --dir="${dumpFolder}"`;

        // without a database in the uri, restore only the dumped database
        if (dbName) command += ` --nsInclude="${dbName}.*"`;
    }
}

// yaml config content
const yaml = [`uri: ${uri}`].join(os.EOL);

// Create yaml file
fs.writeFileSync(yamlFile, yaml);

console.log(command);

const spinner = ora(`Starting: ${todo.toUpperCase()} ===> ${command}`).start();
console.log();

execSync(command);

// delete yaml file
fs.unlinkSync(yamlFile);

// stop
spinner.stop();

console.log();
console.log(`${isBackup ? "BACKUP" : "RESTORE"} successful!`);
console.log(`${isBackup ? "BACKUP" : "RESTORE"} folder: ${dumpFolder}`);
