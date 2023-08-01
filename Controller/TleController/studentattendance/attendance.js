const db = require("../../../Config/DB/tle.db")
const AttedenceSave = require("../../../Model/AttendanceModel/attendanceModel")
const Attedence = require("../../../View/AttendanceView/attendanceView")
const HourAttedenceList = require('../../../View/AttendanceView/hourAttendanceList')
const HourAttedance = require('../../../View/AttendanceView/hourAttendance')
const constant = require('../../../Utils/TleUtils/constant')
const batch=require("../../RavesController/batch")
const student=require("../../RavesController/student")
const calender=require("../../RavesController/calendar")

exports.findAttendanceByMaster = (req, res) => {
   const semestertype = req.params.semestertype
   const bid = req.params.bid
   const section = req.params.section
   const date = req.params.date
   const auth = req.headers.authorization

   const myjson={bid:bid}

   new Attedence(null)
   batch.getBid(myjson,(err, findBatch) => {
      const batch = findBatch
      // console.log(JSON.stringify(batch) + "batchData")
      if (batch != null) {
         db.query(`select * from ${process.env.TLE_DBNAME}.stuattendance where aid='${batch.aid}' and instid='${batch.instid}' and ayid='${batch.ayid}' and bid='${batch.bid}' and section='${section}' and semestertype='${semestertype}' and attendancedate=${date} and active=1`, 
            (err, attendanceData) => {
               // console.log(attendanceData)
               if (err) {
                  res.status(500).send(err)
               } else if (attendanceData != null && attendanceData != undefined && attendanceData.length < 0) {
                  res.status(200).send('no data found')
               } else {
                  res.status(200).send(attendanceData[0])
               }


            })
      }
   })

}


exports.findAttendance = (req, res) => {
   const bid = req.params.bid
   const section = req.params.section
   const date = req.params.date
   const hour = req.params.hour
   const page = req.query.page
   const limit = req.query.size
   const auth = req.headers.authorization
   const instid = req.query.instid
   const ayid = req.query.ayid
   const attendance = new Attedence()
   // console.log(auth);
   const myjson={bid:bid, section:section}
   student.findByBidSection(myjson, (err, findbidsection) => {
      const batch = findbidsection
      if (batch !== null) {
         const myjson={bid:bid, section:section, date:date, instid:instid, ayid:ayid}
         calender.findCalendarsByDate(myjson, (err, findcalender) => {
            var calender = findcalender
            // console.log(calender)
            if (calender !== null) {
               attendance.aid = calender.aid
               attendance.instgpid = calender.instgpid
               attendance.instid = instid
               attendance.ayid = ayid
               attendance.deptid = batch.deptid
               attendance.bid = bid
               attendance.cid = batch.cid
               attendance.section = section
               attendance.caldraftid = calender.caldraftid
               attendance.attendancedate = date
               attendance.dayorder = calender.dayorder
               attendance.semestertype = calender.semestertype
               attendance.semesternumber = calender.semesternumber

               //  console.log(attendance)
               if (batch.students.length !== 0) {
                  var studentData = batch.students
                  // console.log(studentData)

                  this.getNewHour(attendance, studentData, date, instid, ayid, auth, (err, data) => {
                     if (err) {
                        res.status(500).send(err)
                     }
                     // data.programmename = batch.programmename
                     // data.programmeshortname = batch.programmeshortname
                     // data.bname = batch.bname

                     res.status(200).send(data)
                  })

                  // this.getHours(attendance, studentData, hour, page, limit, (err, data) => {
                  //    if (err) {
                  //       res.status(500).send(err)
                  //    }
                  //    data.programmename = batch.programmename
                  //    data.programmename = batch.programmename
                  //    data.bname = batch.bname

                  //    res.status(200).send(data)
                  // })
               } else {
                  res.status(404).send('batch student data not found')
               }
            } else {
               res.status(404).send('calender student data not found')
            }

         })
      } else {
         res.status(404).send("No Batch found!")
      }
   })
}

