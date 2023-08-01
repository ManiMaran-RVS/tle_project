const db = require("../../Config/DB/tle.db");

exports.getAllEmployee = (req, res, next) => {
  db.query(`SELECT * FROM ${process.env.RAVES_DBNAME}.employees`, (err, data) => {
    if (err) return next(new AppError(err, 500));
    res.status(200).json(data);
  });
};

exports.get = (req, res, next) => {
  const eid = req.params.eid;
  db.query(`select * from ${process.env.RAVES_DBNAME}.employees where eid='${eid}'`, async function (error, data) {
    if (error) {
      res.status(500).send("error ocurred");
    } else {
      res.status(200).send(data[0]);
    }
  }
  );
};



exports.getattendancedaytype = async (req, res) => {
  const instid = req.instid||req.params.instid
  const ayid = req.ayid||req.params.ayid
  const deptid = req.deptid||req.params.deptid
  const date = req.date||req.params.date

  await db.query(`select * from ${process.env.RAVES_DBNAME}.calcourseconfigure where instid='${instid}' and ayid='${ayid}' and deptid='${deptid}' and active=1`, (err, data) => {
    if (err) {
      res.sendStatus(500)
    } else {
      if (data.length !== 0) {
        const callevelid = data[0].callevelid
        db.query(`select * from ${process.env.RAVES_DBNAME}.calendardraft where ayid='${ayid}' and instid='${instid}' and callevelid='${callevelid}' and caldate=${date} and active=1 order by caldate`, (err, data) => {
          if (err) {
            res.sendStatus(500)
          } else {
            if (data.length !== 0) {
              res.status(200).send(data[0])
            } else {
              res.sendStatus(404)
            }
          }
        })
      } else {
        res.sendStatus(404)
      }

    }
  })

}


// get staff data

exports.staffDetails = (req, res) => {
  const instid = req.instid||req.params.instid
  const deptid = req.deptid||req.params.deptid
  db.query(`select * from ${process.env.RAVES_DBNAME}.employees where instid='${instid}' and deptid='${deptid}' and active=1 order by firstname asc `, (err, data) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.status(200).send(data)
    }
  })
}

exports.getEmployeeName = async (req, res) => {
  const eids = req.eids||req.body.eids
  await db.query(`select eid,firstname as name from ${process.env.RAVES_DBNAME}.employees where active=1 and eid in ('${eids.join("','")}')`, (err, data) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.status(200).send(data)
    }
  })
}