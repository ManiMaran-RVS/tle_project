module.exports.statusNa=()=>{
    var statusNa='NA'
    return statusNa
}

module.exports.statusDone=()=>{
    var statusDone='DONE'
    return statusDone
}

module.exports.getHours=async(arr)=>{
    
    const status=this.statusNa
    for (var i = 0; i < arr .length; i ++ ){
        arr[i]={...arr[i],...{present:0,absent:0,status}};
        // console.log(arr[i]);
        return arr[i]
    }
}
exports.fromEmail = {
    email: "devteam@rvsgroup.com",
    name: "Dev-Team",
  };
exports.toEmail = {
    email: "devteam@rvsgroup.com",
    name: "RVS Admission Team",
  };
