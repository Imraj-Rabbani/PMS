import "dotenv/config"
import express from "express"
import { signUp, signIn, profile } from "./controllers/auth"
import { verifyToken } from "./middleware/auth"

const app = express()
app.use(express.json())

app.post("/signup", signUp)
app.post("/signin", signIn)
app.get("/profile", verifyToken, profile)

app.listen(3000)