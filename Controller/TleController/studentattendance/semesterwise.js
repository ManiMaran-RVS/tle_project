const db = require("../../../Config/DB/tle.db");
const semesterview = require("../../../View/AttendanceView/semesterwise");
const SaveSemesterReport = require("../../../Model/AttendanceModel/semesterWiseModel");
const getDate = require("../../../Utils/TleUtils/dateUtils");
const SemesterCalculation = require("./monthwise");
const calender = require("../../RavesController/calendar");
const semester = require("../../RavesController/semester");

exports.getSemesterWiseReport = (req, res) => {
  this.CalculatePercentage(req, (err, sendData) => {
    if (err) {
      res.status(500).send("data not found");
    } else {
      res.status(200).send(sendData);
    }
  });
};

exports.CalculatePercentage = (req, responseData) => {
  var arr = [];
  const bid = req.params.bid;
  const cid = req.params.cid
  const section = req.params.section;
  const semesternumber = req.params.semesternumber;
  const auth = req.headers.authorization;
  const instid = req.query.instid;
  const ayid = req.query.ayid;
  const semestertype = req.query.semestertype
  const reqfromdate = req.query.fromdate
  const reqtodate = req.query.todate

  var str = semestertype.toLowerCase()
  const str2 = str.charAt(0).toUpperCase() + str.slice(1);
const myjson={instid:instid, ayid:ayid, str2:str2}
  calender.getCalendarConfigDates(myjson, (err, findCalDate) => {
    // console.log(findCalDate)
    var fromdate = reqfromdate == undefined ? findCalDate.startdate : reqfromdate
    var todate = reqtodate == undefined ? findCalDate.enddate : reqtodate
    const currentTime = getDate.getCurrentDateOnly() //- 86400000;
    // console.log(fromdate <= currentTime , currentTime >= todate)
    // console.log(fromdate) 
    if (fromdate <= currentTime, currentTime >= todate) {
      if (todate === currentTime) {
        todate = reqtodate == undefined ? findCalDate.enddate : reqtodate
      } else if (currentTime >= todate) {
        todate = reqtodate == undefined ? findCalDate.enddate : reqtodate
      }
    } else {
      todate = getDate.getCurrentDateOnly() - 86400000;
    }
    // console.log(fromdate)

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
    // console.log(regno,bid,section,fromdate,todate)
    await calender.mlodcalender(myjson,
                  async (err, findWorkingDayData) => {
                    // console.log(findWorkingDayData.calStartDate);
                    // console.log(todate);
                    let findWorkingDay = findWorkingDayData.data.filter((v) => v.daytype === "Workingday");
                    // console.log(findWorkingDay.length)
                    mergePresentData.map((a) => {
                      const NumberOfworkingdays = findWorkingDay.length;
                      const Numberpresentdays = a.totalNumberpresentdays.reduce((partialSum, a) => partialSum + a, 0);
                      const Numberofabsentdays = NumberOfworkingdays - Numberpresentdays;
                      const percentage = Math.round((Numberpresentdays / NumberOfworkingdays) * 100);
                      a.noofworkingdays = NumberOfworkingdays;
                      a.noofpresentdays = Numberpresentdays;
                      a.noofabsentdays = Numberofabsentdays;
                      a.newpercentage = percentage;

                      delete a.status
                      delete a.totalNumberpresentdays
                      delete a.totalNumberOfworkingdays
                      delete a.precentage

                    });
                    // console.log(mergePresentData)
                    returnData.calStartDate = findCalDate.startdate;
                    returnData.calEndDate = findCalDate.enddate;
                    returnData.attendancerecord = mergePresentData;

                    // responseData(null, 'hi');
                    responseData(null, returnData);
                  }
                );
              } else {
                responseData(null, "Data not ");
              }
            }
            );
          } else {
            responseData(null, "Record Not Found ");
            // res.status(500).send("Record Not Found ")
          }
        }
      }
    );
  }
  );
};




