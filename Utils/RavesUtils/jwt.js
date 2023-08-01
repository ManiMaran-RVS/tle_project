const jwt=require("jsonwebtoken")


exports.generateToken=(user)=>{
    const token=jwt.sign(user,process.env.SECRET)
    // console.log(token)
    return token
}