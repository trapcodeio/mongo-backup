const { Env } = require("@xpresser/env");

const env = Env(".env", {
    DB_NAME: Env.is.string(),
    DB_USER: Env.is.string(),
    DB_PASSWORD: Env.optional.string(),
    DB_SERVER: Env.is.string()
});

module.exports = { env };
