const db = require("../../Config/DB/tle.db")
const getDate = require('../../Utils/TleUtils/dateUtils')

exports.Attendancewithouthour = (reqData, errdata) => {

    const aid = reqData.aid
    const instgpid = reqData.instgpid
    const ayid = reqData.ayid
    const instid = reqData.instid
    const deptid = reqData.deptid
    const cid = reqData.cid
    const bid = reqData.bid
    const section = reqData.section
    const semestertype = reqData.semestertype
    const semesternumber = reqData.semesternumber
    const attendancedate = reqData.attendancedate
    const dayorder = reqData.dayorder
    const caldraftid = reqData.caldraftid
    const attendanceid = reqData.attendanceid
    const attendancerecord = JSON.stringify(reqData.attendancerecord)
    const active = true
    const createat = getDate.getCurrentDate()
    const createdby = reqData.createdby
    const updateat = getDate.getCurrentDate()
    const updateby = reqData.updateby
    // console.log(attendancerecord);
    db.query(`select * from  ${process.env.TLE_DBNAME}.stuattendance where aid=? and instgpid=? and instid=? and ayid=? and bid=? and semestertype=? and semesternumber=? and attendancedate=? and section=? and active=1`, [aid, instgpid, instid, ayid, bid, semestertype, semesternumber, attendancedate, section],
        (errer, data) => {
            console.log(errer);
            const save = `hour is saved`
            const error = `hour is not updated`
            if (data != null && data.length == 0) {

                db.query(`insert into ${process.env.TLE_DBNAME}.stuattendance  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [aid, instgpid, ayid, instid, deptid, cid, bid, section, semestertype, semesternumber, attendancedate, dayorder, caldraftid, attendanceid, attendancerecord, active, createat, createdby, updateat, updateby],
                    (err) => {
                        if (err) {
                            console.log(err, 1);
                            return errdata(error, null)
                        }
                        else {

                            return errdata(null, save)
                        }
                    })
            } else {
                db.query(`update ${process.env.TLE_DBNAME}.stuattendance set attendancerecord=? , updateat=? , updateby=? where section=? and bid=? and cid=? and semestertype=? and semesternumber=? and attendancedate=?`, [attendancerecord, updateat, updateby, section, bid, cid, semestertype, semesternumber, attendancedate], (err, data) => {
                    if (err) {
                        console.log(err);
                        return errdata(error, null)
                    }
                    else {
                        return errdata(null, save)
                    }

                })

            }
        })

}



// exports.Attendancetable = (reqData, hour, errdata) => {

//     const aid = reqData.aid
//     const instgpid = reqData.instgpid
//     const ayid = reqData.ayid
//     const instid = reqData.instid
//     const deptid = reqData.deptid
//     const cid = reqData.cid
//     const bid = reqData.bid
//     const section = reqData.section
//     const semestertype = reqData.semestertype
//     const attendancedate = reqData.attendancedate
//     const dayorder = reqData.dayorder
//     const caldraftid = reqData.caldraftid
//     const attendanceid = reqData.attendanceid
//     const hour1 = JSON.stringify(reqData.hour1)
//     const hour2 = JSON.stringify(reqData.hour2)
//     const hour3 = JSON.stringify(reqData.hour3)
//     const hour4 = JSON.stringify(reqData.hour4)
//     const hour5 = JSON.stringify(reqData.hour5)
//     const hour6 = JSON.stringify(reqData.hour6)
//     const hour7 = JSON.stringify(reqData.hour7)
//     const hour8 = JSON.stringify(reqData.hour8)
//     const hour9 = JSON.stringify(reqData.hour9)
//     const hour10 = JSON.stringify(reqData.hour10)
//     const active = reqData.active
//     const createat = reqData.createat
//     const createdby = reqData.createdby
//     const updateat = reqData.updateat
//     const updateby = reqData.updateby

//     db.query("select * from  attendance where aid=? and instgpid=? and instid=? and ayid=? and bid=? and semestertype=? and attendancedate=? and section=? and active=1", [aid, instgpid, instid, ayid, bid, semestertype, attendancedate, section],
//         (err, data) => {
//             const save = `hour${hour} is saved`
//             const error = `hour${hour} is not updated`
//             if (data != null && data.length == 0) {

//                 db.query("insert into attendance  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//                     [aid, instgpid, ayid, instid, deptid, cid, bid, section, semestertype, attendancedate, dayorder, caldraftid, attendanceid, hour1, hour2, hour3, hour4, hour5, hour6, hour7, hour8, hour9, hour10, active, createat, createdby, updateat, updateby],
//                     (err) => {
//                         if (err) {
//                             return errdata(error, null)
//                         }
//                         else {

//                             return errdata(null, save)
//                         }
//                     })
//             } else {
//                 // console.log("hai")
//                 var query = `update attendance set hour${hour}=? , updateat=? , updateby=? where section=? and bid=? and cid=? and semestertype=? and attendancedate=?  `

//                 const attendance = data[0]
//                 switch (hour) {
//                     case "1":
//                         if (attendance.hour1 || attendance.hour1 != null || attendance.hour1 == null) {
//                             db.query(query, [hour1, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err, data) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "2":
//                         if (attendance.hour2 || attendance.hour2 != null || attendance.hour2 == null) {
//                             db.query(query, [hour2, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {

//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)

//                                 }

//                             })
//                         }
//                         break;
//                     case "3":
//                         if (attendance.hour3 || attendance.hour3 != null || attendance.hour3 == null) {
//                             db.query(query, [hour3, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "4":
//                         if (attendance.hour4 || attendance.hour4 != null || attendance.hour4 == null) {
//                             db.query(query, [hour4, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "5":
//                         if (attendance.hour5 || attendance.hour5 != null || attendance.hour5 == null) {
//                             db.query(query, [hour5, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "6":
//                         if (attendance.hour6 || attendance.hour6 != null || attendance.hour6 == null) {
//                             db.query(query, [hour6, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "7":
//                         if (attendance.hour7 || attendance.hour7 != null || attendance.hour7 == null) {
//                             db.query(query, [hour7, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "8":
//                         if (attendance.hour8 || attendance.hour8 != null || attendance.hour8 == null) {
//                             db.query(query, [hour8, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }
//                             })
//                         }
//                         break;
//                     case "9":
//                         if (attendance.hour9 || attendance.hour9 != null || attendance.hour9 == null) {
//                             db.query(query, [hour9, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }

//                             })
//                         }
//                         break;
//                     case "10":
//                         if (attendance.hour10 || attendance.hour10 != null || attendance.hour10 == null) {
//                             db.query(query, [hour10, updateat, updateby, section, bid, cid, semestertype, attendancedate], (err) => {
//                                 if (err) {
//                                     return errdata(error, null)
//                                 }
//                                 else {
//                                     return errdata(null, save)
//                                 }
//                             })
//                         }
//                         break;

//                     default:
//                         console.log("working")
//                         // errdata(null)
//                         break;
//                 }
//             }
//         })

// }


