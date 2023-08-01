const mysql=require('mysql')
require('dotenv').config()

const connection=mysql.createConnection({
    host:process.env.DBHOST,
    port:process.env.DBPORT,
    user:process.env.DBUSER,
    password:process.env.DBPASSWORD,
    database:process.env.DBNAME,
    multipleStatements:true
});
connection.connect((err,connect)=> {
    if(err){
        console.log("Err Connection with Student Attendance DB")
    }else{
        console.log('Student Attendance DB Connected')
    }
  });


module.exports=connection 