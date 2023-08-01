const db = require("../../../Config/DB/tle.db")
const date = require('../../../Utils/TleUtils/dateUtils')
const uuid = require('../../../Utils/TleUtils/createUUID')
const semester=require("../../RavesController/semester")

exports.saveLongabsent = (req, res) => {
    const aid = req.body.aid
    const instgpid = req.body.instgpid
    const instid = req.body.instid
    const discontinueid = uuid.create_UUID()
    const ayid = req.body.ayid
    const bid = req.body.bid
    const cid = req.body.cid
    const semid = req.body.semid
    const sid = req.body.sid
    const regno = req.body.regno
    const discontinuedate = req.body.discontinuedate
    const type = req.body.type
    const remarks = req.body.remarks
    const active = true
    const createat = date.getCurrentDate()
    const createdby = req.body.createdby 
    const updateat = date.getCurrentDate()
    const updateby = req.body.updateby
    const name = req.body.name
    const section = req.body.section

    db.query(`select * from ${process.env.TLE_DBNAME}.stulongabsent where regno='${regno}' `, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (data != null && data.length == 0) {
                db.query(`insert into ${process.env.TLE_DBNAME}.stulongabsent  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [aid, instgpid, instid, discontinueid, ayid, bid, cid, semid, sid, regno, name, section, discontinuedate, type, remarks, active, createat, createdby, updateat, updateby], (err, data) => {
                        if (err) {
                            // console.log(err)
                            res.status(500).send(`${type} is not updated`)
                        } else {
                            res.status(200).send(`${type} is  updated`)
                        }
                    })
            }
            else {
                // console.log(data)
                res.status(400).send(`Reg No: ${regno} - Already Marked as ${data[0].type}`)
            }
        }
    })
}

exports.getLADAData = async (req, res) => {
    const bid = req.params.bid
    const auth = req.headers.authorization;
    // console.log(bid)
    const myjson={bid:bid}
    await semester.findByBid(myjson, async (err,status, findsem) => {
        if (err) {
            res.status(500).send(err)
        } else {
            // console.log(findsem);
            if (findsem != null) {
                const startdate = findsem.startdate
                const enddate = findsem.enddate 
                // console.log(startdate)
                // console.log(enddate)

                await db.query(`SELECT * FROM ${process.env.TLE_DBNAME}.stulongabsent where bid='${bid}' `, 
                    async (err, data) => {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            res.status(200).send(data)
                        }
                    })
            } else {
                res.send(204).send("no data found")
            }
        }
    })
}