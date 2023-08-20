const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/userRoutes");
const restaurantsRouter = require("./routes/restaurantsRoute")
const cors = require("cors")

const app = express();

app.use(express.json());

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};


app.use("/users", userRouter);
app.use("/restaurants", restaurantsRouter);

app.use(cors({
    origin: 'http://localhost:3000'
}));

const PORT = process.env.PORT || 7000;
app.listen(PORT, async () => {
    await connection();
    console.log(`Server is running on port ${PORT}`);
});
