const db = require("../../Config/DB/tle.db");
const dates = require("../../Utils/RavesUtils/dateUtils")
const semesterService = require('../../Controller/RavesController/semester')
const constant = require("../../Utils/RavesUtils/constant")
const Hours = require("../../View/RavesView/hours")


exports.findCalendarsByDate = async (req, res) => {
    const bid = req.bid||req.params.bid
    const section = req.section||req.params.section
    const date = req.date||req.params.date
    const auth =req.auth || req.headers.authorization
    const instid =req.instid|| req.query.instid
    const ayid = req.ayid||req.query.ayid


    db.query(`select * from ${process.env.RAVES_DBNAME}.semester where bid='${bid}' and instid='${instid}'  and active=1 and ${date} between startdate and enddate`,
        async (err, semesterdata) => {
            if (err) {
                return res.status(500).json(err)
            } else {
                const semester = semesterdata[0]
                if (semester != null) {
                    const semesterType = semester.type.toLowerCase()

                    db.query(`select * from ${process.env.RAVES_DBNAME}.calcourseconfigure where instid='${instid}' and  ayid='${ayid}' and bid='${bid}' and semestertype='${semesterType}' and active=1`,
                        (err, calendarConfigurationdata) => {
                            if (err) {
                                res.status(500).json(err)
                            } else {
                                const calendarConfiguration = calendarConfigurationdata[0]

                                if (calendarConfiguration != null) {
                                    db.query(`select * from ${process.env.RAVES_DBNAME}.calleveldatemap where instid='${instid}' and  ayid='${ayid}' and callevelid='${calendarConfiguration.callevelid}' and semestertype='${semesterType}' and active=1 and status="Allocated" `,
                                        (err, levelDateMapdata) => {
                                            
                                            if (err) {
                                                // console.log(err)
                                                res.status(500).json(err)
                                            } else {
                                                const levelDateMap = levelDateMapdata[0]
                                                if (levelDateMap != null) {
                                                    db.query(`select * from ${process.env.RAVES_DBNAME}.calendardraft where ayid='${levelDateMap.ayid}' and callevelid='${levelDateMap.callevelid}' and calleveldatemapid='${levelDateMap.calleveldatemapid}' and semestertype='${levelDateMap.semestertype}' and caldate=${date} and active=1 order by caldate`, 
                                                        (err, calendardata) => {
                                                            // console.log(calendardata)
                                                            if (err) {
                                                                console.log(err)
                                                                res.status(500).json(err)
                                                            } else {
                                                                var calendar = calendardata[0]
                                                                // console.log(calendar)
                                                                if (calendar != null && levelDateMap.hours != null) {
                                                                    var hours = levelDateMap.hours
                                                                    var calStartDate = levelDateMap.startdate
                                                                    var calEndDate = levelDateMap.enddate
                                                                    const results = JSON.parse(hours)
                                                                    calendar.hours = results;
                                                                    calendar.calStartDate = calStartDate
                                                                    calendar.calEndDate = calEndDate
                                                                    const status = constant.statusNa()
                                                                    for (var i = 0; i < results.length; i++) {
                                                                        results[i] = { ...results[i], ...{ presents: 0, absents: 0, status } };
                                                                    }
                                                                    const semestertype = calendar.semestertype
                                                                    // console.log(semestertype);
                                                                    calendar.semesternumber = semester.semesternumber
                                                                    this.getAttendanceDetails(results, semestertype, bid, section, date, auth, (err, attendanceDetails) => {

                                                                        if (err) {
                                                                            res.status(500).json(err)
                                                                        } else {
                                                                            // console.log(calendar)
                                                                            res.status(200).json(calendar)
                                                                        }
                                                                    })

                                                                } else {
                                                                    res.status(404).json('Calendar Data Not Found')
                                                                }
                                                            }
                                                        })
                                                } else {
                                                    res.status(404).json('Level DateMap Data Not Found')
                                                }
                                            }
                                        })
                                } else {
                                    res.status(404).json('No Records Found in Calendar Configuration')
                                }
                            }
                        })

                } else {
                    res.status(404).json('Semester Data Not Found')
                }

            }
        })
}


