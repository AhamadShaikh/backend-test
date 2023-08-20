
const express = require("express")
const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const blackListToken = require("../model/blacklist")

const router = express.Router()

const app = express()
app.use(express.json());

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: "User already registered" });
        }

        let newPassword = await bcrypt.hash(password, 10);
        let newUser = await User.create({ ...req.body, password: newPassword });

        res.status(200).json({ msg: "Registration successfull", user: newUser });
    } catch (error) {
        res.status(500).json({ msg: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        return res.status(400).json({ msg: "User not found" });
      }
  
      const verify = await bcrypt.compare(password, existingUser.password);
  
      if (!verify) {
        return res.status(401).json({ msg: "Wrong credentials" });
      }
  
      const token = jwt.sign(
        { userId: existingUser._id, name: existingUser.username },
        "ironman",
        { expiresIn: "2d" }
      );
  
      const refreshToken = jwt.sign(
        { userId: existingUser._id, name: existingUser.username },
        "thanos",
        { expiresIn: "7d" }
      );
  
      res.status(200).json({
        msg: "Login successful",
        token,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });



router.get("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        if (!token) {
            return res.status(400).json({ error: 'Token not provided' });
        }

        // Check if the token is blacklisted
        const isBlacklisted = await blackListToken.exists({ token });
        if (isBlacklisted) {
            return res.status(400).json({ error: 'Token has already been invalidated' });
        }

        // Blacklist the token
        await blackListToken.create({ token });

        res.status(200).json({ msg: 'User has been logged out' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log out' });
    }
})



module.exports = router