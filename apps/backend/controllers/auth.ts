import {type Request, type Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../db"
import { signupSchema, signinSchema } from "../validation/auth"
import { type AuthRequest } from "../middleware/auth"

const JWT_SECRET = process.env.JWT_SECRET!
const SALT_ROUNDS = 12

export async function signUp(req: Request, res: Response) {
    const parsed = signupSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    }
    const { name, email, password } = parsed.data

    try {
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return res.status(409).json({ error: "Email already in use" })
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true },
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

        return res.status(201).json({ user, token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

export async function signIn(req: Request, res: Response) {
    const parsed = signinSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    }
    const { email, password } = parsed.data

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

        return res.status(200).json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}

export async function profile(req: AuthRequest, res: Response) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true },
        })
        if (!user) return res.status(404).json({ error: "User not found" })
        return res.json({ user })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}