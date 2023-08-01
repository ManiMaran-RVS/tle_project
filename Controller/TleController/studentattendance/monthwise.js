const db = require("../../../Config/DB/tle.db")
const MonthWiseCalculation = require('../../../Model/AttendanceModel/attedenceCalculation')
const MonthWise = require("../../../View/AttendanceView/monthWiseView")
const StudentDetails = require("../../../View/AttendanceView/monthwiseStudentdetails")
const SaveMonthReport = require("../../../Model/AttendanceModel/monthWiseModel")
const getDate = require("../../../Utils/TleUtils/dateUtils")
const calender=require("../../RavesController/calendar")


exports.getMonthwiseReport = async (req, res) => {

    await this.monthwise(req, (err, returnData) => {
        if (err) {
            res.status(500).send("data not found")
        } else {
            res.status(200).send(returnData)
        }
    })
}

exports.monthwise = async (req, returnData) => {

    const bid = req.bid || req.params.bid
    const section = req.section || req.params.section
    const fromdate = req.fromdate || req.params.fromdate
    const todate = req.todate || req.params.todate
    const auth = req.auth || req.headers.authorization
    const instid = req.instid || req.query.instid
    const ayid = req.ayid || req.query.ayid


    var monthdata = []
    var studentList = []
    // console.log(bid,section,fromdate,todate)
    await db.query(`select * from ${process.env.TLE_DBNAME}.stuattendance where bid='${bid}' and section='${section}' and active=1 and attendancedate between ${fromdate} and ${todate} order by attendancedate asc`, 
        async (err, preattendanceData) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(dayWiseReport)
                const arr = preattendanceData
                var attendanceData = {}
                await this.getobject(arr, async (err, attendance) => {
                    await MonthWiseCalculation.attendanceCalculation(attendance, (err, attCalData) => {
                        // console.log(attCalData)
                        attendanceData = attCalData
                        attendanceData.attendancerecord.map((data) => {
                            const month = new MonthWise()
                            month.bid = data.bid
                            month.cid = data.cid
                            month.deptid = data.deptid
                            month.section = section
                            month.regno = data.regno
                            month.sid = data.sid
                            month.date = data.date
                            month.name = data.name
                            month.presentdays = data.presentdays
                            month.status = data.status
                            // console.log(month)
                            monthdata.push(month)
                        })
                    })
                })


                const mergeStatusData = Array.from(
                    new Set(
                        monthdata.map((month) => {
                            { return { regno: month.regno, sid: month.sid } }
                        })
                    ))
                    .map((v) => {
                        return {
                            regno: v.regno,
                            sid: v.sid,
                            status: monthdata.filter(s => s.sid === v.sid).map(e => {
                                return {
                                    regno: e.regno,
                                    sid: e.sid,
                                    date: e.date,
                                    status: e.status,
                                    presentdays: e.presentdays
                                }
                            })
                        }
                    })
                // console.log(ar)
                const mergePresentData = Object.values(
                    monthdata.reduce((value, i) => {
                        if (!value[i.sid]) {
                            value[i.sid] = { ...i, status: [] }
                        }
                        value[i.sid].status.push(i.status)
                        return value
                    }, {})
                )
                // console.log(mergePresentData)
                if (mergePresentData != null && mergeStatusData) {
                    await mergePresentData.map((data) => {
                        const studentDetails = new StudentDetails()
                        let view = mergeStatusData.find(v => v.sid === data.sid)
                        studentDetails.name = data.name
                        studentDetails.cid = data.cid
                        studentDetails.bid = data.bid
                        studentDetails.section = data.section
                        studentDetails.regno = view.regno
                        studentDetails.status = view.status
                        studentList.push(studentDetails)
                    })
                } else {
                    return null
                }
                if (studentList != null && studentList != undefined) {
                    // console.log(studentList)
                    await this.checkMlodData(studentList, bid, section, fromdate, todate, instid, ayid, auth, async (err, checkedMlodData) => {
                        if (err) {
                            // res.status(500).send(err)
                            returnData(null, err)
                        } else {

                            if (bid != null && section != null && fromdate != null && todate != null && checkedMlodData != null) {
                                await this.checklongAbsent(checkedMlodData, bid, section, fromdate, todate, instid, ayid, auth, async (err, checkedLongabsentData) => {
                                    if (err) {
                                        // res.status(500).send(err)
                                        returnData(null, err)
                                    } else {
                                        await this.checkWorkingDay(bid, section, fromdate, todate, checkedLongabsentData, instid, ayid, auth, async (err, checkedWorkingDays, calStartDate, calEndDate) => {
                                            // await res.send(checkedWorkingDays)
                                            attendanceData.calStartDate = calStartDate
                                            attendanceData.calEndDate = calEndDate
                                            attendanceData.attendancerecord = checkedWorkingDays

                                            returnData(null, attendanceData)
                                        })
                                    }

                                })

                            }
                        }
                    })
                }
            }
        })
}

