
module.exports.getCurrentDate = () => {
    let d = new Date()
    let date = d.valueOf()
    return date
}
module.exports.getCurrentDateEndTime = () => {
    let cal = new Date();
    cal.setUTCHours(23);
    cal.setUTCMinutes(59);
    cal.setUTCSeconds(59);
    cal.setUTCMilliseconds(0);
    let date = cal.valueOf();

    return date
}
module.exports.getCurrentDateOnly = () => {
    let cal = new Date().toISOString();
    cal.setUTCHours(0)
    cal.setUTCMinutes(0);
    cal.setUTCSeconds(0);
    cal.setUTCMilliseconds(0);
    let date = cal.valueOf();

    return date
}

module.exports.getDateWithEndTime = () => {
    let cal = new Date();
    cal.seUTCtHours(23);
    cal.setUTCMinutes(59);
    cal.setUTCSeconds(59);
    cal.setUTCMilliseconds(999);
    let date = cal.valueOf();

    return date
}

module.exports.getCurrentTime=()=>{
    let cal = new Date().toISOString();
    return cal
}
