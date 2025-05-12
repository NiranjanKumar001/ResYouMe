const multer=require("multer")
const path=require("path")
const fs=require("fs")

const uploadDir="../uploads/resumes"
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage=multer.diskStorage({
    destiantion:(req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now() + '-' + Math.round(Math.random()* 1E9)
        const fileExt=path.extname(file.originalname)
        cb(null,'resume-' + uniqueSuffix + fileExt)
}
})



const fileFilter = (req, file, cb) => {        //CHECKS IF THE FILE UPLOADED IS PDF OR NOT 
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload=multer({
    storage:storage,
    limits:{
        file:10*1024*1024  //only accept upto 10 mb
    },
    fileFilter:fileFilter   //accepts only pdf
})

module.exports=upload.single('resume')

