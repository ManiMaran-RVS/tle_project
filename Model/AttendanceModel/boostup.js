const Uuid = require('../../Utils/TleUtils/createUUID')
const Date = require('../../Utils/TleUtils/dateUtils')
const db = require('../../Config/DB/tle.db')
const { findByBid } = require('../../Controller/RavesController/semester')

exports.reqboostup = (req, savedata) => {
  const reqData = req.body

  const aid = reqData.aid
  const ayid = reqData.ayid
  const instid = reqData.instid
  const deptid = reqData.deptid
  const cid = reqData.cid
  const bid = reqData.bid
  const section = reqData.section
  const semesternumber = reqData.semesternumber
  const semestertype = reqData.semestertype
  const boostupid = Uuid.create_UUID()
  const reqboostuprecord = reqData.boostuprecord
  const active = true
  const createdat = Date.getCurrentDate()
  const createdby = reqData.createdby
  const updatedat = Date.getCurrentDate()
  const updatedby = reqData.createdby


  db.query(`select * from ${process.env.TLE_DBNAME}.stuboostup where instid=? and ayid=? and deptid=? and cid=? and bid=? and section=? and semesternumber=? and active=1`, [instid, ayid, deptid, cid, bid, section, semesternumber], async (err, data) => {
    if (err) {
      savedata(null, 500, err)
    }
    else {
      if (data.length <= 0) {
        await db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and active=1`, async (err, getProformData) => {
          var getproformadata = getProformData[0]
          var proformarecord = JSON.parse(getproformadata.proformarecord)
          reqboostuprecord.forEach((boostup, i) => {
            proformarecord.map((proforma, ind) => {
              if (proforma.regno === boostup.regno) {
                if (boostup.isreqboostup === true) {

                  proforma.isreqboostup = boostup.isreqboostup
                  proforma.boosterdays = boostup.boosterdays
                  proforma.boosterproforma = boostup.boosterproforma
                  proforma.boosterpercentage = boostup.boosterpercentage
                  proforma.status = 'request'

                }
              }
            })
            boostup.status = 'request'
          });

          // savedata(null, 200, proformarecord)
          var newproformarecord = JSON.stringify(proformarecord)
          await db.query(`update ${process.env.TLE_DBNAME}.stuproforma set proformarecord='${newproformarecord}',updatedat='${updatedat}',updatedby='${updatedby}' where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and active=1 `, async (err, updateProforma) => {
            if (err) {
              savedata(null, 500, err)
            } else {
              var newboostuprecord = reqboostuprecord.filter((v) => v.isreqboostup === true)
              await db.query(`insert into ${process.env.TLE_DBNAME}.stuboostup (aid,ayid,instid,deptid,cid,bid,section,semesternumber,semestertype,boostupid,boostuprecord,active,createdat,createdby,updatedat,updatedby) values ('${aid}','${ayid}','${instid}','${deptid}','${cid}','${bid}','${section}',${semesternumber},'${semestertype}','${boostupid}','${JSON.stringify(newboostuprecord)}',${active},${createdat},'${createdby}',${updatedat},'${updatedby}')`,
                (inerr, insertBoostup) => {
                  if (inerr) {
                    savedata(null, 500, inerr)
                  } else {
                    savedata(null, 200, 'Boostup Requested')
                  }
                })
            }
          })
        })
      } else {
        var previousdata = data[0]
        var preboostuprecord = JSON.parse(previousdata.boostuprecord)
        var filterisreqbooster = reqboostuprecord.filter(v => v.isreqboostup === true && !v.hasOwnProperty("status"))


        filterisreqbooster = filterisreqbooster.filter((boostup) => {
          return !preboostuprecord.find((predata) => {
            if (boostup.status === 'request' && boostup.status === 'reject') {
              return predata.regno === boostup.regno
            }
          })
        })

        if (filterisreqbooster !== 0) {
          await db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and active=1`, async (err, getProformData) => {
            var getproformadata = getProformData[0]
            var proformarecord = JSON.parse(getproformadata.proformarecord)
            filterisreqbooster.forEach((boostup, i) => {
              proformarecord.map((proforma, ind) => {
                if (proforma.regno === boostup.regno) {
                  if (boostup.isreqboostup === true) {
                    proforma.isreqboostup = boostup.isreqboostup
                    proforma.boosterdays = boostup.boosterdays
                    proforma.boosterproforma = boostup.boosterproforma
                    proforma.boosterpercentage = boostup.boosterpercentage
                    proforma.status = 'request'

                  }
                }
              })
              boostup.status = 'request'
            });

            var newproformarecord = JSON.stringify(proformarecord)
            var newboostuprecord = [...preboostuprecord, ...filterisreqbooster].sort((a, b) => a.regno - b.regno);
            newboostuprecord = newboostuprecord.filter((v) => v.status !== 'reject')

            await db.query(`update ${process.env.TLE_DBNAME}.stuproforma set proformarecord='${newproformarecord}',updatedat='${updatedat}',updatedby='${updatedby}' where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and active=1 `, async (err, updateProforma) => {
              if (err) {
                savedata(null, 500, err)
              } else {
                await db.query(`update ${process.env.TLE_DBNAME}.stuboostup set boostuprecord='${JSON.stringify(newboostuprecord)}',updatedat='${updatedat}',updatedby='${updatedby}' where boostupid='${previousdata.boostupid}'`, (upderr, updatedata) => {
                  if (upderr) {
                    savedata(null, 500, upderr)

                  } else {
                    savedata(null, 200, 'Boostup Requested')
                  }
                })
              }
            })
          })
        } else {
          savedata(null, 500, 'no changes')
        }
      }
    }
  })
}

