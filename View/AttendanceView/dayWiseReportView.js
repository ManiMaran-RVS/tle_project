const date = require('../../Utils/TleUtils/dateUtils')
const uuid = require('../../Utils/TleUtils/createUUID')

module.exports=function DayWiseReport(
    aid,instgpid,ayid,instid,deptid,cid,bid,section,semestertype,
    attendancedate,daywisereport,createdby,updateby
    ){
        this.aid=aid,
        this.instgpid=instgpid,
        this.ayid=ayid,
        this.instid=instid,
        this.deptid=deptid,
        this.cid=cid,
        this.bid=bid,
        this.section=section,
        this.semestertype=semestertype,
        this.attendancedate=attendancedate,
        this.dayreportid=uuid.create_UUID(),
        this.dayreport=daywisereport
        this.active=true,
        this.createat=date.getCurrentDate(),
        this.createdby=createdby,
        this.updateat=date.getCurrentDate(),
        this.updateby=updateby
}