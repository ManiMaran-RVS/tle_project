const db = require("../../Config/DB/tle.db");
const Batch = require('../../Model/RavesModel/batch')

exports.findByRegno = (req, res, next) => {

    var instid = req.params.instid
    var deptid = req.params.deptid
    var regno = req.params.regno
    // console.log(regno)
    var data = ['Current', 'Admitted']

    db.query(`select * from ${process.env.RAVES_DBNAME}.student where instid='${instid}' and deptid='${deptid}' and regno='${regno}' and active=1 and status in ('${data.join("','")}')`,
        async (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                const studentData = data[0];
                if (studentData != null) {
                    const bid = studentData.bid
                    Batch.getbatch(bid, (err, data) => {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            const bname = data.bname
                            const programmename = data.programmename
                            studentData.bname = bname
                            studentData.programmename = programmename
                            res.status(200).send(studentData)
                        }

                    })


                } else {
                    // console.log("No Student Data Found")
                    res.status(404).send("No Student Data Found")
                }
            }
        })
}


exports.findByBidSection = (req, res) => {

    const bid = req.bid||req.params.bid
    const section = req.section||req.params.section
    const status = ['Current', 'Admitted']


    Batch.getbatch(bid, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            const batch = data
            // select * from UAT_RAVES.student where bid='fc905521-fa23-4a03-bea4-f69c8d2fa229' and section='A' and active=1 and  status in ('Current', 'Admitted') order by ifnull(`regno`,`firstname`) asc ;
            db.query(`select * from ${process.env.RAVES_DBNAME}.student where bid='${bid}'and section='${section}' and active=1 and status in ('${status.join("','")}') order by ifnull(regno,firstname) asc`, (err, student) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    // console.log(student)
                    if (batch !== null && !student.length == 0) {
                        batch.students = student
                        res.status(200).send(batch)
                    }
                }
            })

        }

    })
}
exports.findByCidBidSection = (req, res) => {
    const cid = req.cid||req.params.cid
    const bid = req.bid||req.params.bid
    const section = req.section||req.params.section
    const status = ['Current', 'Admitted']


    db.query(`select * from ${process.env.RAVES_DBNAME}.student where cid='${cid}' and bid='${bid}' and section='${section}' and active=1 and status in ('${status.join("','")}') order by regno asc `, (err, student) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.status(200).send(student)

        }
    })

}

exports.getAllStudents = (req, res) => {
    db.query(`select * from ${process.env.RAVES_DBNAME}.student where deptid='40d773af-52b1-4b6d-95cc-1fa8c1040d42'`, async (err, data) => {
        if (err) {
            await res.status(500).json(err)
        } else {
            await res.status(200).json(data)
        }
    })
}