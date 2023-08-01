const Uuid = require('../../Utils/TleUtils/createUUID')
const Date = require('../../Utils/TleUtils/dateUtils')
const db = require('../../Config/DB/tle.db')

exports.monthSaveTable = (reqData, recordData) => {
    // console.log(reqData.fromdate)    
    const aid = reqData.aid
    const instgpid = reqData.instgpid
    const ayid = reqData.ayid
    const instid = reqData.instid
    const deptid = reqData.deptid
    const cid = reqData.cid
    const bid = reqData.bid
    const section = reqData.section
    const semestertype = reqData.semestertype
    const monthname = reqData.monthname
    const fromdate = reqData.fromdate
    const todate = reqData.todate
    const monthwiseid = Uuid.create_UUID()
    const monthreport = JSON.stringify(reqData.monthreport)
    const active = true
    const createat = Date.getCurrentDate()
    const createdby = reqData.createdby
    const updateat = Date.getCurrentDate()
    const updateby = reqData.updateby


    db.query(`select * from ${process.env.TLE_DBNAME}.monthwisereport where cid=? and bid=? and section=? and semestertype=? and fromdate=? and todate=?`,
        [cid, bid, section, semestertype, fromdate, todate],
        (err, record) => {
            const save = `Month Wise Report Checked Successfully`
            const error = `monthwisereport is already saved`
            const saved = `Month Wise Report Checked Successfully`
            const errord = `monthwisereport is already update`
            // console.log(record)

            if ( record.length <= 0 || record[0].fromdate != fromdate) {

                db.query(`insert into ${process.env.TLE_DBNAME}.monthwisereport values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                    [aid, instgpid, ayid, instid, deptid, cid, bid, section, semestertype, monthname, fromdate, todate,
                        monthwiseid, monthreport, active, createat, createdby, updateat, updateby],
                    (err, retuenData) => {
                        // console.log(err)
                        if (err) {
                            // console.log(error)
                            return recordData(null, error)
                        } else {
                            // console.log(retuenData)
                            // console.log("month report insert")
                            return recordData(null, save)
                        }
                    })

            } else {
                db.query(`update ${process.env.TLE_DBNAME}.monthwisereport set monthreport=? , updateat=? , updateby=? where cid=? and bid=? and section=? and semestertype=? and fromdate=? and todate=? `,
                    [monthreport, updateat, updateby, cid, bid, section, semestertype, fromdate, todate],
                    (err, updatereport) => {
                        if (err) {
                            // console.log(errord)
                            return recordData(null, errord)
                        } else {
                            // console.log(saved)
                            return recordData(null, saved)
                        }
                    })
            }
        })
}

