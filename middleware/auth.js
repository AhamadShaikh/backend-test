const jwt = require("jsonwebtoken")

const middeleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {

        if (!token) {
            return res.status(400).json({ msg: "Token not provided" })
        }

        const decoded = jwt.verify(token, "thor")

        if (!decoded) {
            res.status(400).json({ msg: "Invalid Credentials" })
        }

        req.userId = decoded.userId

        next()

    } catch (error) {
        res.status(400).json({ msg: "internal server error" })
    }
}

module.exports=middeleware