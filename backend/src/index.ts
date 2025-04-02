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
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));







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
          conversionid:conversion.id
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
        const xmlpath=path.join(xmlstorage,path.basename(conversion.xmlfileName));
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

    if(conversion.status !== "COMPLETED" || !conversion.xmlfileName){
      res.status(403).json({message:"coversion not completed "})
      return
    }

 const safexmlname=path.basename(conversion.xmlfileName);
 const xmlpath=path.join(xmlstorage,safexmlname)


 const originalName=path.parse(conversion.originalName).name;

 res.download(xmlpath,`${originalName}.xml`,(err)=>{
  if(err){
    console.log(err);
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




app.listen(PORT,()=>{
  console.log(`server running on ${PORT}`)
});

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


