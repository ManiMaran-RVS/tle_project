const db = require("../../Config/DB/tle.db");

exports.getAllAcademicYear = async (req, res) => {
    var instid = req.params.instid
    await db.query(`select * from ${process.env.RAVES_DBNAME}.academicyear where instid='${instid}' and ayname order by ayname desc`,
        (err, aydata) => {
            if (err) {
                res.status(500).send("Error Query Data")
            } else {
                res.status(200).send(aydata)
            }
        })
}

