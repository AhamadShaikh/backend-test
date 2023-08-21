const { default: mongoose } = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    slots: { type: Number, required: true },
    fee: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

const Appointment = mongoose.model("appointments", appointmentSchema)

module.exports = Appointment