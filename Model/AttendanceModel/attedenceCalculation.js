const db = require('../../Config/DB/tle.db')
const DayWise = require('../../View/AttendanceView/daywiseView')
const HourAttedance = require('../../View/AttendanceView/hourAttendance')
const HourAttedenceList = require('../../View/AttendanceView/hourAttendanceList')
const StudentHours = require('../../View/AttendanceView/studentHoursView')
const Constant = require('../../Utils/TleUtils/constant')


exports.attendanceCalculation = (attendancedata, daydata) => {

    const attendancerecord = attendancedata !== undefined && attendancedata !== null ? JSON.parse(attendancedata.attendancerecord) : null
    if (attendancerecord !== null) {
        let dayWise = new DayWise()

        // dayWise = filterStudentData
        attendancerecord.forEach(value => {
            value.bid = attendancedata.bid
            value.deptid = attendancedata.deptid
            value.cid = attendancedata.cid
            value.date = attendancedata.attendancedate
            value.presentdays = 0
            let fnCount = 0

            if (value.hour1 != null) { fnCount++ }
            if (value.hour2 != null) { fnCount++ }
            if (value.hour3 != null) { fnCount++ }
            if (value.hour4 != null) { fnCount++ }
            let presentHourFN = fnCount
            let checkPresentFN = 0
            if (value.hour1 != null) {
                if (value.hour1 == 'P' || value.hour1 == 'ML' || value.hour1 == 'OD') {
                    checkPresentFN++
                }
            }
            if (value.hour2 != null) {
                if (value.hour2 == 'P' || value.hour2 == 'ML' || value.hour2 == 'OD') {
                    checkPresentFN++
                }
            }
            if (value.hour3 != null) {
                if (value.hour3 == 'P' || value.hour3 == 'ML' || value.hour3 == 'OD') {
                    checkPresentFN++
                }
            }
            if (value.hour4 != null) {
                if (value.hour4 == 'P' || value.hour4 == 'ML' || value.hour4 == 'OD') {
                    checkPresentFN++
                }
            }

            if (presentHourFN == checkPresentFN) {
                let f = 0.5
                // console.log(checkPresentFN)
                value.presentdays = value.presentdays + f
            }

            let anCount = 0
            if (value.hour5 != null) { anCount++ }
            if (value.hour6 != null) { anCount++ }
            if (value.hour7 != null) { anCount++ }
            if (value.hour8 != null) { anCount++ }
            if (value.hour9 != null) { anCount++ }
            if (value.hour10 != null) { anCount++ }

            let presentHourAN = anCount
            let checkPresentAN = 0
            if (value.hour5 != null) {
                if (value.hour5 == 'P' || value.hour5 == 'ML' || value.hour5 == 'OD') {
                    checkPresentAN++
                }
            }
            if (value.hour6 != null) {
                if (value.hour6 == 'P' || value.hour6 == 'ML' || value.hour6 == 'OD') {
                    checkPresentAN++
                }
            }
            if (value.hour7 != null) {
                if (value.hour7 == 'P' || value.hour7 == 'ML' || value.hour7 == 'OD') {
                    checkPresentAN++
                }
            }
            if (value.hour8 != null) {
                if (value.hour8 == 'P' || value.hour8 == 'ML' || value.hour8 == 'OD') {
                    checkPresentAN++
                }
            }
            if (value.hour9 != null) {
                if (value.hour9 == 'P' || value.hour9 == 'ML' || value.hour9 == 'OD') {
                    checkPresentAN++
                }
            }
            if (value.hour10 != null) {
                if (value.hour10 == 'P' || value.hour10 == 'ML' || value.hour10 == 'OD') {
                    checkPresentAN++
                }
            }
            if (presentHourAN == checkPresentAN) {
                let f = 0.5
                value.presentdays = value.presentdays + f
            }


            if (value.hour1 != null && value.hour2 != null && value.hour3 != null && value.hour4 != null) {
                if (value.presentdays == 0) {
                    value.status = Constant.PA().Absent
                } else if (value.presentdays == 0.5) {
                    value.status = Constant.PA().HalfDay
                } else {
                    value.status = Constant.PA().Present
                }
            } else {
                value.status = "-"
            }


        });
        attendancedata.attendancerecord = attendancerecord

        daydata(null, attendancedata)
    } else {
        daydata(null,[])
    }

    // })

}

