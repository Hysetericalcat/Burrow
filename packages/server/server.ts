import express,{Request,Response} from "express"

const app = express()

app.use(express.json())
app.post("/query",async(req:Request,res:Response)=>{
   const data = req.body
   console.log(data.message)
   res.send(data.message)
})

console.log("Server is listening on port 3000")
app.listen(3000)