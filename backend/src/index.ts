import express from "express"
import { prisma } from "./db/db"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "./config"

import cors from "cors"
import { upload } from "./storage"
const app=express()
app.use(cors())

app.use(express.json())




app.post("/register",async (req,res)=>{
  const {name,email,password}=req.body;
     try {
        const existinguser=await prisma.user.findUnique({
            where:{
                email
            }
        })

        if (!existinguser){
            res.status(400).json({message:"user already register"})
        }

        const hashedPassword=await bcrypt.hash(password,10)


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

app.post("/login",async(req,res)=>{
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


app.post("/upload",upload.single('file'),(req,res)=>{
      
})

app.post("/convert",(req,res)=>{

})

app.get("/convert",(req,res)=>{

})

app.get("/conversions",(req,res)=>{

})
app.listen(3000);