const db = require("../../../Config/DB/tle.db")
const date = require('../../../Utils/TleUtils/dateUtils')
const uuid = require('../../../Utils/TleUtils/createUUID')
const semester=require("../../RavesController/semester")

exports.SaveMlod = (req, res) => {
    // console.log(req.body)
    const aid = req.body.aid
    const instgpid = req.body.instgpid
    const instid = req.body.instid
    const mlodid = uuid.create_UUID()
    const ayid = req.body.ayid
    const bid = req.body.bid
    const cid = req.body.cid
    const section = req.body.section
    const semid = req.body.semid
    const sid = req.body.sid
    const regno = req.body.regno
    const type = req.body.type
    const noofdays = req.body.noofdays
    const fromdate = req.body.fromdate
    const fromsession = req.body.fromsession
    const todate = req.body.todate
    const tosession = req.body.tosession
    const remarks = req.body.remarks
    const active = true
    const createat = date.getCurrentDate()
    const createdby = req.body.createdby
    const updateat = date.getCurrentDate()
    const updateby = req.body.updateby
    const name = req.body.name
    const auth = req.headers.authorization

    db.query(`select * from ${process.env.TLE_DBNAME}.stumlod  where regno='${regno}' and fromdate=${fromdate}  `,  async (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (data != null && data.length == 0) {
                // await client.findWorkingDay(bid, section, fromdate, todate, auth, (err, findwokingday) => {
                //     let workingDay = findwokingday.filter(v => v.daytype === "Workingday")
                //     if (workingDay.length !== 0) {

                        db.query(`insert into ${process.env.TLE_DBNAME}.stumlod  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
                        [aid, instgpid, instid, mlodid, ayid, bid, cid, section, semid, sid, regno, type, noofdays, fromdate, fromsession, todate, tosession, remarks, active, createat, createdby, updateat, updateby, name],
                            (err, data) => {
                                if (err) {
                                    console.log(err)
                                    res.status(500).send(`${type} is not Saved`)
                                } else {
                                    res.status(200).send(`${type} Saved Successfully`)
                                }
                            })
                //     }else{
                //         res.status(404).send('Non-Workingday')
                //     }
                // })

            }
            else {
                // console.log("hai")
                res.status(400).send(`${data[0].type} Record Exist for Reg No: ${regno}`)
            }
        }
    })



}

exports.
getMlodData = async (req, res) => {
    const bid = req.params.bid
    const auth = req.headers.authorization
    // console.log(req.headers);
    const myjson={bid:bid}
    await semester.findByBid(myjson, async (err, findsem) => {
        if (err) {
            res.status(500).send(err)
        } else {
            // console.log(findsem);
            if (findsem != null) {
                const startdate = findsem.startdate
                const enddate = findsem.enddate
                // console.log(startdate)
                // console.log(enddate);


                await db.query(`select * from ${process.env.TLE_DBNAME}.stumlod where bid='${bid}' and fromdate between ${startdate} and ${enddate} order by regno asc`, 
                    async (err, data) => {
                        // console.log(data)
                        if (err) {
                            await res.status(500).send(err)
                        } else {
                            // console.log(data)
                            await res.status(200).send(data)
                            console.log(data);
                        }
                    })
            } else {
                res.status(404).send("no data found")
            }
        }
    })
}