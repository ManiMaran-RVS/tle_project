const db = require("../../../Config/DB/tle.db")
const Student = require("../../../View/AttendanceView/studentDetailView")
const UUID = require("../../../Utils/TleUtils/createUUID")
const Date = require('../../../Utils/TleUtils/dateUtils')
const student = require("../../RavesController/student")

exports.getStudentDetails=(req,res)=>{
    this.getStudentData(req,(err,status,response)=>{
        if (err) {
            res.status(status).json(err)
        }else{
            res.status(status).json(response)
        }
    })
}

exports.getStudentData = (req, res) => {
    const cid = req.body.cid
    const bid = req.body.bid
    const section = req.body.section
    const deptid = req.body.deptid
    const subid = req.body.subid
    var studentMapData = []
    var sendData = {}
    const myjson={cid:cid, bid:bid, section:section}
    student.findByCidBidSection(myjson, async (err, studentData) => { 
        if (err) {
            res(null,500,err)
        } else {
            await db.query(`select * from ${process.env.TLE_DBNAME}.subject where subid='${subid}' and active=1`, (subjecterr, subjectdata) => {
                if (subjecterr) {
                    res(null,500,err)
                } else {
                    if (subjectdata.length !== 0) {
                        var subject = subjectdata[0]
                        const studentDetails = studentData
                        studentDetails.forEach(student => {
                            const studentlist = new Student.StudentList()
                            studentlist.admissionid = student.admissionid
                            studentlist.sid = student.sid
                            studentlist.regno = student.regno
                            studentlist.name = student.firstname
                            studentlist.ischecked = false
                            studentMapData.push(studentlist)
                        })
                        db.query(`select * from ${process.env.TLE_DBNAME}.subjectstudentmapping where deptid='${deptid}' and cid='${cid}' and bid='${bid}' and subid='${subid}' and active=1`, (err, preData) => {
                            if (err) {
                                res(null,500,err)
                            } else {
                                if (preData.length === 0) {
                                    sendData.instid = studentData[0]['instid']
                                    sendData.aid = studentData[0]['aid']
                                    sendData.deptid = deptid
                                    sendData.cid = cid
                                    sendData.bid = bid
                                    sendData.section = section
                                    sendData.subid = subject.subid
                                    sendData.subjectname = subject.name
                                    sendData.studentlist = studentMapData
                                    sendData.semesternumber = subject.semesternumber
                                    studentMapData.sort((a, b) =>{return a.name - b.name})
                                    res(null,200,sendData)
                                } else {
                                    var a = JSON.parse(preData[0].mappingrecord)
                                    var filterchekedstudent = a.filter(v => v.ischecked === true)
                                    studentMapData.forEach(studentDetails => {
                                        filterchekedstudent.find((filter) => {
                                            if (studentDetails.sid === filter.sid) {
                                                studentDetails.ischecked = filter.ischecked
                                            }
                                        })
                                    })
                                    sendData.instid = studentData[0]['instid']
                                    sendData.aid = studentData[0]['aid']
                                    sendData.deptid = deptid
                                    sendData.cid = cid
                                    sendData.bid = bid
                                    sendData.section = section
                                    sendData.subid = subject.subid
                                    sendData.subjectname = subject.name
                                    sendData.studentlist = studentMapData
                                    sendData.semesternumber = subject.semesternumber
                                    studentMapData.sort((a, b) => {return a.name - b.name})
                                    res(null,200,sendData)
                                }
                            }
                        })
                    } else {
                        res(null,404,"data not found")

                    }
                }
            })
        }
    })
}
exports.saveSubjectStudentMapping = (req, res) => {
    const aid = req.body.aid
    const instid = req.body.instid
    const ayid = req.body.ayid
    const deptid = req.body.deptid
    const cid = req.body.cid
    const bid = req.body.bid
    const section = req.body.section
    const semnumber = req.body.semesternumber
    const subid = req.body.subid
    const substumapid = req.body.substumapid || UUID.create_UUID()
    const mappingrecord = req.body.studentlist
    const createdat = Date.getCurrentDate()
    const createdby = req.body.createdby
    const updatedat = Date.getCurrentDate()
    const updatedby = req.body.createdby
    const active = true
    // res.send(mappingrecord);
    db.query(`select * from ${process.env.TLE_DBNAME}.subjectstudentmapping where subid='${subid}' and active=1`, (err, substuData) => {
        if (err) {
            console.log(err)
        } else {
            if (substuData.length === 0) {
                db.query(`select * from ${process.env.TLE_DBNAME}.subjectstudentmapping where aid='${aid}' and instid='${instid}' and ayid='${ayid}' and  deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber='${semnumber}' and active =1`, (err, data) => {
                    if (err) {
                        res.sendStatus(400)
                    } else {
                        var filterischecked = mappingrecord.filter((item) => item.ischecked === true)
                        if (data) {
                            const getmappingrecord = data.map((item) => {
                                return JSON.parse(item.mappingrecord);
                            });
                            const trueStudents = getmappingrecord.map((mapped) => {
                                return filterischecked.map((filter) => {
                                    return mapped.find((mapping) => {
                                        if (mapping.ischecked === true) {
                                            if (mapping.sid === filter.sid && mapping.subid !==filter.subid) {
                                                return mapping
                                            }
                                        }
                                    })
                                })
                            });
                            const withoutnull = trueStudents.flat().filter(Boolean);
                            const filteredData = withoutnull.filter(obj => obj.ischecked !== false);
                            if (filteredData.length === 0) {
                                db.query(`insert into ${process.env.TLE_DBNAME}.subjectstudentmapping (aid,instid,ayid,deptid,cid,bid,section,semesternumber,subid,substumapid,mappingrecord,active,createdat,createdby,updatedat,updatedby) values('${aid}','${instid}','${ayid}','${deptid}','${cid}','${bid}','${section}',${semnumber},'${subid}','${substumapid}','${JSON.stringify(mappingrecord)}',${active},'${createdat}','${createdby}','${updatedat}','${updatedby}')`, (err, savedata) => {
                                    if (err) {
                                        console.log(err);
                                        res.sendStatus(500)
                                    } else {
                                        res.send('save');
                                    }
                                })
                            } else {
                                res.status(409).send(filteredData);
                            }
                        }
                        else {
                            res.sendStatus(500)
                        }
                    }
                })
            }
            else {
                if (substuData) {
                    db.query(`select * from ${process.env.TLE_DBNAME}.subjectstudentmapping where aid='${aid}' and instid='${instid}' and ayid='${ayid}' and  deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber='${semnumber}' and active =1`, (err, data) => {
                        if (err) {
                            res.sendStatus(400)
                        } else {
                            var filterischecked = mappingrecord.filter((item) => item.ischecked === true)
                            if (data) {
                                const getmappingrecord = data.map((item) => {
                                    return JSON.parse(item.mappingrecord);
                                }); 
                                const trueStudents = getmappingrecord.map((mapped) => {
                                    return filterischecked.map((filter) => {
                                        return mapped.find((mapping) => {
                                            if (mapping.ischecked === true) {
                                                if (mapping.sid === filter.sid && mapping.subid !==filter.subid) {
                                                    return mapping
                                                }
                                            }
                                        })
                                    })
                                });
                                const withoutnull = trueStudents.flat().filter(Boolean);
                                const filteredData = withoutnull.filter(obj => obj.ischecked !== false);
                                if (filteredData.length === 0) {
                                    console.log(JSON.stringify(mappingrecord));
                                    db.query(`update ${process.env.TLE_DBNAME}.subjectstudentmapping set mappingrecord=? ,updatedat=? ,updatedby =? where instid=? and deptid=? and bid=? and section=? and semesternumber=? and subid=? and active=1`, [JSON.stringify(mappingrecord), updatedat, updatedby, instid, deptid, bid, section, semnumber, subid], (err, data) => {
                                        if (err) {
                                            res.send(err)
                                        }
                                        else {
                                            res.send("updated successfully")
                                        }
                                    })
                                } else {
                                    res.status(409).send(filteredData);
                                }
                            }
                            else {
                                res.sendStatus(500)
                            }
                        }
                    })
                }
                else {
                    res.sendStatus(500)
                }
            }
        }
    })
}









