import express from "express"
import { prisma } from "./db/db"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "./config"
import path from "path"
import cors from "cors"
import fs from "fs"
import { upload, xmlstorage } from "./storage"
import { authmiddleware, ExpressRequest } from "./middleware/auth"
import { pdfprocess } from "./conversion/convert"
import dotenv from "dotenv";
dotenv.config();

const app=express()

app.use(express.json())
//app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors({
 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],   
  credentials: true 
}));




const PORT=process.env.PORT || 3001;


app.post("/api/auth/register",async (req,res)=>{
  const {name,email,password}=req.body;
     try {
        const existinguser=await prisma.user.findUnique({
            where:{
                email
            }
        })

        if (existinguser){
            res.status(400).json({message:"user already register"})
        }

        const hashedPassword=await bcrypt.hash(password,12)


        const user=await prisma.user.create({
            data:{
                email:email,
                name:name,
                password:hashedPassword
            }
        })

        const jwttoken=jwt.sign({
            id:user.id,
            email:user.email
        },JWT_PASSWORD)

        res.status(200).json({userId:user,jwttoken})

        
     } catch (error) {
        console.log(error)
        res.status(500).json({message:"error in register"})
     }

})

app.post("/api/auth/login",async(req,res)=>{
  const {email,password}=req.body  

  try {
      const user=await prisma.user.findUnique({
        where:{
            email
        }
      })

      if(!user){
        res.status(403).json({message:"user not exist"})
        return
      }

      const ispasswordvalid=await bcrypt.compare(password,user.password)
      if(!ispasswordvalid){
        res.status(403).json({message:"password not working"})
        return 
      }

      const jwttoken=jwt.sign(
        {
            id:user.id,
            email:user.email
        },JWT_PASSWORD
      )

      res.status(200).json({userId:user,jwttoken})

  } catch (error) {
    console.log(error)
    res.status(500).json({message:"error in login"})
  }

})



