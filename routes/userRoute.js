
const express = require("express");
const User = require("../model/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../model/blacklist");

const router = express.Router()

router.post("/signup", async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ msg: "User already registered" })
        }

        let newPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ ...req.body, password: newPassword, confirmPassword: newPassword })

        await user.save()

        return res.status(200).json({ msg: "User registered successfully" })

    } catch (error) {
        res.status(400).json({ msg: "Registration failed" })
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(400).json({ msg: "User not found" })
        }

        let verify = await bcrypt.compare(password, existingUser.password)

        if (!verify) {
            return res.status(400).json({ msg: "Invalid Credentials" })
        }

        const token = jwt.sign({ userId: existingUser._id }, "thor", { expiresIn: "2d" })

        const rToken = jwt.sign({ userId: existingUser._id }, "thanos", { expiresIn: "5d" })


        return res.status(200).json({ msg: "Login successfull", token: token, refreshToken: rToken })

    } catch (error) {
        res.status(400).json({ msg: "Login failed" })
    }
})

router.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {

        if (!token) {
            return res.status(400).json({ msg: "Token not provided" })
        }

        let isBlacklist = await BlacklistToken.exists({ token })

        if (isBlacklist) {
            return res.status(400).json({ msg: "Tooken has been already invalidated" })
        }

        await BlacklistToken.create({ token })

        return res.status(200).json({ msg: "Logout successfull" })

    } catch (error) {
        res.status(400).json({ msg: "Logout failed" })
    }
})

module.exports = router