exports.getStudent = async (studentData, hourData) => {
   var datahour = []
   let sno = 1

   studentData.forEach(student => {
      const hourlist = new HourAttedenceList()
      hourlist.sno = sno++
      hourlist.regno = student.regno
      hourlist.sid = student.sid
      hourlist.admissionid = student.admissionid
      hourlist.name = student.firstname
      hourlist.status = constant.present()
      hourlist.hour1 = constant.present()
      hourlist.hour2 = constant.present()
      hourlist.hour3 = constant.present()
      hourlist.hour4 = constant.present()
      hourlist.hour5 = constant.present()
      hourlist.hour6 = constant.present()
      hourlist.hour7 = constant.present()
      hourlist.hour8 = constant.present()
      hourlist.hour9 = constant.present()
      hourlist.hour10 = constant.present()

      datahour.push(hourlist)

   })
   hourData(null, datahour)
}



exports.getNewHour = async (attendance, studentData, date, instid, ayid, auth, resData) => {


   this.getStudent(studentData, async (err, studenthourlist) => {
      if (studenthourlist.length !== 0) {
         await db.query(`select * from ${process.env.TLE_DBNAME}.stuattendance where instid='${instid}' and ayid='${ayid}' and bid='${attendance.bid}' and section='${attendance.section}' and semesternumber=${attendance.semesternumber} and attendancedate=${parseInt(attendance.attendancedate)} and active=1`, (attendanceerr, attendanceData) => {
            if (attendanceerr) {
               resData(null, attendanceerr)
            } else {
               if (attendanceData.length === 0) {
                  this.checkMlod(studenthourlist, date, attendance.bid, attendance.section, instid, ayid, auth, async (err, checkMlodData) => {
                     this.checkLongAbsent(checkMlodData, date, attendance.bid, attendance.section, instid, ayid, auth, async (err, checkLongAbsentData) => {
                        attendance.attendancerecord = checkLongAbsentData
                        resData(null, attendance)
                     })
                  })
               } else {
                  var predata=attendanceData[0]
                  var prestundetlist=JSON.parse(predata.attendancerecord)
                  prestundetlist.forEach(predata=>{
                     studenthourlist.find(studentlist=>{
                        if(predata.sid===studentlist.sid){
                           predata.name=studentlist.name
                           predata.regno=studentlist.regno
                        }
                     })
                  })
                  this.checkMlod(prestundetlist, date, attendance.bid, attendance.section, instid, ayid, auth, async (err, checkMlodData) => {
                     this.checkLongAbsent(checkMlodData, date, attendance.bid, attendance.section, instid, ayid, auth, async (err, checkLongAbsentData) => {
                        attendance.attendancerecord = checkLongAbsentData
                        resData(null, attendance)
                     })
                  }) 
               }
            }
         })
      } else {
         resData(null, [])
      }
   })


}

exports.checkMlod = async (studentData, date, bid, section, instid, ayid, auth, checkMlodData) => {
   var regno = []
   await studentData.map((data) => {
      regno.push(data.regno)
   })
   var todate = undefined
   const myjson={bid:bid, section:section, date:date, todate:todate, instid:instid, ayid:ayid }
   await calender.mlodcalender(myjson,async (err, findWorkingDayData) => {
      await db.query(`select *  from ${process.env.TLE_DBNAME}.stumlod where bid='${bid}' and section='${section}' and regno in ('${regno.join("','")}') and fromdate between ${findWorkingDayData.calStartDate} and ${findWorkingDayData.calEndDate}`, async (err, mlodData) => {
         if (mlodData.length === 0) {
            // console.log('mloddata=[]')
            await checkMlodData(null, studentData)
         } else {
            // console.log('mloddata=1')
            var findHourKey = Object.keys(studentData[0]).map(v => {
               return {
                  column: v
               }
            })
            var filterHourKey = findHourKey.filter(v => v.column.startsWith('ho')).slice(0, 7)
            const data1 = studentData
            await mlodData.forEach(async (mlod) => {

               if (mlod != null) {
                  if (mlod.noofdays <= 1) {
                     if (data1 != null && mlod != null && data1 != undefined && mlod != undefined) {
                        data1.filter(filterStudent => {
                           if (filterStudent.regno === mlod.regno) {
                              if (parseInt(date) === mlod.fromdate) {
                                 filterHourKey.map((hourkey, i) => {
                                    filterStudent[hourkey.column] = mlod.type
                                 })
                              }
                           }
                        })
                     }
                  }

                  if (mlod.noofdays > 1) {
                     findWorkingDayData.data.map((v) => {
                        if (v.daytype === "Workingday") {

                           data1.filter(async (filterStudent) => {
                              if (filterStudent.regno === mlod.regno) {
                                 // console.log(v.caldate >= mlod.fromdate && v.caldate <= mlod.todat)
                                 if (mlod.fromdate <= v.caldate && v.caldate <= mlod.todate) {
                                    if (v.caldate === parseInt(date)) {
                                       filterHourKey.map((hourkey, i) => {
                                          // console.log( filterStudent[hourkey.column] = mlod.type)
                                          filterStudent[hourkey.column] = mlod.type
                                       })
                                    }
                                 }
                              }

                           })
                        }
                     })
                  }
               }
            });
            checkMlodData(null, studentData)
         }
      })

   })
}

