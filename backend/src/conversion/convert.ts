import fs from "fs"
import path from "path"
import xml2js from "xml2js"
import pdf from "pdf-parse"
import { prisma } from "../db/db"



export const pdfprocess=async (pdfpath:string,xmlpath:string,conversionId:string):Promise<void> =>{
    try {
        const databuffer=await fs.promises.readFile(pdfpath);
      

        const pdfdata=await pdf(databuffer)


        if (!fs.existsSync(pdfpath)) {
            console.error("File not found:", pdfpath);
            return;
        }

        //xml structure
        const xmlobj={
            document:{
                metadata:{
                    title:path.basename(pdfpath),
                    pages:pdfdata.numpages,
                    createdAt:new Date().toISOString()


                },
                content:{
                    text:pdfdata.text.split("\n").map(line => ({
                        line:line.trim() || " " 
                    }))
                }
            }
        }


        const builder=new xml2js.Builder({
            xmldec:{
                version:"1.0" ,encoding:"UTF-8"
            }
        })

        const xml=builder.buildObject(xmlobj)

        await fs.promises.writeFile(xmlpath,xml)

        await prisma.conversion.update({
            where:{
                id:conversionId
            },
            data:{
                status:"COMPLETED"
            }
        });

         
    } catch (error) {
        console.log(error)
        await prisma.conversion.update({
            where: { id: conversionId },
            data: { status: "FAILED" }
        });
        throw error
    }
}