const db = require("../../Config/DB/tle.db");

exports.getallDepartmennt = (req, res) => {
    db.query(`select * from ${process.env.RAVES_DBNAME}.department where active=1`, (err, deptData) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).send(deptData)
        }
    })
}

exports.getDepartmentbyinstid = (req, res) => {
    const instid = req.params.instid
    db.query(`select * from ${process.env.RAVES_DBNAME}.department where instid='${instid}' and teaching=1 and active=1 order by name asc`, (err, deptData) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).send(deptData)
        }
    })
}

exports.getOneDepartmentbyDeptid=async(req,res)=>{
    const deptid=req.params.deptid
    db.query(`select * from ${process.env.RAVES_DBNAME}.department where deptid='${deptid}' and teaching=1 and active=1 order by name asc`, (err, deptData) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).send(deptData[0])
        }
    })
}


exports.getDepartmentName = async (req, res) => {
    const deptids = req.body.deptids
    await db.query(`select deptid,name from ${process.env.RAVES_DBNAME}.department where active=1 and deptid in ('${deptids.join("','")}')`, (err, data) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.status(200).send(data)
      }
    })
  }
