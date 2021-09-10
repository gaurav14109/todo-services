const sql = require('mssql/msnodesqlv8')
const config = {
    "user": 'aurav',
    "password": '141097',
    "server": 'localhost\\SQLEXPRESS',
    "database": 'todo',
    "port": 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustedConnection: true
    }
}

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
module.exports = 
{poolConnect:poolConnect,
pool:pool
}