const { env } = require("./env");
const { execSync } = require("child_process");
const ora = require("ora");

const { DB_USER, DB_PASSWORD, DB_NAME, DB_SERVER } = env;

console.log();

const todo = process.argv[2];
const todos = ["backup", "restore"];

if (!todos.includes(todo)) {
    console.log("Todo is required!");
    process.exit();
}

const isBackup = todo === "backup";

const password = encodeURIComponent(DB_PASSWORD);

const restore = parseServer(`mongorestore --uri ${DB_SERVER}`);
const backup = parseServer(`mongodump --uri ${DB_SERVER}/<DATABASE> --forceTableScan`);

function parseServer(str) {
    return str
        .replace("<USER>", DB_USER)
        .replace("<PASSWORD>", password)
        .replace("<DATABASE>", DB_NAME);
}

const command = isBackup ? backup : restore;
const spinner = ora(`Starting: ${todo.toUpperCase()} ===> ${command}`).start();
console.log();

execSync(command);
// stop
spinner.stop();