exports.getobject = (arr, object) => {
    for (var i = 0; i < arr.length; i++) {
        const attendance = arr[i]
        object(null, attendance)
    }
}

exports.checkMlodData = async (studentList, bid, section, fromdate, todate, instid, ayid, auth, checkedMlodData) => {
    // console.log(studentList)
    var regno = []
    await studentList.map((data) => {
        regno.push(data.regno)
    })
    const myjson={bid:bid, section:section, fromdate:fromdate, todate:todate, instid:instid, ayid:ayid}
    // console.log(regno,bid,section,fromdate,todate)
    await calender.mlodcalender(myjson, async (err, findworkingday) => {
        // console.log(err)
        if (bid != null && section != null && fromdate != null && todate != null && regno != null && regno.length > 0) {
            await db.query(`select * from ${process.env.TLE_DBNAME}.stumlod where bid='${bid}' and section='${section}' and regno in ('${regno}') and fromdate between ${fromdate} and ${todate}`, 
                async (err, mlodData) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        if (mlodData.length <= 0 || mlodData == null) {
                            await checkedMlodData(null, studentList)
                        } else {
                            const data1 = studentList

                            await mlodData.forEach(async (mlod) => {

                                if (mlod != null) {
                                    if (mlod.noofdays <= 1) {
                                        if (data1 != null && mlod != null && data1 != undefined && mlod != undefined) {
                                            let findStudent = data1.find(e => e.regno == mlod.regno)
                                            if (findStudent != null && findStudent != undefined) {
                                                let findStudentStatus = findStudent.status.find(v => v.date === mlod.fromdate)
                                                if (findStudentStatus != null && findStudentStatus != undefined) {
                                                    if (findStudentStatus.status == 'PRESENT') {
                                                        findStudentStatus = findStudentStatus
                                                    } else {

                                                        findStudentStatus.status = mlod.type
                                                        findStudentStatus.presentdays = findStudentStatus.presentdays + mlod.noofdays
                                                    }
                                                }
                                            }
                                        }

                                    }

                                    if (mlod.noofdays > 1) {
                                        findworkingday.data.map((v) => {
                                            if (v.caldate >= mlod.fromdate && v.caldate <= mlod.todate) {

                                                if (v.daytype === "Workingday") {
                                                    if (data1 != null && mlod != null && data1 != undefined && mlod != undefined) {
                                                        let findStudent = data1.find(c => c.regno === mlod.regno)
                                                        if (findStudent != null && findStudent != undefined) {
                                                            let findStudentStatus = findStudent.status.find(a => a.date === v.caldate)
                                                            if (findStudentStatus != null && findStudentStatus != undefined) {
                                                                if (findStudentStatus.status == 'PRESENT') {
                                                                    findStudentStatus = findStudentStatus
                                                                } else {

                                                                    findStudentStatus.status = mlod.type
                                                                    findStudentStatus.presentdays = 1
                                                                }
                                                            }
                                                        }
                                                    }


                                                }
                                                else {
                                                    console.log("nonworking day")
                                                }
                                            }
                                        })

                                    }
                                }

                            });
                            checkedMlodData(null, data1)
                        }
                    }
                })
        } else {
            checkedMlodData("query data not found", null)
        }
    })

}
exports.checklongAbsent = async (checkedMlodData, bid, section, fromdate, todate, instid, ayid, auth, checkedLongabsentData) => {

    var regno = []
    await checkedMlodData.map((data) => {
        regno.push(data.regno)
    })

    const myjson={bid:bid, section:section, fromdate:fromdate, todate:todate, instid:instid, ayid:ayid}
    // console.log(regno,bid,section,fromdate,todate)
    await calender.mlodcalender(myjson, async (err, findworkingday) => {


        if (bid != null && section != null && fromdate != null && todate != null && regno != null && regno.length > 0) {
            await db.query(`select * from ${process.env.TLE_DBNAME}.stulongabsent where bid='${bid}' and regno in ('${regno}') and discontinuedate between ${fromdate} and ${todate}`, 
                async (err, longAbsentData) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if (longAbsentData.length <= 0 || longAbsentData == null) {
                            await checkedLongabsentData(null, checkedMlodData)
                        }
                        else {
                            longAbsentData.forEach((e) => {
                                // console.log(findworkingday);
                                findworkingday.data.map((v) => {
                                    if (v.caldate >= e.discontinuedate && v.daytype === "Workingday") {
                                        if (checkedMlodData != null && e != null && checkedMlodData != undefined && e != undefined) {
                                            let findStudent = checkedMlodData.find(c => c.regno == e.regno)
                                            if (findStudent != null && findStudent != undefined) {
                                                let findStudentStatus = findStudent.status.find(a => a.date === v.caldate)
                                                if (findStudentStatus != null && findStudentStatus != undefined) {
                                                    findStudentStatus.status = "LA"
                                                    findStudentStatus.presentdays = 0
                                                }
                                            }
                                        }
                                    }
                                })
                            })
                            checkedLongabsentData(null, checkedMlodData)
                        }
                    }
                })
        }
    })

}


