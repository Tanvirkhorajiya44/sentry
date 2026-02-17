const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'senetry.ci3022iksyf7.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'mamasenetry$#9337', // Set your MySQL root password
  database: 'senetry',
  queueLimit: 0
});

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
  } else {
    console.log('MySQL database connected!');
    connection.release();
  }
});

module.exports = pool.promise();
