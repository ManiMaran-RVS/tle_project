const db = require("../../Config/DB/tle.db")
const Uuid = require('../../Utils/TleUtils/createUUID')
const DayWiseReport = require('../../View/AttendanceView/dayWiseReportView')


exports.dayWiseTable = (reqData, recordData) => {
    // console.log(reqData.dayreport)
    const daywisereport = new DayWiseReport(null)

    daywisereport.aid = reqData.aid
    daywisereport.instgpid = reqData.instgpid
    daywisereport.ayid = reqData.ayid
    daywisereport.instid = reqData.instid
    daywisereport.deptid = reqData.deptid
    daywisereport.cid = reqData.cid
    daywisereport.bid = reqData.bid
    daywisereport.section = reqData.section
    daywisereport.semestertype = reqData.semestertype
    daywisereport.attendancedate = reqData.attendancedate
    daywisereport.dayreport = JSON.stringify(reqData.dayreport)
    daywisereport.createdby = reqData.createdby
    daywisereport.updateby = reqData.updateby

    // console.log(daywisereport.dayreport) 

    db.query(`select * from ${process.env.TLE_DBNAME}.daywisereport where cid=? and bid=? and section=? and semestertype=? and attendancedate=? `,
        [daywisereport.cid, daywisereport.bid, daywisereport.section, daywisereport.semestertype, daywisereport.attendancedate],
        (err, record) => {
            const save = `daywisereport is saved`
            const error = `daywisereport is not updated`
            // console.log(err)
            if (record != null) {

                // console.log(dayreport)
                db.query(`insert into ${process.env.TLE_DBNAME}.daywisereport values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [daywisereport.aid, daywisereport.instgpid, daywisereport.ayid, daywisereport.instid, daywisereport.deptid, daywisereport.cid,
                    daywisereport.bid, daywisereport.section, daywisereport.semestertype, daywisereport.attendancedate,
                    daywisereport.dayreportid, daywisereport.dayreport, daywisereport.active, daywisereport.createat, daywisereport.createdby,
                    daywisereport.updateat, daywisereport.updateby],
                    (err, retuenData) => {
                        if (err) {
                            // console.log(err)
                            return recordData(error, null)
                        } else {
                            // console.log(retuenData)
                            // console.log("daywise report insert")
                            return recordData(null, save)
                        }
                    })
            } else {
                db.query(`update ${process.env.TLE_DBNAME}.daywisereport set dayreport=? , updateat=? , updateby=? where cid=? and bid=? and section=? and semestertype=? and attendancedate=?`,
                    [monthreport, updateat, updateby, cid, bid, section, semestertype, attendancedate],
                    (err, updatereport) => {
                        if (err) {
                            // console.log(err)
                            return recordData(error, null)
                        } else {
                            // console.log(saved)
                            return recordData(null, save)
                        }
                    })
            }
        })
}