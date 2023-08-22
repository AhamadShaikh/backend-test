
const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config()
const userRouter = require("./routes/userRoute")
const appointmentRouter = require("./routes/appointmentRoute")
const cors = require("cors")

const app = express()
app.use(express.json())

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error);
    }
}

app.use(cors({
    origin: 'http://localhost:3000'
}))



///////
app.use("/users", userRouter)
app.use("/", appointmentRouter)


const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
    connection()
    console.log("port on 7000")
})