const Uuid = require('../../Utils/TleUtils/createUUID')
const Date = require('../../Utils/TleUtils/dateUtils')
const db = require('../../Config/DB/tle.db')


exports.semesterSaveTable = (reqData, recordData) => {
   const aid = reqData.aid
    const ayid = reqData.ayid
    const instid = reqData.instid
    const deptid = reqData.deptid
    const cid = reqData.cid
    const bid = reqData.bid
    const section = reqData.section
    const semestertype = reqData.semestertype
    const semesternumber = reqData.semesternumber
    const semstartdate = reqData.semstartdate
    const semenddate = reqData.semenddate
    const semsterwiseid = Uuid.create_UUID()
    const semesterreport = JSON.stringify(reqData.semesterreport)
    const active = true
    const createat = Date.getCurrentDate()
    const createdby = reqData.createdby
    const updateat = Date.getCurrentDate()
    const updateby = reqData.updateby


    db.query(`select * from ${process.env.TLE_DBNAME}.semesterwisereport where cid=? and bid=? and section=? and semestertype=? and semesternumber=? and semstartdate=? and semenddate=?`,
        [cid, bid, section, semestertype, semesternumber, semstartdate, semenddate],
        (err, record) => {
            const save = `Semester Wise Report Saved Successfully`
            const error = `Semester Wise Report Is Already Saved`
            const saved = `Semester Wise Report Is Updated`
            const errord = `Semester Wise Report Is Already Update`
            if (record != null &&  record.length <= 0 ) {

                db.query(`insert into ${process.env.TLE_DBNAME}.semesterwisereport values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [aid, ayid, instid, deptid, cid, bid, section, semestertype, semesternumber, semstartdate, semenddate,
                        semsterwiseid, semesterreport, active, createat, createdby, updateat, updateby],
                    (err, retuenData) => {
                        // console.log(err)
                        if (err) {
                            // console.log(error)
                            return recordData(null, error)
                        } else {
                            // console.log(retuenData)
                            // console.log("semester report insert")
                            return recordData(null, save)
                        }
                    })

            } else{
               
                db.query(`update ${process.env.TLE_DBNAME}.semesterwisereport set semesterreport=? , updateat=? , updateby=? where cid=? and bid=? and section=? and semestertype=? and semesternumber=? and semstartdate=? and semenddate=? `,
                [semesterreport, updateat, updateby, cid, bid, section, semestertype, semesternumber, semstartdate, semenddate],
                (err, updatereport) => {
                    if (err) {
                        // console.log(err)
                        return recordData(null, errord)
                    } else {
                        // console.log(saved)
                        return recordData(null, saved)
                    }
                })
            }
        })

}