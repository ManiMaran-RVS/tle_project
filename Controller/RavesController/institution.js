const db = require("../../Config/DB/tle.db");

exports.getInstitution = async (req, res) => {
    let instid = req.params.instid
    db.query(`select * from ${process.env.RAVES_DBNAME}.institution where instid='${instid}' and active=1`, (err, data) => {
        if (err) {
            res.status(500).send('Query Error')
        } else {
            res.status(200).send(data)
        }
    })
}

exports.getAllInstitution = async (req, res) => {
    var aid = '9b809d3b-ca85-4818-ab27-6c0e577a7392' // rvsgroup
    db.query(`select * from ${process.env.RAVES_DBNAME}.institution where aid='${aid}' and active=1`, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })

}