exports.CalculateSemsesterWiseReport = (req, responseData) => {
  var arr = [];
  const bid = req.bid || req.params.bid;
  const section = req.section || req.params.section;
  const semesternumber = req.semesternumber || req.params.semesternumber;
  const auth = req.auth || req.headers.authorization;
  const instid = req.instid || req.query.instid;
  const ayid = req.ayid || req.query.ayid;
  const semestertype = req.semestertype || req.query.semestertype
  const myjson={instid:instid, ayid:ayid, semestertype:semestertype}
  if (semesternumber != undefined) {
    calender.getCalendarConfigDates(myjson, (err, findCalDate) => {
      // console.log(findCalDate)

      const fromdate = findCalDate.startdate;
      const todate = findCalDate.enddate;
      const semestertype = findCalDate.semestertype;
      db.query(`select * from ${process.env.TLE_DBNAME}.stuattendance where instid=? and ayid=? and bid=? and section=? and semestertype=? and semesternumber=? and active=1 and attendancedate between ? and ?`,
        [instid, ayid, bid, section, semestertype, semesternumber, fromdate, todate],
        async (err, data) => {
          // console.log(data,'kkk')
          if (err) {
            console.log(err);
          } else {
            // console.log(data);
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

              await SemesterCalculation.monthwise(sendData, async (err, returnData) => {
                // console.log(JSON.stringify(returnData))
                var data = returnData
                const mergePresentData = Object.values(
                  data.attendancerecord.reduce((value, i) => {
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
                  // console.log(regno,bid,section,fromdate,todate)
                  await calender.mlodcalender(myjson, async (err, findWorkingDayData) => {
                    let findWorkingDay = findWorkingDayData.data.filter((v) => v.daytype === "Workingday");
                    mergePresentData.map((a) => {
                      const NumberOfworkingdays = findWorkingDay.length;
                      const Numberpresentdays =
                        a.totalNumberpresentdays.reduce((partialSum, a) => partialSum + a, 0);
                      const Numberofabsentdays = NumberOfworkingdays - Numberpresentdays;
                      if (NumberOfworkingdays <= 90) {

                        const percentage = (Numberpresentdays / NumberOfworkingdays) * 90;                        // console.log(percentage)
                        const finalPercentage = Math.round((percentage / 90) * 100);
                        a.totalNumberOfworkingdays = NumberOfworkingdays;
                        a.totalNumberpresentdays = Numberpresentdays;
                        a.totalNumberabsentdays = Numberofabsentdays;
                        a.percentage = finalPercentage;

                        if (finalPercentage >= 75 && finalPercentage <= 100) {
                          a.performa = "I";
                        } else if (finalPercentage >= 65 && finalPercentage < 75) {
                          a.performa = "II";
                        } else if (finalPercentage >= 50 && finalPercentage < 65) {
                          a.performa = "III";
                        } else if (finalPercentage < 50) {
                          a.performa = "IV";
                        }
                      } else {
                        const percentage = Math.round((Numberpresentdays / NumberOfworkingdays) * 100);
                        a.totalNumberOfworkingdays = NumberOfworkingdays;
                        a.totalNumberpresentdays = Numberpresentdays;
                        a.totalNumberabsentdays = Numberofabsentdays;
                        a.percentage = percentage;
                        if (percentage >= 75 && percentage <= 100) {
                          a.performa = "I";
                        } else if (percentage >= 65 && percentage < 75) {
                          a.performa = "II";
                        } else if (percentage >= 50 && percentage < 65) {
                          a.performa = "III";
                        } else if (percentage < 50) {
                          a.performa = "IV";
                        }
                      }
                    });
                    // console.log(mergePresentData)
                    if (data.length >= 1) {
                      this.check(instid, ayid, data[0].cid, bid, section, semesternumber, fromdate, todate, auth, mergePresentData,
                        (err, statusdata) => {
                          // console.log(returnData)
                          data.calStartDate = findWorkingDayData.calStartDate;
                          data.calEndDate = findWorkingDayData.calEndDate;
                          data.attendancerecord = statusdata;
                          console.log(JSON.stringify(data))
                          responseData(null, data);
                          // res.status(200).send(returnData)
                          // console.log(1)
                        }
                      );
                    } else {
                      // console.log(returnData)
                      data.calStartDate = findWorkingDayData.calStartDate;
                      data.calEndDate = findWorkingDayData.calEndDate;
                      data.attendancerecord = mergePresentData;
                      responseData(null, data);
                      // var i=data.map(e=>e.regno)
                      // console.log(data.regno);

                    }
                  }
                  );
                } else {
                  responseData(null, "Data not ");
                }
              }
              );
            } else {
              responseData(null, "Record Not Found ");
              // res.status(500).send("Record Not Found ")
            }
          }
        }
      );
    }
    );
  } else {
    responseData(null, "dgtdfgdg")
  }
};

exports.saveSemesterReport = async (req, res) => {
  const reqData = req.body;
  await SaveSemesterReport.semesterSaveTable(reqData, (err, recordData) => {
    if (err) {
      res.status(500).send("no data found");
    } else {
      res.status(200).send(recordData);
    }
  });
};
exports.getobject = (data, obj) => {
  for (var i = 0; i < data.length; i++) {
    const object = data[i];
    obj(null, object);
  }
};

exports.check = (instid, ayid, cid, bid, section, semesternumber, fromdate, todate, auth, mergePresentData, statusdata) => {
  const myjson={instid:instid, cid:cid, bid:bid, semesternumber:semesternumber}
  semester.findOneSemesterRecord( myjson,(err, semesterData) => {
    if (semesterData[0].startdate <= todate && semesterData[0].enddate >= fromdate) {
      db.query(`select * from ${process.env.TLE_DBNAME}.attendanceboostup where bid=? and section=? and semesternumber=? and status='Accepted' `, [bid, section, semesternumber],
        (err, boostdata) => {
          if (err) {
            res.status(500).send("err");
          } else {
            // console.log(boostdata,"boostdata")
            if (boostdata.length <= 0) {
              // console.log(1)
              statusdata(null, mergePresentData);
            } else {
              boostdata.forEach((e) => {
                let findstudent = mergePresentData.find((v) => v.regno == e.regno);
                if (findstudent != null) {
                  findstudent.percentage = e.regprecentage;
                  findstudent.performa = e.regperfoma;
                }
              });
              statusdata(null, mergePresentData);
            }
          }
        }
      );
    } else {
      console.log("Data Not Found");
    }
  }
  );
};
