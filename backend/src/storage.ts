import multer from "multer";
import fs from "fs"
import path from "path"


export const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const dir=path.resolve(__dirname,'../uploads/pdfs');
        if(!fs.existsSync(dir)){
          fs.mkdirSync(dir,{recursive:true})
        }
        cb(null,dir)
    },
    filename:function(req,file,cb){
       const uniqueSuffix=Date.now()+'-'+Math.round(Math.random() *1E9)
       const extension = path.extname(file.originalname);
       cb(null,file.fieldname + '-'+uniqueSuffix +extension)
    }
})

export const xmlstorage = path.resolve(__dirname, "../uploads/xml");


if(!fs.existsSync(xmlstorage)){
   fs.mkdirSync(xmlstorage,{recursive:true})
}


export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null ,false);
        }
    }
});


