const { default: mongoose } = require("mongoose");

const blackListSchema = new mongoose.Schema({
    token: { type: String, required: true }
})

const blackListToken = new mongoose.model("blacklistToken", blackListSchema)

module.exports = blackListToken