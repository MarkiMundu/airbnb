import express from "express"
import { login,sighUp,logOut } from "../controllers/auth.controller.js"

const authRouter=express.Router()

//route for sign up.
authRouter.post("/signup",sighUp)
//route for login.
authRouter.post("/login",login)
//route for logout.
authRouter.post("/logout",logOut)


export default authRouter


