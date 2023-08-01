const db = require("../../Config/DB/tle.db");


exports.findMlodLongAbsent=(req,res)=>{
    const bid = req.params.bid
    const date = req.params.date
   
    const instid = '20013826-6c41-41ca-bb7c-3fa7f7751917'
    db.query(`select * from ${process.env.RAVES_DBNAME}.semester where bid='${bid}' and active=1 and instid='${instid}' and ${date} between startdate and enddate`, 
        async (err, data) => {
            
            if (err) {
                return res.status(500).send(err)
            } else {
                const semester = data[0]
                
                // console.log(JSON.stringify(semester) + "semesterdata")
                if (semester != null) {
                    //  console.log(semester)
                    const semesterType = semester.type.toLowerCase()
                    db.query(`select * from ${process.env.RAVES_DBNAME}.calcourseconfigure where ayid='${semester.ayid}' and bid='${semester.bid}' and semestertype='${semesterType}' and active=1`,
                        (err, data) => {
                            
                            if (err) {
                                res.status(500).send(err)
                            } else {
                                const calendarConfiguration = data[0]
                                //  console.log(calendarConfiguration)
                                if (calendarConfiguration != null) {
                                    db.query(`select * from ${process.env.RAVES_DBNAME}.calleveldatemap where ayid='${semester.ayid}' and callevelid='${calendarConfiguration.callevelid}' and semestertype='${semesterType}' and active=1`, 
                                        (err, data) => {
                                            
                                            if (err) {
                                                res.status(500).send(err)
                                            } else {
                                                const levelDateMap = data[0]

                                               
                                                if (levelDateMap != null) {
                                                  
                                                    db.query(`select * from ${process.env.RAVES_DBNAME}.calendardraft where ayid='${levelDateMap.ayid}' and callevelid='${levelDateMap.callevelid}' and calleveldatemapid='${levelDateMap.calleveldatemapid}' and semestertype='${levelDateMap.semestertype}' and caldate=${date} and active=1 order by caldate`,
                                                        (err, data) => {
                                                        //  console.log(data)
                                                            if (err) {
                                                                res.status(500).send(err)
                                                            } else {
                                                                
                                                              res.status(200).send(data)
                                                                 
                                                             
                                                            }
                                                        })
                                                } else {
                                                    res.status(404).send('levelDateMap data not found')
                                                }
                                            }
                                        })
                                } else {
                                    res.status(404).send('calendarConfiguration data not found')
                                }
                            }
                        })

                } else {
                    res.status(404).send('Semester data not found')
                }

            }
        })
}
