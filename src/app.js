import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { nanoid } from "nanoid"
import dayjs from "dayjs"
import { v4 as uuid } from "uuid"
import { db } from "./database/database.connction.js"
import joi from "joi"
import bcrypt, { compareSync } from "bcrypt"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.post('/signup', async (req,res)=>{
    const { name, email, password, confirmPassword } = req.body

    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(3),
        confirmPassword: joi.string().required().min(3)
    })
    
    const validation = signUpSchema.validate(req.body, {abortEarly: false})

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    
    if(password != confirmPassword){
        return res.status(422).send("The password and the confirmation doesn't match")
    }

    const hashedPassword = bcrypt.hashSync(password,10)

    try{
        const registredUser = await db.query(`SELECT * FROM users WHERE email = $1;`,[email])
        if(registredUser.rows[0])return res.status(409).send("Esse email já está cadastrado!")

        await db.query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$3);`,[name,email,hashedPassword])

        return res.sendStatus(201)
    }catch (err){
        return res.status(500).send(err.message)
    }
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`app running on port ${port}`))