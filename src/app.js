import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.routes.js"
import urlRouter from "./routes/urls.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use(userRouter)
app.use(urlRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`app running on port ${port}`))