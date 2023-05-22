import { Router } from "express"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { deleteUrl, getById, getRanking, postShorten, urlOpener } from "../controllers/urls.controller.js"
import { urlSchema } from "../schemas/urls.schemas.js"

const urlRouter = Router()

urlRouter.post('/urls/shorten',validateSchema(urlSchema), postShorten)
urlRouter.get('/urls/:id', getById)
urlRouter.get('/urls/open/:shortUrl', urlOpener)
urlRouter.delete('/urls/:id', deleteUrl)
urlRouter.get('/ranking', getRanking)

export default urlRouter