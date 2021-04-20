require('dotenv').config();
const config = {
    client: 'mssql',
    connection: {
        host: process.env.DB_HOST || '10.0.0.149',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
        database: process.env.DB_NAME || 'dboTaskManagement',
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || 'objectX'
    },
    pool: {min: 0, max: 10},
    migrations: {directory: './db/migrations'}
};


module.exports = config;

