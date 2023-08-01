const uuid = require('../../Utils/TleUtils/createUUID')


class Stafflist {
    constructor(sno, name, eid, status) {
        this.sno = sno,
            this.name = name,
            this.eid = eid,
            this.status = status,
            this.hour1 = status,
            this.hour2 = status,
            this.hour3 = status,
            this.hour4 = status,
            this.hour5 = status,
            this.hour6 = status,
            this.hour7 = status,
            this.hour8 = status,
            this.hour9 = status,
            this.hour10 = status

    }

}

class StaffAttendanceRecord {
    constructor(aid, ayid, instid, deptid, callevelid, attendancedate, dayorder, staffdetails,
        createby, updateby) {
        this.aid = aid,
            this.ayid = ayid,
            this.instid = instid,
            this.deptid = deptid,
            this.callevelid = callevelid,
            this.attendancedate = attendancedate,
            this.dayorder = dayorder,
            this.attendanceid = uuid.create_UUID(),
            this.staffdetails = staffdetails
    }

}

module.exports = { Stafflist, StaffAttendanceRecord }