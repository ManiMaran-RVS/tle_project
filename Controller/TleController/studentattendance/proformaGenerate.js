const db = require("../../../Config/DB/tle.db")
const SemesterCalculation = require("./monthwise");
const Uuid = require("../../../Utils/TleUtils/createUUID");
const getDate = require('../../../Utils/TleUtils/dateUtils');
const calender = require("../../RavesController/calendar");


exports.getAllProformaData = async (req, res) => {
    const instid = req.body.instid;
    const ayid = req.body.ayid;
    const deptid = req.body.deptid
    const cid = req.body.cid
    const bid = req.body.bid
    const section = req.body.section
    const semesternumber = req.body.semesternumber

    await db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber}  and active=true`,
         (err, data) => {
            if (err) {

                res.status(500).send(err)
            } else {
                if (data.length !== 0) {
                    res.status(200).send(data[0])
                } else {
                    res.status(404).send('Data not found')
                }
            }
        })
}


exports.getFilterProformaData = async (req, res) => {
    const instid = req.body.instid;
    const ayid = req.body.ayid;
    const deptid = req.body.deptid
    const cid = req.body.cid
    const bid = req.body.bid
    
    const section = req.body.section
    const semesternumber = req.body.semesternumber

    await db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber}  and active=true`,
        [, , , , , , ], (err, data) => {
            if (err) {

                res.status(500).send(err)
            } else {
                if (data.length !== 0) {

                    var filetevalue = JSON.parse(data[0].proformarecord).filter((v, i) => {
                        var list;
                        if (v.proforma !== "I") {
                            return list = {
                                ...v
                            }
                        }
                        return list;
                    })
                    data[0].proformarecord = filetevalue
                    res.status(200).send(data[0])
                } else {
                    res.status(404).send('Data not found')
                }
            }
        })
}

