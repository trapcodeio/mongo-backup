#!/usr/bin/env node

const { env, cwd } = require("./env");
const { execSync } = require("child_process");
const ora = require("ora");
const os = require("os");
const fs = require("fs");

/**
 * ============================================================
 * ======================== FUNCTIONS =========================
 * ============================================================
 */

function parseServer(str) {
    return str
        .replace("<USER>", DB_USER)
        .replace("<PASSWORD>", password)
        .replace("<DATABASE>", DB_NAME);
}

/**
 * ============================================================
 * ======================== MAIN CODE =========================
 * ============================================================
 */
const { DB_USER, DB_PASSWORD, DB_NAME, DB_SERVER } = env;

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

// encode password
const password = encodeURIComponent(DB_PASSWORD);

// Create yaml file
const parsedServer = parseServer(DB_SERVER);

// yaml config content
const yaml = [
    // if is backup, add the db name
    // else ignore because restore will use the db name from the dump file
    isBackup ? `uri: ${parsedServer}/${DB_NAME}` : `uri: ${parsedServer}`
].join(os.EOL);

// yaml file
const yamlFile = `${cwd}/mongo-${todo}-config.yaml`;

// Create yaml file
fs.writeFileSync(yamlFile, yaml);

// Define commands
const restore = `mongorestore --config=${yamlFile}`;
const backup = `mongodump --config=${yamlFile} --forceTableScan`;

// Get Active Command
const command = isBackup ? backup : restore;

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
console.log(`${isBackup ? "BACKUP" : "RESTORE"} folder: ${__dirname + "/dump"}`);