exports.checkLongAbsent = async (studentData, date, bid, section, instid, ayid, auth, checkLongAbsentData) => {
   var regno = []
   await studentData.map((data) => {
      regno.push(data.regno)
   })
   var todate = undefined
   const myjson={bid:bid, section:section, date:date, todate:todate, instid:instid, ayid:ayid }

   await calender.mlodcalender(myjson,async (err, findWorkingDayData) => {
      await db.query(`select *  from ${process.env.TLE_DBNAME}.stulongabsent where bid='${bid}'  and regno in ('${regno}') and discontinuedate between ${findWorkingDayData.calStartDate} and ${findWorkingDayData.calEndDate}`,
         async (err, longAbsentData) => {
            if (longAbsentData.length <= 0 || longAbsentData == null) {
               await checkLongAbsentData(null, studentData)
            } else {
               var findHourKey = Object.keys(studentData[0]).map(v => {
                  return {
                     column: v
                  }
               })
               var filterHourKey = findHourKey.filter(v => v.column.startsWith('ho')).slice(0, 7)
               const data1 = studentData

               longAbsentData.forEach((longabsent) => {
                  // console.log(findWorkingDayData);
                  findWorkingDayData.data.map((v) => {
                     if (v.caldate >= longabsent.discontinuedate) {
                        if (v.daytype === "Workingday") {
                           if (data1 != null && longabsent != null && data1 != undefined && longabsent != undefined) {
                              data1.filter(async (filterStudent) => {
                                 if (filterStudent.regno === longabsent.regno) {
                                    filterHourKey.map((hourkey, i) => {
                                       filterStudent[hourkey.column] = 'LA'
                                    })
                                 }
                              })
                           }
                        }
                     }
                  })
               })
               checkLongAbsentData(null, studentData)
            }
         })
   })
}


exports.saveattendance = (req, res) => {
   const reqData = req.body
   const hour = req.params.hour
   // console.log
   AttedenceSave.Attendancetable(reqData, hour, (errdata) => {
      if (errdata !== null) {
         res.status(500).send(errdata)
      } else {
         res.status(200).send(`Hour-${hour} Saved`)
      }
   })
}



exports.saveattendancerecord = (req, res) => {
   const reqData = req.body
   // console.log(req.body)
   AttedenceSave.Attendancewithouthour(reqData, (errdata) => {
      if (errdata !== null) {
         res.status(500).send(errdata)
      } else {
         res.status(200).send(` Saved`)
      }
   })
}


// exports.getHours = (attendance, studentData, hour, page, limit, data) => {
//    // console.log(attendance)
//    db.query("select * from  attendance where aid='${}' and instgpid='${}' and instid='${}' and ayid='${}' and bid='${}' and semestertype='${}' and attendancedate='${}' and section='${}'and active=1 ",
//       [attendance.aid, attendance.instgpid, attendance.instid, attendance.ayid, attendance.bid, attendance.semestertype, attendance.attendancedate, attendance.section],
//       (err, attendanceData) => {
//          // console.log(attendancedata+"ji")
//          const attendancedata = attendanceData[0]
//          // console.log(attendancedata)
//          if (err) {
//             res.status(500).send(err)
//          } else {
//             if (attendancedata != undefined && attendancedata != null) {
//                // console.log(attendancedata)
//                attendance.attendanceid = attendancedata.attendanceid
//                attendance = attendancedata

