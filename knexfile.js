require('dotenv').config();
const config = {
    client: 'mssql',
    connection: {
        host: process.env.DB_HOST || '10.0.0.25',
        port: 5353,
        database: process.env.DB_NAME || 'dboXEnterpriseKDS2013_001',
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || 'objectX'
    },
    pool: {min: 0, max: 10},
    migrations: {directory: './db/migrations'}
};


module.exports = config;

