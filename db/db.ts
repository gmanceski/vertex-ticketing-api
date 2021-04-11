const config = require('../knexfile.js');

const mssqL = require('mssql');
// const PG_DECIMAL_OID = 1700;
// workaround that ensures numeric types are read as numbers, not strings
// mssqkpg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);

export default require('knex')(config);
