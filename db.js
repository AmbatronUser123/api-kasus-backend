const mysql = require('mysql2/promise');

let dbPool;

async function getDbConnection() {
  if (!dbPool) {
    console.log("Mencoba membuat koneksi pool baru...");
    
    const config = {
      host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      user: process.env.DB_USER || '216M7Ghae2SDx7i.root',
      password: process.env.DB_PASSWORD || '98Pu6ZxTr7LKn7UF',
      port: process.env.DB_PORT || 4000,
      database: process.env.DB_NAME || 'test',
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    };

    console.log("DB Config:", {
      host: config.host,
      user: config.user,
      database: config.database,
      port: config.port
    });
    
    try {
      dbPool = mysql.createPool(config);
      await dbPool.query('SELECT 1');
      console.log(">>> Berhasil terkoneksi ke database MySQL.");
    } catch (error) {
      console.error("### KONEKSI DATABASE GAGAL ###:", error);
    }
  }
  return dbPool;
}

getDbConnection();
module.exports = getDbConnection;