exports.getAttendance = (attendance, attData) => {

    let hourAttedance = new HourAttedance(null)
    let hourAttedance1 = new HourAttedance()
    // console.log(attendance.hour1)

    let hour1 = new DayWise()
    // console.log(attendance)
    if (attendance != undefined && attendance.hour1 != null) {

        let h1 = JSON.parse(attendance.hour1)
        //  console.log(JSON.stringify(hour1))

        hourAttedance1.absents = h1.absents
        hourAttedance1.presents = h1.presents
        hourAttedance1.attendance = h1.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour1 = day
        })
    } else {
        hour1 = null
    }
    // console.log(dayWise1)
    let hour2 = new DayWise()

    if (attendance != undefined && attendance.hour2 != null) {
        let h2 = JSON.parse(attendance.hour2)
        // console.log(hour1)
        hourAttedance1.absents = h2.absents
        hourAttedance1.presents = h2.presents
        hourAttedance1.attendance = h2.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour2 = day
        })
    } else {
        hour2 = null
    }
    let hour3 = new DayWise()

    if (attendance != undefined && attendance.hour3 != null) {
        let h3 = JSON.parse(attendance.hour3)
        // console.log(hour1)
        hourAttedance1.absents = h3.absents
        hourAttedance1.presents = h3.presents
        hourAttedance1.attendance = h3.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour3 = day
        })
    } else {
        hour3 = null
    }
    let hour4 = new DayWise()

    if (attendance != undefined && attendance.hour4 != null) {
        let h4 = JSON.parse(attendance.hour4)
        // console.log(hour1)
        hourAttedance1.absents = h4.absents
        hourAttedance1.presents = h4.presents
        hourAttedance1.attendance = h4.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour4 = day
        })
    } else {
        hour4 = null
    }
    let hour5 = new DayWise()

    if (attendance != undefined && attendance.hour5 != null) {
        let h5 = JSON.parse(attendance.hour5)
        // console.log(hour1)
        hourAttedance1.absents = h5.absents
        hourAttedance1.presents = h5.presents
        hourAttedance1.attendance = h5.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour5 = day
        })
    } else {
        hour5 = null
    }
    let hour6 = new DayWise()

    if (attendance != undefined && attendance.hour6 != null) {
        let h6 = JSON.parse(attendance.hour6)
        // console.log(hour1)
        hourAttedance1.absents = h6.absents
        hourAttedance1.presents = h6.presents
        hourAttedance1.attendance = h6.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour6 = day

        })
    } else {
        hour6 = null
    }
    let hour7 = new DayWise()

    if (attendance != undefined && attendance.hour7 != null) {
        let h7 = JSON.parse(attendance.hour7)
        hourAttedance1.absents = h7.absents
        hourAttedance1.presents = h7.presents
        hourAttedance1.attendance = h7.attendance
        hourAttedance = hourAttedance1

        this.getMap(hourAttedance, (err, day) => {
            hour7 = day
        })
    } else {
        hour7 = null
    }
    let hour8 = new DayWise()

    if (attendance != undefined && attendance.hour8 != null) {
        let h8 = JSON.parse(attendance.hour8)
        // console.log(hour1)
        hourAttedance1.absents = h8.absents
        hourAttedance1.presents = h8.presents
        hourAttedance1.attendance = h8.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour8 = day
        })
    } else {
        hour8 = null
    }
    let hour9 = new DayWise()

    if (attendance != undefined && attendance.hour9 != null) {
        let h9 = JSON.parse(attendance.hour9)
        // console.log(hour1)
        hourAttedance1.absents = h9.absents
        hourAttedance1.presents = h9.presents
        hourAttedance1.attendance = h9.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour9 = day
        })
    } else {
        hour9 = null
    }
    let hour10 = new DayWise()

    if (attendance != undefined && attendance.hour10 != null) {
        let h10 = JSON.parse(attendance.hour10)
        // console.log(hour1)
        hourAttedance1.absents = h10.absents
        hourAttedance1.presents = h10.presents
        hourAttedance1.attendance = h10.attendance
        hourAttedance = hourAttedance1
        this.getMap(hourAttedance, (err, day) => {
            hour10 = day
        })
    } else {
        hour10 = null
    }
    // console.log(JSON.stringify(hour6))
    let arr = []
    let hourAttendanceList = new HourAttedenceList(null)
    hourAttendanceList = hourAttedance.attendance
    // console.log(JSON.stringify(hourAttedance.attendance))
    if (hourAttendanceList != null && hourAttendanceList != undefined) {


        let stuData = hourAttendanceList.map(value => {
            let dayWise = new DayWise(null)
            let h1 = hour1 != null && hour1 != undefined ? hour1.find(h => h.regno === value.regno) : null
            let h2 = hour2 != null && hour2 != undefined ? hour2.find(h => h.regno === value.regno) : null
            let h3 = hour3 != null && hour3 != undefined ? hour3.find(h => h.regno === value.regno) : null
            let h4 = hour4 != null && hour4 != undefined ? hour4.find(h => h.regno === value.regno) : null
            let h5 = hour5 != null && hour5 != undefined ? hour5.find(h => h.regno === value.regno) : null
            let h6 = hour6 != null && hour6 != undefined ? hour6.find(h => h.regno === value.regno) : null
            let h7 = hour7 != null && hour7 != undefined ? hour7.find(h => h.regno === value.regno) : null
            let h8 = hour8 != null && hour8 != undefined ? hour8.find(h => h.regno === value.regno) : null
            let h9 = hour9 != null && hour9 != undefined ? hour9.find(h => h.regno === value.regno) : null
            let h10 = hour10 != null && hour10 != undefined ? hour10.find(h => h.regno === value.regno) : null


            dayWise.deptid = attendance.deptid != null ? attendance.deptid : null
            dayWise.cid = attendance.cid != null ? attendance.cid : null
            dayWise.bid = attendance.bid != null ? attendance.bid : null
            dayWise.section = attendance.section != null ? attendance.section : null
            dayWise.date = attendance.attendancedate != null ? attendance.attendancedate : null
            dayWise.name = value.name != null ? value.name : null
            dayWise.regno = value.regno != null ? value.regno : null
            dayWise.sid = value.sid != null ? value.sid : null
            dayWise.hour1 = h1 != null && h1.hours != null ? h1.hours : null
            dayWise.hour2 = h2 != null && h2.hours != null ? h2.hours : null
            dayWise.hour3 = h3 != null && h3.hours != null ? h3.hours : null
            dayWise.hour4 = h4 != null && h4.hours != null ? h4.hours : null
            dayWise.hour5 = h5 != null && h5.hours != null ? h5.hours : null
            dayWise.hour6 = h6 != null && h6.hours != null ? h6.hours : null
            dayWise.hour7 = h7 != null && h7.hours != null ? h7.hours : null
            dayWise.hour8 = h8 != null && h8.hours != null ? h8.hours : null
            dayWise.hour9 = h9 != null && h9.hours != null ? h9.hours : null
            dayWise.hour10 = h10 != null && h10.hours != null ? h10.hours : null

            // console.log(JSON.stringify(dayWise))

            return dayWise
        })
        // console.log(JSON.stringify(stuData))


        attData(null, stuData)
    } else {
        attData(null, 'Data not Found')
    }

}

exports.getMap = (hourAttedance, day) => {
    // console.log(hourAttedance)
    let arr = []
    hourAttedance.attendance.forEach(attendance => {
        let studentHours = new StudentHours()
        studentHours.regno = attendance.regno
        studentHours.name = attendance.name
        studentHours.hours = attendance.status
        studentHours.sid = attendance.sid
        arr.push(studentHours)

    });
    day(null, arr)
}