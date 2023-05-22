import bcrypt, { compareSync } from "bcrypt"
import { db } from "../database/database.connction.js"
import { v4 as uuid } from "uuid"

export async function signUpPost(req, res) {
    const { name, email, password, confirmPassword } = req.body
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
}

export async function signInPost(req, res) {
    const { email, password } = req.body
    try {
        const registredUser = await db.query(`SELECT id, password FROM users WHERE email = $1;`, [email])

        if (!registredUser.rows[0]) return res.status(404).send("E-mail não cadastrado!")
        if (!bcrypt.compareSync(password, registredUser.rows[0].password)) return res.status(401).send("Senha invalida!")

        const token = uuid()

        await db.query(`INSERT INTO valid_tokens ("userId",token) VALUES ($1,$2);`, [registredUser.rows[0].id, token])

        return res.status(200).send({ token: token })
    } catch (err) {
        return res.status(500).send(err.message)
    }

}

export async function getUserMe(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Invalid or unsent token")
    try {
        const user = await db.query(`SELECT "userId" FROM valid_tokens WHERE token = $1;`, [token])
        if (!user.rows[0]) return res.sendStatus(401)

        const userData = await db.query(`SELECT id, name FROM users  WHERE users.id = $1;															 
        `, [user.rows[0].userId])

        const { rows: shortenedUrls } = await db.query(`SELECT id, "shortUrl", url, "visitCount" 
        FROM shortened_urls WHERE "userId" = $1;`, [user.rows[0].userId])

        const userCount = await db.query(`SELECT SUM("visitCount") AS "visitCount" 
        FROM shortened_urls 
        WHERE "userId" = $1  
        GROUP BY "userId";`, [user.rows[0].userId])

        if (!userCount.rows[0]) {
            return res.status(200).send({ ...userData.rows[0], visitCount: 0, shortenedUrls })
        }
        res.status(200).send({ ...userData.rows[0], ...userCount.rows[0], shortenedUrls })

    } catch (err) {
        return res.status(500).send(err.message)
    }
}