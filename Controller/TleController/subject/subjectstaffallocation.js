const uuid = require('../../../Utils/TleUtils/createUUID')
const Date = require('../../../Utils/TleUtils/dateUtils')
const db = require('../../../Config/DB/tle.db')
const  employee  = require('../../RavesController/employee')
const department = require('../../RavesController/department')



exports.getSubjectStaff = (req, res) => {
    const instid = req.params.instid
    const deptid = req.params.deptid
    const cid = req.params.cid
    const bid = req.params.bid
    const section = req.params.section
    const semesternumber = req.params.semesternumber
    db.query(`select*from ${process.env.TLE_DBNAME}.subjectstaffallocation where instid='${instid}' and  deptid='${deptid}' and cid='${cid}' and bid='${bid}' and semesternumber='${semesternumber}' and section='${section}' and active=1`, async (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            var subids = []
            var staffdetails = {
                staffids: [],
                staffdeptids: []
            }

            await data.map(async (item) => {
                await subids.push(item.subid),
                    await staffdetails.staffids.push(item.eid)
                await staffdetails.staffdeptids.push(item.empdeptid)
            })
            await db.query(`select subid, name from ${process.env.TLE_DBNAME}.subject where subid in ('${subids.join("','")}') and active=1`,
                async (err, subjectdata) => {
                    if (err) {
                        console.error('Error retrieving subject name:', err);
                    } else {
                        data.forEach(val => {
                            subjectdata.find(sub => {
                                if (sub.subid === val.subid) {
                                    val.subjectname = sub.name
                                }
                            })
                        });
                        const myjson={ eids: staffdetails.staffids }
                        await employee.getEmployeeName(myjson, async (stafferr, staffdata) => {
                            if (stafferr) {
                                console.log(stafferr)
                            } else {
                                data.forEach(val => {
                                    staffdata.find(staff => {
                                        if (staff.eid === val.eid) {
                                            val.empname = staff.name
                                        }
                                    })
                                });
                                const myjson={ deptids: staffdetails.staffdeptids }
                                await department.getDepartmentName(myjson, async (staffdepterr, staffdeptdata) => {
                                    if (staffdepterr) {
                                        console.log(staffdepterr)
                                    } else {
                                        data.forEach(val => {
                                            staffdeptdata.find(staff => {
                                                if (staff.deptid === val.empdeptid) {
                                                    val.empdeptname = staff.name
                                                }
                                            })
                                        })

                                        res.status(200).json(data)
                                    }
                                })
                            }
                        })
                    }
                });
        }
    })
}

