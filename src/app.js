import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { nanoid } from "nanoid"
import { v4 as uuid } from "uuid"
import { db } from "./database/database.connction.js"
import joi from "joi"
import bcrypt, { compareSync } from "bcrypt"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(3),
        confirmPassword: joi.string().required().min(3)
    })

    const validation = signUpSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if (password != confirmPassword) {
        return res.status(422).send("The password and the confirmation doesn't match")
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    try {
        const registredUser = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
        if (registredUser.rows[0]) return res.status(409).send("Esse email já está cadastrado!")

        await db.query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$3);`, [name, email, hashedPassword])

        return res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message)
    }
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(3).required()
    })

    const validation = loginSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const registredUser = await db.query(`SELECT id, password FROM users WHERE email = $1;`, [email])

        if (!registredUser.rows[0]) return res.status(404).send("E-mail não cadastrado!")
        if (!bcrypt.compareSync(password, registredUser.rows[0].password)) return res.status(401).send("Senha invalida!")

        console.log(registredUser.rows[0])

        const token = uuid()

        await db.query(`INSERT INTO valid_tokens ("userId",token) VALUES ($1,$2);`, [registredUser.rows[0].id, token])

        return res.status(200).send({ token: token })
    } catch (err) {
        return res.status(500).send(err.message)
    }

})

app.post('/urls/shorten', async (req, res) => {
    const { url } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    const urlSchema = joi.object({
        url: joi.string().required(),
    })

    const validation = urlSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if (!token) return res.status(401).send("Invalid or unsent token")

    try {
        const user = await db.query(`SELECT "userId" FROM valid_tokens WHERE token = $1;`, [token])
        if (!user.rows[0]) return res.status(401).send("Invalid or unsent token")

        const shortened = nanoid()

        await db.query(`INSERT INTO shortened_urls ("userId","shortUrl",url) VALUES ($1,$2,$3);`, [user.rows[0].userId, shortened, url])

        const response = await db.query(`SELECT id, "shortUrl" FROM shortened_urls WHERE "shortUrl" = $1;`, [shortened])

        res.status(201).send(response.rows[0])
    } catch (err) {
        return res.status(500).send(err.message)
    }
})

app.get('/urls/:id', async (req, res) => {
    const { id } = req.params

    try{
        const response = await db.query(`SELECT id, "shortUrl", url FROM shortened_urls WHERE id = $1`,[id])
        if(!response.rows[0]) return res.sendStatus(404)
        res.status(200).send(response.rows[0])
    }catch (err){
        return res.status(500).send(err.message)
    }
})



const port = process.env.PORT || 5000
app.listen(port, () => console.log(`app running on port ${port}`))