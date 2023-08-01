const db = require("../../Config/DB/tle.db");
const Batch = require("../../Model/RavesModel/batch");
exports.getCid = (req, res, next) => {
  const cid = req.params.cid;
  const ayname = req.params.ayname.split('-')

  const fromyear = ayname[0]
  const toyear = ayname[1]
  db.query(
    `SELECT * FROM ${process.env.RAVES_DBNAME}.batch where fromyear<='${fromyear}' and toyear>='${toyear}' and cid='${cid}' order by fromyear desc;`,
    cid,
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (data.length !== 0) {
          res.status(200).send(data)
        } else {
          res.status(404).send('Batch Data not Found')
        }
      }
    }
  );
};

exports.getBid = (req, res) => {
  const bid = req.bid||req.params.bid;
  Batch.getbatch(bid, (err, data) => {
    if (err)
      res.status(500).send(err);
    else {
      res.status(200).send(data);
    };
  });
};


exports.getSectionByBid = (req, res) => {
  const bid = req.params.bid

  var status = ['Current', 'Admitted']
  db.query(`select distinct section from ${process.env.RAVES_DBNAME}.student where bid='${bid}' and active=1 and status in (?) order by section`, [status],
    (err, section) => {
      if (err) {
        res.status(500).send(err)
      } else {
        // console.log(section.length)
        if (section.length > 0) {

          var data = section.map((v) => {
            return v.section
          });
          res.status(200).send(data);
        } else {
          res.status(404).send("No Data Found");

        }

      }

    })

}