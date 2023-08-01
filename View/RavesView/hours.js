const constant=require('../../Utils/RavesUtils/constant')

module.exports=class Hours{
    constructor(hour,timefrom,timeto){
        this.hour=hour,
        this.timefrom=timefrom,
        this.timeto=timeto,
        this.status=constant.statusNa()
        this.presents=0,
        this.absents=0
    }
}