exports.getAttendanceDetails = (results, semestertype, bid, section, date, auth, attendanceDetails) => {
    client.findAttendance(semestertype, bid, section, date, auth, (err, attendanceData) => {
        const attendance = attendanceData
        if (attendance != null) {
            results.forEach(hour => {
                switch (hour.hour) {
                    case 1:
                        if (attendance.hour1 != null) {
                            attHour1 = JSON.parse(attendance.hour1)
                            hour.presents = attHour1.presents
                            hour.absents = attHour1.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 2:
                        if (attendance.hour2 != null) {
                            attHour2 = JSON.parse(attendance.hour2)
                            hour.presents = attHour2.presents
                            hour.absents = attHour2.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 3:
                        if (attendance.hour3 != null) {
                            attHour3 = JSON.parse(attendance.hour3)
                            hour.presents = attHour3.presents
                            hour.absents = attHour3.absents
                            hour.status = constant.statusDone()
                        }
                        break;
                    case 4:
                        if (attendance.hour4 != null) {
                            attHour4 = JSON.parse(attendance.hour4)
                            hour.presents = attHour4.presents
                            hour.absents = attHour4.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 5:
                        if (attendance.hour5 != null) {
                            attHour5 = JSON.parse(attendance.hour5)
                            hour.presents = attHour5.presents
                            hour.absents = attHour5.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 6:
                        if (attendance.hour6 != null) {
                            attHour6 = JSON.parse(attendance.hour6)
                            hour.presents = attHour6.presents
                            hour.absents = attHour6.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 7:
                        if (attendance.hour7 != null) {
                            attHour7 = JSON.parse(attendance.hour7)
                            hour.presents = attHour7.presents
                            hour.absents = attHour7.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 8:
                        if (attendance.hour8 != null) {
                            attHour8 = JSON.parse(attendance.hour8)
                            hour.presents = attHour8.presents
                            hour.absents = attHour8.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 9:
                        if (attendance.hour9 != null) {
                            attHour9 = JSON.parse(attendance.hour9)
                            hour.presents = attHour9.presents
                            hour.absents = attHour9.absents
                            hour.status = constant.statusDone()

                        }
                        break;
                    case 10:
                        if (attendance.hour10 != null) {
                            attHour10 = JSON.parse(attendance.hour10)
                            hour.presents = attHour10.presents
                            hour.absents = attHour10.absents
                            hour.status = constant.statusDone()

                        }
                        break;

                    default:
                        break;
                }

            })
            attendanceDetails(null, results)
        }
        return null
    })

}

exports.mlodcalender = (req, res) => {
    // console.log(req.params)
    const bid = req.bid||req.params.bid
    const section =  req.section||req.params.section
    var fromdate =  req.fromdate||req.query.fromdate
    const todate =  req.todate||req.query.todate
    const instid =  req.instid||req.query.instid
    const ayid =  req.ayid||req.query.ayid
    // console.log(fromdate)
    db.query(`select * from ${process.env.RAVES_DBNAME}.semester where bid='${bid}' and active=1 and instid='${instid}'  and ${fromdate} between startdate and enddate`, 
        async (err, data) => {
            if (err) {
                return res.status(500).json(err)
            } else {
                const semester = data[0]
                if (semester != null) {
                    const semesterType = semester.type.toLowerCase()
                    db.query(`select * from ${process.env.RAVES_DBNAME}.calcourseconfigure where ayid='${ayid}' and bid='${bid}' and semestertype='${semesterType}' and active=1`,
                        (err, data) => {
                            if (err) {
                                res.status(500).json(err)
                            } else {
                                const calendarConfiguration = data[0]
                                if (calendarConfiguration != null) {
                                    db.query(`select * from ${process.env.RAVES_DBNAME}.calleveldatemap where ayid='${ayid}' and callevelid='${calendarConfiguration.callevelid}' and semestertype='${semesterType}' and active=1`, 
                                        (err, data) => {
                                            if (err) {
                                                res.status(500).json(err)
                                            } else {
                                                const levelDateMap = data[0]
                                                if (levelDateMap != null) {
                                                    if (todate === undefined && fromdate !== undefined) {
                                                        fromdate = levelDateMap.startdate
                                                        // console.log(fromdate)
                                                        var calStartDate = levelDateMap.startdate
                                                        var calEndDate = levelDateMap.enddate
                                                        db.query(`select * from ${process.env.RAVES_DBNAME}.calendardraft where ayid='${levelDateMap.ayid}' and callevelid='${levelDateMap.callevelid}' and calleveldatemapid='${levelDateMap.calleveldatemapid}' and semestertype='${levelDateMap.semestertype}'  and active=1 and caldate between ${fromdate} and ${calEndDate} order by  caldate  asc`, 
                                                            (err, data) => {
                                                                if (err) {
                                                                    res.status(500).json(err)
                                                                } else {
                                                                    let sendData = Object.assign({
                                                                        data: data,
                                                                        calStartDate: calStartDate,
                                                                        calEndDate: calEndDate
                                                                    })
                                                                    res.status(200).json(sendData)
                                                                }
                                                            })
                                                    } else {
                                                        // console.log(todate)
                                                        db.query(`select * from ${process.env.RAVES_DBNAME}.calendardraft where ayid='${levelDateMap.ayid}' and callevelid='${levelDateMap.callevelid}' and calleveldatemapid='${levelDateMap.calleveldatemapid}' and semestertype='${levelDateMap.semestertype}'  and active=1 and caldate between ${fromdate} and ${todate} order by  caldate  asc`, 
                                                            (err, data) => {
                                                                if (err) {
                                                                    res.status(500).json(err)
                                                                } else {
                                                                    let sendData = Object.assign({
                                                                        data: data,
                                                                        calStartDate: calStartDate,
                                                                        calEndDate: calEndDate
                                                                    })
                                                                    res.status(200).json(sendData)
                                                                }
                                                            })
                                                    }
                                                } else {
                                                    res.status(404).json('levelDateMap data not found')
                                                }
                                            }
                                        })
                                } else {
                                    res.status(404).json('calendarConfiguration data not found')
                                }
                            }
                        })
                } else {
                    res.status(404).json('Semester data not found')
                }
            }
        })
}



exports.getCurrentTime = (req, res) => {
    let currentTime = dates.getCurrentTime()
    res.status(200).json(currentTime)
}


exports.getCalendarConfigDates = async (req, res) => {
    const instid = req.instid||req.params.instid
    const ayid = req.ayid||req.params.ayid
    const semestertype = req.semestertype||req.params.semestertype
    const bid = req.params.bid
    var str = semestertype.toLowerCase()
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);

    await db.query(`select * from ${process.env.RAVES_DBNAME}.calleveldatemap where instid='${instid}' and ayid='${ayid}' and semestertype='${semestertype}' and active=1`, (err, data) => {
        if (err) {
            res.jsonStatus(500)
        } else {
            res.status(200).json(data[0])
        }
    })
}

