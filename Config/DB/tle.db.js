const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createPool({
    host:process.env.RAVES_DBHOST,
    port:process.env.RAVES_DBPORT,
    user:process.env.RAVES_DBUSER,
    password:process.env.RAVES_DBPASSWORD,
    // database:process.env.RAVES_DBNAME,


});
connection.getConnection((err, connect) => {
    if (err) {
        console.log(err)
    } else {
        console.log('TLE DB Connected')
    }
});


module.exports = connection

