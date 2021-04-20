//require('knex')(config)
// const dbMaster = require('../../db/db');
import dbMaster from '../../db/db';

const dbs = {};
function getConfig(connection) {
    return {
        client: 'mssql',
        connection: {
            host: connection.db.DB_HOST,
            port: connection.db.DB_PORT,
            database: connection.db.DB_NAME_COMPANY,
            user: connection.db.DB_USER,
            password: connection.db.DB_PASSWORD
        },
        pool: {min: 0, max: 10},
        options: {enableArithAbort: false}
    };
}
async function init() {
    const conns = await dbMaster('tblFirma').select('*');
    const connections = [];
    conns.forEach(conn => {
        connections.push({
            firmaID: conn.FirmaID,
            firmaName: conn.FirmaName,
            DB_NAME: conn.DB_NAME + conn.YEAR,
            DB_NAME_KOMINTENT: conn.COMMON_KOMINTENTI ? conn.DB_NAME + conn.YEAR : conn.DB_NAME + conn.YEAR + '_' + conn.COMPANY_ORDER,
            DB_NAME_PROIZVOD: conn.COMMON_PROIZVODI ? conn.DB_NAME + conn.YEAR : conn.DB_NAME + conn.YEAR + '_'+ conn.COMPANY_ORDER,
            MagacinID: conn.MagacinID,
            db: {
                DB_HOST: conn.DB_HOST,
                DB_PORT: conn.DB_PORT,
                DB_NAME_COMPANY: conn.DB_NAME + conn.YEAR + '_' + conn.COMPANY_ORDER,
                DB_USER: conn.DB_USER,
                DB_PASSWORD: conn.DB_PASSWORD
            }
        })
    });

    connections.forEach(connection => {
        dbs[connection.firmaID] = require('knex')(getConfig(connection));
        dbs[connection.firmaID+'tblP'] = connection.DB_NAME_PROIZVOD;
        dbs[connection.firmaID+'tblG'] = connection.DB_NAME;
        dbs[connection.firmaID+'magID'] = connection.MagacinID;
    })
    return true;
}
export function getDb(firmaID) {
    return {mk: dbs[firmaID], tblK: dbs[firmaID+'tblK'], tblP: dbs[firmaID+'tblP'], tblG: dbs[firmaID+'tblG'], magID: dbs[firmaID+'magID']}
}

init().then(() => { console.log("Databases initialized") })
    .catch(err => {
        console.log(err);
        console.error("Error while iniitalizing database connections");
    });
