const multer= require('multer')




exports.upload=(req,file,res,next)=>{

    let storage = multer.diskStorage({
        destination: './uploads',
        filename: 
              file.fieldname + '-' + Date.now () 
      });
      // console.log(storage)
      const upload = multer({storage: storage},{
        limits:1000
      }) 
      
     next();
}
