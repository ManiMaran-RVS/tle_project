
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
    let cal = new Date();
    cal.setUTCHours(0);
    cal.setUTCMinutes(0);
    cal.setUTCSeconds(0);
    cal.setUTCMilliseconds(0);
    let date = cal.valueOf();
    // console.log(cal)
    return date
}

module.exports.getDateWithEndTime = () => {
    let cal = new Date();
    cal.setUTCHours(23);
    cal.setUTCMinutes(59);
    cal.setUTCSeconds(59);
    cal.setUTCMilliseconds(999);
    let date = cal.valueOf();

    return date
}

module.exports.getPreviousDate=()=>{
    var d = new Date();
    d.setDate(d.getDate() - 1)
    return d
}

