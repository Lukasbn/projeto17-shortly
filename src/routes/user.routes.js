import { Router } from "express"
import { getUserMe, signInPost, signUpPost } from "../controllers/user.controllers.js"
import { loginSchema, signUpSchema } from "../schemas/user.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"

const userRouter = Router()

userRouter.post('/signup',validateSchema(signUpSchema), signUpPost)
userRouter.post('/signin',validateSchema(loginSchema), signInPost)
userRouter.get('/users/me', getUserMe)

export default userRouter