exports.boostupapproval = async (req, res) => {
  const ayid = req.body.ayid
  const instid = req.body.instid
  const deptid = req.body.deptid
  const cid = req.body.cid
  const bid = req.body.bid
  const section = req.body.section
  const auth = req.headers.authorization;
const myjson={bid:bid, instid:instid  }
  findByBid(myjson,async (err, semdata) => {
    if (err) {
      res(null, 500, err)
    } else {
      // console.log(`select * from stuboostup where instid='${instid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semdata.semesternumber}`)
      await db.query(`select * from ${process.env.TLE_DBNAME}.stuboostup where instid='${instid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${2} `, (proerr, boostupData) => {
        if (proerr) {
          res(null, 500, proerr)
        } else {
          if (boostupData.length !== 0) {

            var boostupdata = boostupData[0]
            var filterdata = JSON.parse(boostupdata.boostuprecord).filter(v => v.status === 'request')
            boostupdata.boostuprecord = JSON.stringify(filterdata)
            if (filterdata.length !== 0) {
              res(null, 200, boostupdata)
            } else {
              res(null, 404, 'no data found')
            }
          } else {
            res(null, 404, 'no data found8')
          }


        }
      })
    }
  })

}


exports.saveBoostupData = async (req, res) => {

  const aid = req.body.aid
  const ayid = req.body.ayid
  const instid = req.body.instid
  const deptid = req.body.deptid
  const cid = req.body.cid
  const bid = req.body.bid
  const section = req.body.section
  const semesternumber = req.body.semesternumber
  const semestertype = req.body.semestertype
  const boostuprecord = req.body.boostuprecord
  const createdat = Date.getCurrentDate()
  const createdby = req.body.createdby
  const updatedat = Date.getCurrentDate()
  const updatedby = req.body.createdby
  const boostupid = req.body.boostupid

  await db.query(`select * from ${process.env.TLE_DBNAME}.stuboostup where boostupid='${boostupid}'`, async (selerr, preboostupData) => {
    if (selerr) {
      res(null, 500, selerr)
    } else {
      var preboostupdata = preboostupData[0]
      var preboostuprecord = JSON.parse(preboostupdata.boostuprecord)
      await db.query(`select * from ${process.env.TLE_DBNAME}.stuproforma where instid='${instid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber='${semesternumber}' and active=1`, async (proerr, preproformaData) => {
        if (proerr) {
          res(null, 500, proerr)
        } else {
          var preproformadata = preproformaData[0]
          var preproformarecord = JSON.parse(preproformadata.proformarecord)

          if (boostuprecord.status === 'approve') {
            console.log(1)
            // set boostup status in previous boostup data
            for (const prerecord of preboostuprecord) {
              if (prerecord.regno === boostuprecord.regno) {
                prerecord.isboosted = true
                prerecord.status = boostuprecord.status
              }
            }
            // set boostup status in previous proforma data
            for (const proforma of preproformarecord) {
              if (proforma.regno === boostuprecord.regno) {
                proforma.status = boostuprecord.status
                proforma.isboosted = true
              }
            }
            var newboostuprecord = JSON.stringify(preboostuprecord)
            var newproformarecord = JSON.stringify(preproformarecord)
            await db.query(`update ${process.env.TLE_DBNAME}.stuproforma set proformarecord='${newproformarecord}',updatedat='${updatedat}',updatedby='${updatedby}' where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and active=1 `, async (updproerr, updateProforma) => {
              if (updproerr) {
                res(null, 500, updproerr)
              } else {
                await db.query(`update ${process.env.TLE_DBNAME}.stuboostup set boostuprecord='${newboostuprecord}',updatedat='${updatedat}',updatedby='${updatedby}' where boostupid='${boostupid}'`, (updboosterr, updatedata) => {
                  if (updboosterr) {
                    res(null, 500, updboosterr)
                  } else {
                    res(null, 200, 'Request Boostup Approved')
                  }
                })
              }
            })
          } else if (boostuprecord.status === 'reject') {
            console.log(2)
            // console.log(boostuprecord)
            for (const prerecord of preboostuprecord) {
              if (prerecord.regno === boostuprecord.regno) {
                prerecord.isboosted = false
                prerecord.isreqboostup = false
                prerecord.status = boostuprecord.status
              }
            }
            // set boostup status in previous proforma data
            for (const proforma of preproformarecord) {
              if (proforma.regno === boostuprecord.regno) {
                delete proforma.status
                proforma.isboosted = false
                proforma.isreqboostup = false
                proforma.boosterproforma = ''
                proforma.boosterpercentage = ''
                proforma.boosterdays = ''
              }
            }
            var newboostuprecord = JSON.stringify(preboostuprecord)
            var newproformarecord = JSON.stringify(preproformarecord)
            await db.query(`update ${process.env.TLE_DBNAME}.stuproforma set proformarecord='${newproformarecord}',updatedat='${updatedat}',updatedby='${updatedby}' where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and cid='${cid}' and bid='${bid}' and section='${section}' and semesternumber=${semesternumber} and active=1 `, async (updproerr, updateProforma) => {
              if (updproerr) {
                res(null, 500, updproerr)
              } else {
                await db.query(`update ${process.env.TLE_DBNAME}.stuboostup set boostuprecord='${newboostuprecord}',updatedat='${updatedat}',updatedby='${updatedby}' where boostupid='${boostupid}'`, (updboosterr, updatedata) => {
                  if (updboosterr) {
                    res(null, 500, updboosterr)
                  } else {
                    res(null, 200, 'Request Boostup Approved')
                  }
                })
              }
            })
          } else {
            console.log(3)

          }
        }
      })
    }
  })

}  