exports.checkWorkingDay = async (bid, section, fromdate, todate, checkedLongabsentData, instid, ayid, auth, checkedWorkingDays) => {
    await db.query(`SELECT * FROM ${process.env.TLE_DBNAME}.stuattendance where bid='${bid}' and section='${section}' order by attendancedate desc limit 1`, 
        async (err, attendanceLastData) => {
            if (err) {
                console.log(err)
            } else {
                // console.log( attendanceLastData[0].attendancedate)
                const myjson={bid:bid, section:section, fromdate:fromdate, todate:todate, instid:instid, ayid:ayid}
                // console.log(regno,bid,section,fromdate,todate)
                await calender.mlodcalender(myjson, (err, findwokingday) => {
                    // console.log(JSON.stringify(findwokingday))
                    let calStartDate = findwokingday.calStartDate
                    let calEndDate = findwokingday.calEndDate
                    let workingDay = findwokingday.data.filter(v => v.daytype === "Workingday")
                    let nonWorkingDay = findwokingday.data.filter(v => v.daytype === "Non-Workingday")
                    let date = getDate.getPreviousDate().toLocaleDateString().slice(3, 5)
                    let current = parseInt(date) - nonWorkingDay.length
                    let workday = workingDay.filter(v => v.caldate <= attendanceLastData[0].attendancedate && v.caldate >= parseInt(fromdate))
                    let nonworkday = nonWorkingDay.filter(v => v.caldate <= attendanceLastData[0].attendancedate && v.caldate >= parseInt(fromdate))


                    if (checkedLongabsentData.length > 0 && checkedLongabsentData != null && checkedLongabsentData != undefined) {
                        checkedLongabsentData.map((v) => {
                            const sum = v.status
                            var total = sum.reduce((accum, item) => accum + item.presentdays, 0)
                            // console.log(total)
                            v.noofworkingdays = workday.length
                            v.noofpresent = total
                            v.precentage = Math.round(total / workday.length * 100)
                        })

                        checkedWorkingDays(null, checkedLongabsentData, calStartDate, calEndDate)
                    }
                })
            }

        })

}






exports.saveMonthReport = async (req, res) => {
    const reqData = req.body
    // console.log(reqData)
    await SaveMonthReport.monthSaveTable(reqData, (err, recordData) => {

        if (err) {
            res.status(500).send("data not found")
        } else {
            res.status(200).send(recordData)
        }
    })
}