exports.proformaGenerate = async (req, res) => {
    const aid = req.body.aid
    const instid = req.body.instid;
    const ayid = req.body.ayid;
    const deptid = req.body.deptid
    const cid = req.body.cid
    const bid = req.body.bid
    const section = req.body.section
    const cursemnumber = req.body.cursemnumber
    const semestertype = req.body.semestertype
    // const presemnumnber = req.body.presemnumnber
    const auth = req.headers.authorization;
    const createdby = req.body.createdby
    // console.log(req.body)

    // 
    let reqData = {
        instid: instid,
        ayid: ayid,
        deptid: deptid,
        cid: cid,
        bid: bid,
        section: section,
        semestertype: semestertype,
        semesternumber: cursemnumber,
        auth: auth
    }

    if (cursemnumber === 1) {
        this.calculateProforma(reqData, async (err, resData) => {
            if (resData.length !== 0) {
                resData.attendancerecord.map((a, i) => {
                    if (a.proformapercentage >= 75 && a.proformapercentage <= 100) {
                        a.proforma = "I";
                    } else if (a.proformapercentage >= 65 && a.proformapercentage < 75) {
                        a.proforma = "II";
                    } else if (a.proformapercentage >= 50 && a.proformapercentage < 65) {
                        a.proforma = "III";
                    } else if (a.proformapercentage < 50) {
                        a.proforma = "IV";
                    }
                })
                
                await db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${cursemnumber} and semestertype='${semestertype}' and active=true`, async (err, selectData) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        // console.log(resData)
                        let semesternumber = reqData.semesternumber
                        let proformaid = Uuid.create_UUID()
                        let proformarecord = JSON.stringify(resData.attendancerecord)
                        let active = true
                        let createat = getDate.getCurrentDate()

                        if (selectData.length === 0) {
                            await db.query(`insert into ${process.env.TLE_DBNAME}.stuproforma values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [aid, ayid, instid, deptid, cid, bid, section, semesternumber, semestertype, proformaid, proformarecord, active, createat, createdby, createat, createdby], async (err, insertData) => {
                                if (err) {
                                    res.status(500).send(err)
                                } else {
                                    res.status(200).send("Proforma Generate")
                                }
                            })
                        } else {
                            db.query(`update ${process.env.TLE_DBNAME}.stuproforma set proformarecord='${proformarecord}', updatedat='${createat}' , updatedby='${createdby}' where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and semestertype='${semestertype}' and active=true`, (err, updateData) => {
                                if (err) {
                                    res.status(500).send(err)
                                } else {
                                    res.status(200).send(updateData)
                                }
                            })
                        }
                    }
                })
            } else {
                res.status(404).send(" sem 1 Data Not Found")
            }
            // res.status.send(resData)
        })

    } else {
        //more than sem 1
        let reqData1 = {
            instid: instid,
            ayid: ayid,
            deptid: deptid,
            cid: cid,
            bid: bid,
            section: section,
            semestertype: semestertype,
            semesternumber: cursemnumber,
            auth: auth
        }
        this.calculateProforma(reqData1, async (err, resData) => {
            if (resData.length !== 0) {

                resData.attendancerecord.map((a, i) => {
                    if (a.proformapercentage >= 75 && a.proformapercentage <= 100) {
                        a.proforma = "I";
                    } else if (a.proformapercentage >= 65 && a.proformapercentage < 75) {
                        a.proforma = "II";
                    } else if (a.proformapercentage >= 50 && a.proformapercentage < 65) {
                        a.proforma = "III";
                    } else if (a.proformapercentage < 50) {
                        a.proforma = "IV";
                    }

                })
                let cursemData = resData.attendancerecord
                let presemnumnber = cursemnumber - 1
                // console.log(presemnumnber);
                db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${presemnumnber}  and active=true`, 
                    async (err, selectData) => {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            if (selectData.length !== 0) {
                                var overallpresemData = []
                                var proformadata = selectData[0]
                                let proformarecord = JSON.parse(proformadata.proformarecord)

                                const filterboosterstudent = proformarecord.filter(item => item.isboosted === true)
                                    .map((item) => {
                                        return {
                                            name: `${item.name}`,
                                            regno: `${item.regno}`,
                                            percentage: `${item.boosterpercentage}`
                                        }
                                    })

                                const normalstudentData = proformarecord.filter(item => item.isboosted === false)
                                    .map((item) => {
                                        return {
                                            name: `${item.name}`,
                                            regno: `${item.regno}`,
                                            percentage: `${item.proformapercentage}`
                                        }
                                    })
                                overallpresemData = [...normalstudentData, ...filterboosterstudent]

                                resData.attendancerecord.map((curdata) => {
                                    overallpresemData.map((predata) => {

                                        if (curdata.regno === predata.regno) {
                                            if (predata.percentage >= 50 && predata.percentage < 65) {
                                                if (curdata.proformapercentage < 65 && curdata.proformapercentage >= 50) {
                                                    curdata.proforma = "VII";
                                                }
                                                else if (curdata.proformapercentage < 75 && curdata.proformapercentage >= 65) {
                                                    curdata.proforma = "VI";
                                                }
                                                if (curdata.proformapercentage < 101 && curdata.proformapercentage >= 75) {
                                                    curdata.proforma = "V";


                                                }

                                            }

                                        }
                                    })
                                })
                            }
                        }
                        db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${cursemnumber} and semestertype='${semestertype}' and active=true`, 
                            async (err, selectData) => {
                                if (err) {
                                    res.status(500).send(err)
                                } else {
                                    // console.log(resData)
                                    let semesternumber = reqData1.semesternumber
                                    let proformaid = Uuid.create_UUID()
                                    let active = true
                                    let createat = getDate.getCurrentDate()

                                    if (selectData.length === 0) {
                                        db.query(`insert into ${process.env.TLE_DBNAME}.stuproforma values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                            [aid, ayid, instid, deptid, cid, bid, section, semesternumber, semestertype, proformaid, JSON.stringify(resData.attendancerecord), active, createat, createdby, createat, createdby],
                                            (err, insertData) => {
                                                if (err) {
                                                    res.status(500).send(err)
                                                } else {
                                                    res.status(200).send("Proforma Generated")
                                                }
                                            })
                                    } else {
                                        var saveddata = selectData[0]
                                        var savedproformarecord = JSON.parse(saveddata.proformarecord)
                                        savedproformarecord.forEach((saveproforma) => {
                                            resData.attendancerecord.map((newproforma) => {
                                                if (saveproforma.isreqboostup === false && saveproforma.isboosted === false && saveproforma.regno === newproforma.regno) {
                                                    saveproforma.bid = newproforma.bid
                                                    saveproforma.cid = newproforma.cid
                                                    saveproforma.name = newproforma.name
                                                    saveproforma.regno = newproforma.regno
                                                    saveproforma.section = newproforma.section
                                                    saveproforma.proforma = newproforma.proforma
                                                    saveproforma.isboosted = false
                                                    saveproforma.boosterdays = ''
                                                    saveproforma.isreqboostup = false
                                                    saveproforma.noofabsentdays = newproforma.noofabsentdays
                                                    saveproforma.boosterproforma = ''
                                                    saveproforma.noofpresentdays = newproforma.noofpresentdays
                                                    saveproforma.noofworkingdays = newproforma.noofworkingdays
                                                    saveproforma.boosterpercentage = ''
                                                    saveproforma.proformapercentage = newproforma.proformapercentage
                                                }
                                            })
                                        })
                                        db.query(`update ${process.env.TLE_DBNAME}.stuproforma set proformarecord=?, updatedat =? , updatedby =? where instid =? and ayid =? and deptid =? and cid =? and bid =? and section =?and semesternumber =? and semestertype =? and active = true`,
                                            [JSON.stringify(savedproformarecord), createat, createdby, instid, ayid, deptid, cid, bid, section, semesternumber, semestertype], (err, updateData) => {
                                                if (err) {
                                                    res.status(500).send(err)
                                                } else {

                                                    res.status(200).send('Proforma Generation Updated ')

                                                }
                                            })
                                    }
                                }
                            })
                    })
            } else {
                res.status(404).send("Data Not Found in Over than One Semeter Data")
            }
        })
    };


}


exports.calculateProforma = (reqData, resData) => {
    // console.log(reqData)
    let instid = reqData.instid
    let ayid = reqData.ayid
    let deptid = reqData.deptid
    let cid = reqData.cid
    let bid = reqData.bid
    let section = reqData.section
    let semesternumber = reqData.semesternumber
    let semestertype = reqData.semestertype
    let auth = reqData.auth
    var str = semestertype.toLowerCase()
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
const myjson={instid:instid, ayid:ayid, str2:str2}
    calender.getCalendarConfigDates(myjson, (err, findCalDate) => {
        // console.log(findCalDate)
        var fromdate = findCalDate.startdate
        var todate = findCalDate.enddate


        db.query(`select * from ${process.env.TLE_DBNAME}.stuattendance where instid=? and ayid=? and cid=? and bid=? and section=? and semestertype=? and semesternumber=? and active=1 and attendancedate between ? and ?`,
            [instid, ayid, cid, bid, section, semestertype, semesternumber, fromdate, todate,], async (err, data) => {
                // console.log(data)
                if (err) {
                    console.log(err);
                } else {
                    if (data != null && data !== undefined && data.length !== 0) {
                        let sendData = {
                            bid: bid,
                            section: section,
                            fromdate: fromdate,
                            todate: todate,
                            instid: instid,
                            ayid: ayid,
                            auth: auth,
                        };
                        // console.log(sendData.fromdate);

                        await SemesterCalculation.monthwise(sendData, async (err, returnData) => {
                            // console.log(JSON.stringify(returnData))
                            const mergePresentData = Object.values(returnData.attendancerecord.reduce((value, i) => {
                                if (!value[i.regno]) {
                                    value[i.regno] = {
                                        ...i,
                                        totalNumberOfworkingdays: [],
                                        totalNumberpresentdays: [],
                                    };
                                }
                                value[i.regno].totalNumberOfworkingdays.push(
                                    i.totalNumberOfworkingdays
                                );
                                value[i.regno].totalNumberpresentdays.push(
                                    i.totalNumberpresentdays
                                );
                                return value;
                            }, {})
                            );
                            if (mergePresentData != null) {
                                const myjson={bid:bid, section:section, fromdate:fromdate, todate:todate, instid:instid, ayid:ayid}
                                
                                await calender.mlodcalender(myjson,
                                    async (err, findWorkingDayData) => {
                                        // console.log(findWorkingDayData.calStartDate);
                                        // console.log(todate);
                                        let findWorkingDay = findWorkingDayData.data.filter((v) => v.daytype === "Workingday");
                                        // console.log(findWorkingDay.length)
                                        mergePresentData.map((a) => {
                                            const NumberOfworkingdays = findWorkingDay.length;
                                            const Numberpresentdays =
                                                a.totalNumberpresentdays.reduce((partialSum, a) => partialSum + a, 0);
                                            const Numberofabsentdays = NumberOfworkingdays - Numberpresentdays;
                                            if (NumberOfworkingdays <= 90) {

                                                const percentage = (Numberpresentdays / NumberOfworkingdays) * 90;                        // console.log(percentage)
                                                const finalPercentage = Math.round((percentage / 90) * 100);
                                                a.noofworkingdays = NumberOfworkingdays;
                                                a.noofpresentdays = Numberpresentdays;
                                                a.noofabsentdays = Numberofabsentdays;
                                                a.proformapercentage = finalPercentage;
                                                a.isboosted = false
                                                a.isreqboostup = false
                                                a.boosterdays = ''
                                                a.boosterpercentage = ''
                                                a.boosterproforma = ''
                                                // unwanted key and value
                                                delete a.status
                                                delete a.totalNumberpresentdays
                                                delete a.totalNumberOfworkingdays
                                                delete a.precentage


                                            } else {
                                                const percentage = Math.round((Numberpresentdays / NumberOfworkingdays) * 100);
                                                a.noofworkingdays = NumberOfworkingdays;
                                                a.noofpresentdays = Numberpresentdays;
                                                a.noofabsentdays = Numberofabsentdays;
                                                a.proformapercentage = percentage;
                                                a.isboosted = false
                                                a.isreqboostup = false
                                                a.boosterdays = ''
                                                a.boosterpercentage = ''
                                                a.boosterproforma = ''
                                                delete a.status

                                            }
                                        });
                                        // console.log(mergePresentData)
                                        returnData.calStartDate = findCalDate.startdate;
                                        returnData.calEndDate = findCalDate.enddate;
                                        returnData.attendancerecord = mergePresentData;
                                        resData(null, returnData);
                                    }
                                );
                            } else {
                                resData(null, data);
                            }
                        }
                        );
                    } else {
                        resData(null, data);
                        // res.status(500).send("Record Not Found ")
                    }
                }
            }
        );
    }
    );
}

