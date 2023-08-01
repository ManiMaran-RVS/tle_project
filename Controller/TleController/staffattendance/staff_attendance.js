const db = require("../../../Config/DB/tle.db")
const getDate = require('../../../Utils/TleUtils/dateUtils')
const StaffAttendance = require("../../../View/AttendanceView/staffAttendanceView")
const constant = require('../../../Utils/TleUtils/constant')
const employee=require("../../RavesController/employee")

exports.findattendance = (req, res) => {
    const ayid = req.params.ayid
    const instid = req.params.instid
    const deptid = req.params.deptid
    const date = req.params.date
    // console.log(ayid,instid,deptid) 
    var staffmapData = []
    const myjson={
        instid:instid, ayid:ayid, deptid:deptid, date:date,
    }
    employee.getattendancedaytype(myjson, (err, calData) => {
        if (err) {
            res.sendStatus(500)
        } else {
            // console.log(calData,"2")
            if (calData !== 404) {
                // console.log(calData);
                var calenderdata = calData
                const myjson={instid:instid,deptid:deptid}
                employee.staffDetails(myjson, async (err, staffDetails) => {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        var staffData = staffDetails
                        // console.log(staffData);
                        let sno = 1
                        staffData.forEach(staff => {
                            const stafflist = new StaffAttendance.Stafflist()
                            stafflist.sno = sno++
                            stafflist.name = staff.firstname
                            stafflist.eid = staff.eid
                            stafflist.hour1 = constant.StaffStatus().present
                            stafflist.hour2 = constant.StaffStatus().present
                            stafflist.hour3 = constant.StaffStatus().present
                            stafflist.hour4 = constant.StaffStatus().present
                            stafflist.hour5 = constant.StaffStatus().present
                            stafflist.hour6 = constant.StaffStatus().present
                            stafflist.hour7 = constant.StaffStatus().present
                            stafflist.hour8 = constant.StaffStatus().present
                            stafflist.hour9 = constant.StaffStatus().present
                            stafflist.hour10 = constant.StaffStatus().present

                            staffmapData.push(stafflist)
                        })
                        // console.log(calenderdata);
                        var staffcal = new StaffAttendance.StaffAttendanceRecord()
                        staffcal.aid = calenderdata.aid
                        staffcal.ayid = calenderdata.ayid
                        staffcal.instid = calenderdata.instid
                        staffcal.deptid = deptid
                        staffcal.callevelid = calenderdata.callevelid
                        staffcal.attendancedate = calenderdata.caldate
                        staffcal.dayorder = calenderdata.dayorder
                        staffcal.staffdetails = staffmapData

                        await db.query(`select * from ${process.env.TLE_DBNAME}.staffattendance where instid='${instid}' and deptid='${deptid}' and attendancedate=${date}`, (err, data) => {
                            if (err) {
                                res.status(500).send(err)
                            } else {
                                if (data !== null && data.length !== 0) {
                                    staffcal.aid = data[0].aid
                                    staffcal.ayid = data[0].ayid
                                    staffcal.instid = data[0].instid
                                    staffcal.deptid = data[0].deptid
                                    staffcal.callevelid = data[0].callevelid
                                    staffcal.attendancedate = data[0].attendancedate
                                    staffcal.dayorder = data[0].dayorder
                                    staffcal.attendanceid = data[0].attendanceid
                                    staffcal.staffdetails = JSON.parse(data[0]['attendancerecord'])
                                }
                                res.status(200).send(staffcal)
                            }
                        })
                    }
                })
            } else {
                res.sendStatus(404)
            }
        }
    })
}


exports.savestaffattendance = (req, res) => {
    const aid = req.body.aid
    const ayid = req.body.ayid
    const instid = req.body.instid
    const deptid = req.body.deptid
    const callevelid = req.body.callevelid
    const attendancedate = req.body.attendancedate
    const dayorder = req.body.dayorder
    const attendanceid = req.body.attendanceid
    const attendancerecord = JSON.stringify(req.body.staffdetails)
    const active = true
    const createat = getDate.getCurrentDate()
    const createby = req.body.createby
    const updateat = getDate.getCurrentDate()
    const updateby = req.body.createby

    db.query(`select * from ${process.env.TLE_DBNAME}.staffattendance where aid='${aid}' and ayid='${ayid}' and instid='${instid}' and deptid='${deptid}' and callevelid='${callevelid}' and attendancedate='${attendancedate}' and dayorder=${dayorder} and active=1`, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (data != null && data.length === 0) {

                db.query(`insert into ${process.env.TLE_DBNAME}.staffattendance (aid,ayid,instid,deptid,callevelid,attendancedate,dayorder,attendanceid,attendancerecord,active,createat,createby,updateat,updateby) values('${aid}','${ayid}','${instid}','${deptid}','${callevelid}','${attendancedate}','${dayorder}','${attendanceid}','${attendancerecord}',${active},'${createat}','${createby}','${updateat}','${updateby}')`, (inserterr, data) => {

                    if (err) {
                        res.status(500).send(inserterr)
                    } else {
                        res.sendStatus(200)
                    }
                })
            } else {
                db.query(`update ${process.env.TLE_DBNAME}.staffattendance set attendancerecord='${attendancerecord}' ,updateat='${updateat}' ,updateby ='${updateby}' where attendanceid='${attendanceid}'`, (updateerr, data) => {
                    if (err) {
                        res.status(500).send(updateerr)
                    }
                    else {
                        res.sendStatus(200)
                    }
                })
            }
        }

    })


}



