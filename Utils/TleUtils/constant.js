module.exports.statusNa=()=>{
    var statusNa='NA'
    return statusNa
}

module.exports.statusDone=()=>{
    var statusDone='DONE'
    return statusDone
}

module.exports.present=()=>{
    var present='P'
    return present
}

module.exports.absent=()=>{
    var absent='A'
    return absent
}

module.exports.PA=()=>{
    const presentabsent={
        Present:'PRESENT',
        Absent:'ABSENT',
        HalfDay:"HALFDAY"
    }
    return presentabsent
}
module.exports.AB=()=>{
    const attedenceboostup={
        None:"NA",
        pending:"Pending",
        approve:"Approved",
        reject:"Reject"

    }
    return attedenceboostup
}

module.exports.StaffStatus=()=>{
    const staffattendance={
         present:"P",
         absent:"A",
         halfday:"HA"
    }
    return staffattendance
}