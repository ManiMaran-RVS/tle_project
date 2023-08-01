const db = require("../../Config/DB/tle.db");
const date = require('../../Utils/RavesUtils/dateUtils')

exports.getSemesterByBid=(req,res)=>{
    this.findByBid(req,(err,status,response)=>{
        if (err) {
            res.status(status).json(err)
        }else{
            res.status(status).json(response)
        }
    })
}

exports.findByBid = (req, res) => {
    const bid = req.bid||req.params.bid
    const currentDate = date.getCurrentDate()
    // const curdate=1682640000000
    // console.log(instid,bid,currentDate);
    db.query(`select * from ${process.env.RAVES_DBNAME}.semester where bid='${bid}' and active=1 and ${currentDate} between startdate and enddate`,
        async (err, data) => {
            if (err) {
                res(null,500,err)
            } else {
              if (data.length!=0) {
                res(null,200,data[0])
              } else {
                res(null,404,"data not found")
              }

            }
        })
}


exports.findSemesterByBid = (req, res) => {
    const instid = req.params.instid
    const bid = req.params.bid
    db.query(`SELECT distinct semesternumber FROM ${process.env.RAVES_DBNAME}.semester where bid='${bid}' and instid='${instid}' and active=true`,(err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send("err data")
        } else {
            // console.log(data)
            res.status(200).send(data)
        }
    })
}
exports.findOneSemesterRecord = (req, res) => {
    const cid = req.cid||req.params.cid
    const instid =  req.instid||req.params.instid
    const bid =  req.bid||req.params.bid
    const semesternumber =  req.semesternumber||req.params.semesternumber
    db.query(`SELECT * FROM ${process.env.RAVES_DBNAME}.semester where instid='${instid}' and cid='${cid}' and bid='${bid}' and semesternumber='${semesternumber}' and active=true`, (err, data) => {
        if (err) {
            res.status(500).send("err data")
        } else {
            // console.log(data)
            res.status(200).send(data[0])
        }
    })
}