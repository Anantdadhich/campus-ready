import express from "express"
import { prisma } from "./db/db"

const app=express()

app.use(express.json())



app.post("/signup",(req,res)=>{

})

app.post("signin",(req,res)=>{

})


app.post("upload",(req,res)=>{

})

app.post("convert",(req,res)=>{

})

app.get("convert",(req,res)=>{

})

app.get("conversions",(req,res)=>{

})
app.listen(3000);