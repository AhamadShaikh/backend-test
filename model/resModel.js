
const { default: mongoose } = require("mongoose");

const restaurantsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, required: true },
    number_of_votes: { type: Number, required: true },
    price_starts_from: { type: Number, required: true },
    image: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
})

const Restaurant = mongoose.model("restaurants", restaurantsSchema)

module.exports = Restaurant