//             }
//             this.getStudent(studentData, (err, hourData) => {
//                const hourAttedance = new HourAttedance()
//                hourAttedance.attendance = hourData
//                switch (hour) {
//                   case "1":
//                      if (attendancedata != null && attendancedata.hour1 != null) {
//                         const hour1 = JSON.parse(attendancedata.hour1)
//                         hourAttedance.absents = hour1.absents
//                         hourAttedance.presents = hour1.presents
//                         hourAttedance.attendance = hour1.attendance
//                         attendance.hour1 = hourAttedance
//                      } else {
//                         attendance.hour1 = hourAttedance
//                      }
//                      break;
//                   case "2":
//                      if (attendancedata != null && attendancedata.hour2 != null) {
//                         const hour2 = JSON.parse(attendancedata.hour2)
//                         hourAttedance.absents = hour2.absents
//                         hourAttedance.presents = hour2.presents
//                         hourAttedance.attendance = hour2.attendance
//                         attendance.hour2 = hourAttedance
//                      } else {
//                         attendance.hour2 = hourAttedance
//                      }
//                      break;
//                   case "3":
//                      if (attendancedata != null && attendancedata.hour3 != null) {
//                         const hour3 = JSON.parse(attendancedata.hour3)
//                         hourAttedance.absents = hour3.absents
//                         hourAttedance.presents = hour3.presents
//                         hourAttedance.attendance = hour3.attendance
//                         attendance.hour3 = hourAttedance
//                      } else {
//                         attendance.hour3 = hourAttedance
//                      }
//                      break;
//                   case "4":
//                      if (attendancedata != null && attendancedata.hour4 != null) {
//                         const hour4 = JSON.parse(attendancedata.hour4)
//                         hourAttedance.absents = hour4.absents
//                         hourAttedance.presents = hour4.presents
//                         hourAttedance.attendance = hour4.attendance
//                         attendance.hour4 = hourAttedance
//                      } else {
//                         attendance.hour4 = hourAttedance
//                      }
//                      break;
//                   case "5":
//                      if (attendancedata != null && attendancedata.hour5 != null) {
//                         const hour5 = JSON.parse(attendancedata.hour5)
//                         hourAttedance.absents = hour5.absents
//                         hourAttedance.presents = hour5.presents
//                         hourAttedance.attendance = hour5.attendance
//                         attendance.hour5 = hourAttedance
//                      } else {
//                         attendance.hour5 = hourAttedance
//                      }
//                      break;
//                   case "6":
//                      if (attendancedata != null && attendancedata.hour6 != null) {
//                         const hour6 = JSON.parse(attendancedata.hour6)
//                         hourAttedance.absents = hour6.absents
//                         hourAttedance.presents = hour6.presents
//                         hourAttedance.attendance = hour6.attendance
//                         attendance.hour6 = hourAttedance
//                      } else {
//                         attendance.hour6 = hourAttedance
//                         // console.log(attendance)
//                      }
//                      break
//                   case "7":
//                      if (attendancedata != null && attendancedata.hour7 != null) {
//                         A
//                         const hour7 = JSON.parse(attendancedata.hour7)
//                         hourAttedance.absents = hour7.absents
//                         hourAttedance.presents = hour7.presents
//                         hourAttedance.attendance = hour7.attendance
//                         attendance.hour7 = hourAttedance
//                      } else {
//                         attendance.hour7 = hourAttedance
//                      }
//                      break
//                   case "8":
//                      if (attendancedata != null && attendancedata.hour8 != null) {
//                         const hour8 = JSON.parse(attendancedata.hour8)
//                         hourAttedance.absents = hour8.absents
//                         hourAttedance.presents = hour8.presents
//                         hourAttedance.attendance = hour8.attendance
//                         attendance.hour8 = hourAttedance
//                      } else {
//                         attendance.hour8 = hourAttedance
//                      }
//                      break
//                   case "9":
//                      if (attendancedata != null && attendancedata.hour9 != null) {
//                         const hour9 = JSON.parse(attendancedata.hour9)
//                         hourAttedance.absents = hour9.absents
//                         hourAttedance.presents = hour9.presents
//                         hourAttedance.attendance = hour9.attendance
//                         attendance.hour9 = hourAttedance
//                      } else {
//                         attendance.hour9 = hourAttedance
//                      }
//                      break
//                   case "10":
//                      if (attendancedata != null && attendancedata.hour10 != null) {
//                         const hour10 = JSON.parse(attendancedata.hour10)
//                         hourAttedance.absents = hour10.absents
//                         hourAttedance.presents = hour10.presents
//                         hourAttedance.attendance = hour10.attendance
//                         attendance.hour10 = hourAttedance
//                      } else {
//                         attendance.hour10 = hourAttedance
//                      }
//                      break
//                   default:
//                      // console.log("defalt")
//                      break;
//                }
//                // console.log(attendance)
//                data(null, attendance)
//             })
//          }
//       })
// }