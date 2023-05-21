import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { nanoid } from "nanoid"
import dayjs from "dayjs"
import { v4 as uuid } from "uuid"
import { db } from "./database/database.connction.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/funfa', async (req,res)=>{
    const url_encurtada = nanoid()
    const result = await db.query(`SELECT * FROM users;`)
    console.log(result)
    res.send(result)
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`app running on port ${port}`))