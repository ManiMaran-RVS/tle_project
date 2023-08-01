const db = require("../../Config/DB/tle.db");

var Batch = function () {

}

Batch.getbatch = function (bid, result) {
   db.query(`select * from ${process.env.RAVES_DBNAME}.batch where bid='${bid}'`, 
    (err, batches) => {
      if (err) {
        res.status(500).send(err)
      } else {
        if (batches !== null) {
          const batch = batches[0]
            db.query(`select * from ${process.env.RAVES_DBNAME}.courses where active=1 and cid='${batch.cid}'`, (err, data) => {
            if (err || data == null) {
              res.status(500).send(err)
            } else {
              const programmes = data[0].name
              const programmesshortname = data[0].shortname
              batch.programmename = programmes
              batch.programmeshortname=programmesshortname
              result(null, batch)
            }
          })
        } else {
          res.status(500).send("batch not found")
        }
      }
    })
}
module.exports = Batch



