const Uuid = require('../../../Utils/TleUtils/createUUID')
const Date = require('../../../Utils/TleUtils/dateUtils')
const db = require('../../../Config/DB/tle.db')

exports.subjectEntry = (req, res) => {
    const aid = req.body.aid
    const instid = req.body.instid
    const deptid = req.body.deptid
    const cid = req.body.cid
    const ayid = req.body.ayid
    const bid = req.body.bid
    const semnumber = req.body.semnumber
    const subid = req.body.subid || Uuid.create_UUID()
    const name = req.body.name
    const shortname = req.body.shortname
    const teachinghours=req.body.teachinghours
    const type=req.body.type
    const active = true
    const createdat = Date.getCurrentDate()
    const createdby = req.body.createdby
    const updateat = Date.getCurrentDate()
    const updateby = req.body.createdby
// console.log(aid,instid,deptid,cid,ayid,bid,semnumber,subid,name,shortname,type,active,createdat,createdby,updateat,updateby);
    db.query(`select * from ${process.env.TLE_DBNAME}.subject where subid=?`,
        [subid],
        (error, data) => {
            if (data <= 0 || data == undefined) {
                db.query(`insert into ${process.env.TLE_DBNAME}.subject values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [aid, instid, deptid, cid, ayid, bid, subid, semnumber, name, shortname,teachinghours, type, active,  createdat,createdby, updateat, updateby],
                (err, returnData) => {
                        if (err) { 
                            res.status(400).send(err)
                        } else {
                            res.status(200).send("subject added succesfully")
                        }
                    })
            } else {
                db.query(`update ${process.env.TLE_DBNAME}.subject set name=?, shortname=?,teachinghours=?,type=?, updatedby=? ,updatedat=?  where subid=? `,
                    [name, shortname,teachinghours,type, updateby, updateat, subid],
                    (err, data) => {
                        if (err) {
                            res.status(400).send(err)
                        }
                        else {
                            res.status(200).send("updated succesfully")
                        }
                    })
            }
        })
}

exports.getallsubject = (req, res) => {
    const instid = req.params.instid
    const deptid = req.params.deptid
    db.query(`select * from ${process.env.TLE_DBNAME}.subject where instid=? and deptid=? order by createdat desc `, [instid, deptid], (err, data) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send(data)
        }
    })
}

exports.deleteonesubject = (req, res) => {
    const subid = req.params.id

    db.query(`delete from ${process.env.TLE_DBNAME}.subject where subid=?`, [subid], (err, data) => {
        if (err) {
            res.send(400).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
}


exports.getfilteredsubject=(req,res)=>{
    const instid=req.body.instid
    const deptid=req.body.deptid
    const bid=req.body.bid
    const cid=req.body.cid
    const semnumber=req.body.semnumber
    db.query(`select * from ${process.env.TLE_DBNAME}.subject where instid='${instid}' and deptid='${deptid}' and bid='${bid}' and cid='${cid}' and semesternumber=${semnumber} and type in ('Optional', 'OptionalCompulsory')and active=1`,(err,subData)=>{
        if (err) {
            res.send(err)
        } else {
               
                res.status(200).send(subData)
            }
        })
}  