const db = require('../../../Config/DB/tle.db')
const DayWise = require('../../../View/AttendanceView/daywiseView')
const HourAttedance = require('../../../View/AttendanceView/hourAttendance')
const HourAttedenceList = require('../../../View/AttendanceView/hourAttendanceList')
const StudentHours = require('../../../View/AttendanceView/studentHoursView')
const Constant=require('../../../Utils/TleUtils/constant')
const AttedenceCalculation=require('../../../Model/AttendanceModel/attedenceCalculation')
const DayWiseSave=require('../../../Model/AttendanceModel/dayWiseModel')




exports.dayWiseAttendance = (req, res) => {
    const bid = req.params.bid
    const section = req.params.section
    const date = req.params.date
    db.query(`select * from ${process.env.TLE_DBNAME}.stuattendance where bid='${bid}' and section='${section}' and attendancedate='${date}' and active=1`, 
        (err, data) => {
            // console.log(data)
            if (err) {
                res.status(500).send(err)
            } else {
                const attendance = data[0]
                   AttedenceCalculation.attendanceCalculation(attendance,(err,daydata)=>{
                        if(err){
                            res.status(500).send(err)
                        }else{
                            // console.log(daydata)
                            res.status(200).send(daydata)
                        }
                   })
               
            }
        })

}

exports.saveDaywiseReport=(req,res)=>{
    const reqData=req.body
    // console.log(reqData)
    DayWiseSave.dayWiseTable(reqData,(recordData)=>{
        // console.log(recordData)
        if (recordData != null) {
            res.status(500).send(recordData)
         } else {
            res.status(200).send(`Daily Wise Report Checked Successfully`)
         }
    })
}


