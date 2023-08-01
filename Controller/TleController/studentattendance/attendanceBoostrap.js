const saveService = require("../../../Model/AttendanceModel/boostup")


exports.reqBoostup = async (req, res) => {
    await saveService.reqboostup(req, (err,status, recordData) => {
        if (status===500) {
            res.status(status).send(recordData)
        } else {
            res.status(status).send(recordData)
        }
    })
}

exports.getboostupforapproval = async (req, res) => {
    await saveService.boostupapproval(req, (err,status ,getrecord) => {
        if (err) {
            res.status(status).send(err)
        } else {
            // console.log(getrecord)
            res.status(status).send(getrecord)
        }
    })
}

exports.saveBoostupRecord=async(req,res)=>{
    await saveService.saveBoostupData(req,(err,status,resdata)=>{
        if(err){
            res.status(status).send(err)
        }else{
            res.status(status).send(resdata)
        }
    })
}



