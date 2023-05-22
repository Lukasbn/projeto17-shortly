import { db } from "../database/database.connction.js"
import { nanoid } from "nanoid"


export async function postShorten (req, res){
    const { url } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Invalid or unsent token")
    try {
        const user = await db.query(`SELECT "userId" FROM valid_tokens WHERE token = $1;`, [token])
        if (!user.rows[0]) return res.sendStatus(401)
        const shortened = nanoid()
        await db.query(`INSERT INTO shortened_urls ("userId","shortUrl",url) VALUES ($1,$2,$3);`, [user.rows[0].userId, shortened, url])
        const response = await db.query(`SELECT id, "shortUrl" FROM shortened_urls WHERE "shortUrl" = $1;`, [shortened])
        res.status(201).send(response.rows[0])
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export async function getById (req, res){
    const { id } = req.params
    try{
        const response = await db.query(`SELECT id, "shortUrl", url FROM shortened_urls WHERE id = $1`,[id])
        if(!response.rows[0]) return res.sendStatus(404)
        res.status(200).send(response.rows[0])
    }catch (err){
        return res.status(500).send(err.message)
    }
}

export async function urlOpener (req,res){
    const { shortUrl } = req.params
    try{
        const link = await db.query(`SELECT "visitCount", url FROM shortened_urls WHERE "shortUrl" = $1;`,[shortUrl])
        if(!link.rows[0]) return res.sendStatus(404)
        await db.query(`UPDATE shortened_urls SET "visitCount" = $1 WHERE "shortUrl" = $2;`,[(link.rows[0].visitCount + 1),shortUrl])
        res.redirect(link.rows[0].url)
    }catch (err){
        return res.status(500).send(err.message)
    }
}

export async function deleteUrl (req,res){
    const { id } = req.params
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Invalid or unsent token")
    try{
        const user = await db.query(`SELECT "userId" FROM valid_tokens WHERE token = $1;`, [token])
        if (!user.rows[0]) return res.sendStatus(401)
        const urlOwner = await db.query(`SELECT "userId" FROM shortened_urls WHERE id = $1;`,[id])
        if (! urlOwner.rows[0]) return res.sendStatus(404)
        if(user.rows[0].userId != urlOwner.rows[0].userId) return res.sendStatus(401)
        await db.query(`DELETE FROM shortened_urls WHERE id = $1`,[id])
        res.sendStatus(204)
    }catch (err){
        return res.status(500).send(err.message)
    }
}

export async function getRanking(req,res){
    try{
        const {rows: response} = await db.query(`SELECT users.id, users.name, 
        COUNT(sh.url) AS "linksCount",SUM(COALESCE(sh."visitCount",0)) AS "visitCount" 
        FROM users LEFT JOIN shortened_urls sh ON sh."userId" = users.id 
        GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10;															 
        `)
        res.status(200).send(response)
    }catch (err){
        return res.status(500).send(err.message)
    }
}