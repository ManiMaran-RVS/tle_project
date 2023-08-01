const db = require("../../Config/DB/tle.db");

exports.findAllProgrammes=(req,res)=>{
    db.query(`select * from ${process.env.RAVES_DBNAME}.courses where active=1`,
    
    async (err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
}

exports.findByDepartmentId=(req,res)=>{
    deptid=req.params.deptid
    db.query(`select * from ${process.env.RAVES_DBNAME}.courses where deptid='${deptid}' and active=1 ORDER BY shortname ASC`,
    async (err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
}