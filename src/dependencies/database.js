const { Sequelize } = require('sequelize');
const dbType = process.env.DB_TYPE;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

let database;

if (dbType == "local") {
    database = new Sequelize({
        dialect: 'sqlite',
        storage: `${dbName}.sqlite`
    });
} else if (dbType == "postgres") {
    database = new Sequelize(`postgres://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`)
} else if (dbType === undefined || dbType === null) {
    console.error("Database type not provided!");
    process.exit(1);
} else {
    console.error("Unknown database type provided!");
    process.exit(1);
}

module.exports = database;

