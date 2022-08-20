const { Env } = require("@xpresser/env");
const path = require("path");

// Get current working directory
const cwd = process.cwd();

// Get custom env file
const envFile = path.resolve(process.argv[3] || cwd + "/.env");

console.log("Using env file:");
console.log(envFile);

const env = Env(envFile, {
    DB_NAME: Env.is.string(),
    DB_USER: Env.is.string(),
    DB_PASSWORD: Env.optional.string(),
    DB_SERVER: Env.is.string()
});

module.exports = { env, cwd };
