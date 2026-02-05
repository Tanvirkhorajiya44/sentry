const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Set your MySQL root password
  database: 'wisdom',
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