app.get("/api/auth/user", authmiddleware, async (req: ExpressRequest, res) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//upload file route
app.post("/api/upload",authmiddleware,upload.single('file'),async (req:ExpressRequest,res)=>{
        try {
          if(!req.file){
            res.status(404).json({message:"file not uploaded"})
            return
          }

          if (!req.userId) {
            res.status(403).json({ message: "Unauthorized" });
            return
        } 


        const {  originalname,filename,path:filePath}=req.file;
        const {name:baseName}=path.parse(filename);
        const xmlfilename=`${baseName}.xml`;
        const xmlfilepath=path.join(xmlstorage,xmlfilename);


        const conversion =await prisma.conversion.create({
            data:{
              userId:req.userId,
              originalName:originalname,
              fileName:filename,
              xmlfileName:xmlfilename,
              status:"PENDING"
            }
        })
         
  
        pdfprocess(filePath,xmlfilepath,conversion.id);

        res.status(200).json({
            message:"file uploaded",
            conversion:{
              id:conversion.id,
              originalname,
              status:"PENDING"
            }
        })


        } catch (error) {
          console.log(error)
          res.status(500).json({message:"error in file  uploaded"})
        }
})
//user conversinos
app.get("/api/conversions",authmiddleware,async(req:ExpressRequest,res)=>{
     try {
       const conversions=await prisma.conversion.findMany({
        where:{
          userId:req.userId,

        },
        orderBy:{
          createdAt:"desc"
        }
       })  

         

       res.status(200).json({
         conversions
       })

     } catch (error) {
      console.log(error)
      res.status(500).json({message:"error in getting conversions"})
     }
})

//conversions 
app.get("/api/conversions/:id",authmiddleware,async (req:ExpressRequest,res)=>{
    try {
      const {id}=req.params;

      const conversion=await prisma.conversion.findUnique({
        where:{
          id
        }
      })

      if(!conversion){
        res.status(404).json({message:"conversion not found "})
        return
      }

      if(conversion.userId !== req.userId){
        res.status(403).json({message:"forbidden"})
        return
      }

      let xmlContent='';

      if(conversion.status==="COMPLETED"){
        const xmlpath=path.join(xmlstorage,conversion.xmlfileName);
          try {
            xmlContent=await fs.promises.readFile(xmlpath,"utf-8")
          } catch (error) {
            console.error(error);
            res.status(404).json({ 
                message: "XML file not found",
            });
            return
          }

      }

      res.status(200).json({
        conversion,
        xmlContent
      })


    } catch (error) {
      console.error( error);
      res.status(500).json({ message: 'Server error' });
    }
   
})



app.get("/api/conversions/:id/download",authmiddleware,async(req:ExpressRequest,res)=>{
     try {
      const {id}=req.params;


     const conversion=await prisma.conversion.findUnique({
      where:{
        id
      }
     })

     if(!conversion){

      res.status(404).json({ message: 'conversion not download' });
      return
     }

    if(conversion.userId !== req.userId ){
      res.status(403).json({message:"forbidden"})
      return
    }

    if(conversion.status !== "COMPLETED"){
      res.status(403).json({message:"coversion not completed "})
      return
    }

 const safexmlname=path.basename(conversion.xmlfileName);
 const xmlpath=path.join(xmlstorage,safexmlname)
 
 if (!fs.existsSync(xmlpath)) {
  console.error(` XML file not found at path: ${xmlpath} for conversion ${id}`);
   res.status(404).json({ message: "conversion xml file not found " });
   return
}

 const originalName=path.parse(conversion.originalName).name;

 res.download(xmlpath,`${originalName}.xml`,(err)=>{
  if(err){
    console.log(`error during download stream ${xmlpath}`,err);
    if(!res.headersSent){
      res.status(404).json({
        message:"file no availabale"
      })
    }
  }
 })
  


/*
 res.setHeader("Content-Type", "application/xml");
 res.setHeader("Content-Disposition", `attachment; filename="${originalName}.xml"`);
 
 // Send XML content directly from the database
 res.send(conversion.xmlfileName);
  */
 
  } catch (error) {
      console.log(error)
      res.status(500).json({message:"server error not download  "})
   
     }

})

app.delete("/api/conversions/:id",authmiddleware,async(req:ExpressRequest,res)=>{
  try {
   const {id}=req.params;


  const conversion=await prisma.conversion.findUnique({
   where:{
     id
   }
  })

  if(!conversion){

   res.status(403).json({ message: 'conversion not download' });
   return
  }
 if(conversion.userId !== req.userId ){
   res.status(403).json({message:"forbidden"})
   return
 }

   const pdfpath=path.join('./uploads/pdfs',conversion.fileName);
   const xmlpath=path.join(xmlstorage,conversion.xmlfileName);
    
 if (!xmlpath.startsWith(xmlstorage)) {
    res.status(403).json({ message: "Invalid file path" });
    return;
}

   if(fs.existsSync(pdfpath)){
    fs.unlinkSync(pdfpath)
   }

   if(fs.existsSync(xmlpath)){
    fs.unlinkSync(xmlpath)
   }


   await prisma.conversion.delete({
    where:{
      id
    }
   })


   res.status(200).json({message:"conversion deleted"})



} catch (error) {
   console.log(error)
   res.status(500).json({message:"server error not download  "})

  }

})

app.get("/api/conversions/:id/preview", authmiddleware, async (req: ExpressRequest, res) => {
  try {
      const { id } = req.params;

      const conversion = await prisma.conversion.findUnique({
          where: { id },
          select: { fileName: true, userId: true }
      });

      if (!conversion) {
         res.status(404).json({ message: "Conversion not found" });
         return
      }

      if (conversion.userId !== req.userId) {
          res.status(403).json({ message: "Forbidden" });
          return
      }

      const pdfPath = path.join(__dirname, "../uploads", "pdfs", conversion.fileName);

      if (!fs.existsSync(pdfPath)) {
          res.status(404).json({ message: "PDF file not found" });
          return
      }

    
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${conversion.fileName}"`);

   
      const stream = fs.createReadStream(pdfPath);
      stream.pipe(res);
  } catch (error) {
      console.error("Error in PDF preview:", error);
      res.status(500).json({ message: "Server error" });
  }
});





app.listen(PORT,()=>{
  console.log(`server running on ${PORT}`)
});



