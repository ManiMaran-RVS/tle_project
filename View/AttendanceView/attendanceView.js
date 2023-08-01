const date = require('../../Utils/TleUtils/dateUtils')
const uuid = require('../../Utils/TleUtils/createUUID')

module.exports = class {
    constructor(aid, instgpid, instid, section, semestertype,semesternumber,
        attendancedate, ayid, bid, caldraftid,
        cid, dayorder, deptid, createdby, updateby) {

        this.aid = aid,
            this.instgpid = instgpid,
            this.instid = instid,
            this.section = section,
            this.semestertype = semestertype,
            this.semesternumber=semesternumber,
            this.attendancedate = attendancedate,
            this.attendanceid = uuid.create_UUID(),
            this.ayid = ayid,
            this.bid = bid,
            this.caldraftid = caldraftid,
            this.cid = cid,
            this.dayorder = dayorder,
            this.deptid = deptid,
            this.active = true,
            this.createat = date.getCurrentDate(),
            this.createdby = createdby,
            this.updateat = date.getCurrentDate(),
            this.updateby = updateby

    }
}

