module.exports = class DayWise {
    constructor(deptid, cid, bid, section, regno, name, status, present, attendanceid, hour1,
        hour2, hour3, hour4, hour5, hour6, hour7,
        hour8, hour9, hour10, presentdays,date,sid) {
        this.deptid = deptid,
            this.cid = cid,
            this.bid = bid,
            this.section = section,
            this.sid=sid,
            this.regno = regno,
            this.name = name,
            this.status = status,
            this.present = present,
            this.date=date,
            this.attendanceid = attendanceid,
            this.hour1 = hour1,
            this.hour2 = hour2,
            this.hour3 = hour3,
            this.hour4 = hour4,
            this.hour5 = hour5,
            this.hour6 = hour6,
            this.hour7 = hour7,
            this.hour8 = hour8,
            this.hour9 = hour9,
            this.hour10 = hour10,
            this.presentdays = presentdays

    }

}