exports.saveSubjectStaffAllocation = async (req, res) => {
    const items = req.body
    const staffallocationid = uuid.create_UUID()
    const active = true
    const createdat = Date.getCurrentDate()
    const updatedat = Date.getCurrentDate()

    await db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where aid='${items.aid}' and instid='${items.instid}' and ayid='${items.ayid}' and deptid='${items.deptid}' and cid='${items.cid}' and bid='${items.bid}' and section='${items.section}' and semesternumber='${items.semesternumber}' and active=1`, (err, predata) => {
        if (err) {
            res.status(500).send(err)
        } else {
            if (predata.length === 0) {
                db.query(`insert into ${process.env.TLE_DBNAME}.subjectstaffallocation (aid,instid,ayid,deptid,cid,bid,section,semesternumber,allocationtype,subid,staffallocationid,eid,empdeptid,teachinghours,active,createdat,createdby,updatedat,updatedby) values ('${items.aid}','${items.instid}','${items.ayid}','${items.deptid}','${items.cid}','${items.bid}','${items.section}',${items.semesternumber},'${items.allocationtype}','${items.subid}','${staffallocationid}','${items.eid}','${items.empdeptid}',${items.teachinghours},${active},'${createdat}','${items.createdby}','${updatedat}','${items.createdby}')`, (err, savedata) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        res.status(200).send('saved');
                    }
                })
            } else {
                if (items.allocationtype === "single") {
                    db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where subid='${items.subid}' and allocationtype='multiple' and active=1`, (err, data) => {
                        if (err) {
                            res.status(400).send(err)
                        } else {
                            if (data.length === 0) {
                                db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where aid='${items.aid}' and instid='${items.instid}' and ayid='${items.ayid}' and deptid='${items.deptid}' and cid='${items.cid}' and bid='${items.bid}' and section='${items.section}' and semesternumber='${items.semesternumber}' and allocationtype='${items.allocationtype}' and subid='${items.subid}' and  empdeptid='${items.empdeptid}' and active=1 `, (err, data) => {
                                    if (err) {
                                        res.status(500).send(err)
                                    } else {
                                        if (data.length === 0) {
                                            db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where aid='${items.aid}' and instid='${items.instid}' and ayid='${items.ayid}' and deptid='${items.deptid}' and cid='${items.cid}' and bid='${items.bid}' and section='${items.section}' and semesternumber='${items.semesternumber}' and allocationtype='${items.allocationtype}' and subid='${items.subid}' and active=1 `, (err, data) => {
                                                if (err) {
                                                    res.status(500).send(err)
                                                } else {
                                                    if (data.length === 0) { 
                                                        db.query(`insert into ${process.env.TLE_DBNAME}.subjectstaffallocation (aid,instid,ayid,deptid,cid,bid,section,semesternumber,allocationtype,subid,staffallocationid,eid,empdeptid,active,createdat,createdby,updatedat,updatedby) values ('${items.aid}','${items.instid}','${items.ayid}','${items.deptid}','${items.cid}','${items.bid}','${items.section}',${items.semesternumber},'${items.allocationtype}','${items.subid}','${staffallocationid}','${items.eid}','${items.empdeptid}',${active},'${createdat}','${items.createdby}','${updatedat}','${items.createdby}')`, (err, savedata) => {
                                                            if (err) {
                                                                res.status(500).send(err)
                                                            } else {
                                                                res.status(200).send('saved');
                                                            }
                                                        })
                                                    } else {
                                                        res.status(500).send("subject already allocated")

                                                    }
                                                }
                                            })
                                        } else {
                                            res.status(500).send("already allocated")
                                        }
                                    }
                                })
                            } else {
                                res.status(400).send("this subject mapped with multiple allocation")

                            }
                        }
                    })
                } else {
                    if (items.allocationtype === "multiple") {
                        db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where subid='${items.subid}' and allocationtype='single' and active=1`, (err, data) => {
                            if (err) {
                                res.status(400).send(err)
                            } else {
                                if (data.length === 0) {
                                    db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where aid='${items.aid}' and instid='${items.instid}' and ayid='${items.ayid}' and deptid='${items.deptid}' and cid='${items.cid}' and bid='${items.bid}' and section='${items.section}' and semesternumber='${items.semesternumber}' and allocationtype='${items.allocationtype}' and subid='${items.subid}' and eid='${items.eid}' and  empdeptid='${items.empdeptid}' and active=1 `, (err, data) => {
                                        if (err) {
                                            res.status(500).send(err)
                                        } else {
                                            if (data.length === 0) {
                                                db.query(`select teachinghours from ${process.env.TLE_DBNAME}.subject where subid='${items.subid}' and active =1`, (err, teachinghours) => {
                                                    if (err) {
                                                        res.status(500).send(err)
                                                    } else {
                                                        let subjectteachinghours = (teachinghours[0].teachinghours);
                                                        db.query(`select teachinghours from ${process.env.TLE_DBNAME}.subjectstaffallocation where subid='${items.subid}' and active=1`, (err, predata) => {
                                                            if (err) {
                                                                res.status(500).send(err)
                                                            } else {
                                                                let totalTeachingHours = 0;
                                                                predata.forEach(item => {
                                                                    totalTeachingHours += item.teachinghours;
                                                                });
                                                                let reqteaching = totalTeachingHours + items.teachinghours
                                                                if (subjectteachinghours >= reqteaching) {
                                                                    db.query(`insert into ${process.env.TLE_DBNAME}.subjectstaffallocation (aid,instid,ayid,deptid,cid,bid,section,semesternumber,allocationtype,subid,staffallocationid,eid,empdeptid,teachinghours,active,createdat,createdby,updatedat,updatedby) values ('${items.aid}','${items.instid}','${items.ayid}','${items.deptid}','${items.cid}','${items.bid}','${items.section}',${items.semesternumber},'${items.allocationtype}','${items.subid}','${staffallocationid}','${items.eid}','${items.empdeptid}',${items.teachinghours},${active},'${createdat}','${items.createdby}','${updatedat}','${items.createdby}')`, (err, savedata) => {
                                                                        if (err) {
                                                                            res.status(500).send(err)
                                                                        } else {
                                                                            res.status(200).send('saved');
                                                                        }
                                                                    })
                                                                } else {
                                                                    res.status(500).send(`in this subject total teaching hours is ${subjectteachinghours} and you adding more than extra ${reqteaching - subjectteachinghours} hours.`)
                                                                }

                                                            }
                                                        })
                                                    }
                                                })

                                            } else {
                                                res.status(500).send("already allocated")
                                            }
                                        }
                                    })
                                } else {
                                    res.status(500).send("this subject is allocated with single allocation")
                                }
                            }
                        })
                    } else {
                        res.status(500).send("allocation type is wrong")
                    }
                }
            }
        }
    })
}


exports.updateSubjectStaffAllocation = (req, res) => {

    const allocationtype = req.body.allocationtype
    const subid = req.body.subid
    const eid = req.body.eid
    const empdeptid = req.body.empdeptid
    const updatedat = Date.getCurrentDate()
    const updatedby = req.body.updatedby
    const staffallocationid = req.body.staffallocationid

    db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where subid='${subid}' and eid='${eid}' and empdeptid='${empdeptid}'  and allocationtype='${allocationtype}' and  active=1 `, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {

            if (data.length === 0) {
                db.query(`select * from ${process.env.TLE_DBNAME}.subjectstaffallocation where staffallocationid='${staffallocationid}' and active=1`, async (err, predata) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        if (predata.length !== 0) {
                            await db.query(`update ${process.env.TLE_DBNAME}.subjectstaffallocation set allocationtype='${allocationtype}',subid='${subid}',eid='${eid}',empdeptid='${empdeptid}',updatedat=${updatedat},updatedby='${updatedby}' where staffallocationid='${staffallocationid}' and active=1`, (err, data) => {
                                if (err) {
                                    res.status(500).send(err)
                                } else {
                                    res.status(200).send("updated successfully ")
                                }

                            }
                            )
                        }
                        else {
                            res.status(400).send("data not found")
                        }
                    }
                })
            } else {
                res.status(500).send("this sbject  already allocated ")
            }
        }
    })

}

exports.deleteSubjectStaffAllocation = (req, res) => {
    const staffallocationid = req.params.staffallocationid
    db.query(`delete from ${process.env.TLE_DBNAME}.subjectstaffallocation where staffallocationid='${staffallocationid}'`, (err, data) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json("deleted successfully")
        }
    })
}