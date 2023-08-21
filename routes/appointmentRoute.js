
const express = require("express");
const User = require("../model/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../model/blacklist");
const middeleware = require("../middleware/auth");
const Appointment = require("../model/appointmentModel");

const router = express.Router()


router.get("/appointments", middeleware, async (req, res) => {
    try {

        const { specialization, sort, search } = req.query

        let query = {}


        if (specialization) {
            query.specialization = specialization
        }

        if (search) {
            query.name = { $regex: search, $options: `i` }
        }

        const appointments = await Appointment.find(query).sort(sort === 'date' ? 'date' : '_id')

        return res.status(200).json({ Appointment: appointments })
    } catch (error) {
        return res.status(400).json({ msg: "internal server error" })
    }
})

router.post("/appointments", middeleware, async (req, res) => {
    try {
        const { userId } = req
        const addAppointment = await Appointment.create({ ...req.body, creator: userId })

        return res.status(200).json({ msg: "Appointment Added", Appointment: addAppointment })
    } catch (error) {
        return res.status(400).json({ msg: "Appoiintment not Added" })
    }
})

router.patch("/appointments/update/:id", middeleware, async (req, res) => {
    try {

        const checkAppointment = await Appointment.findById(req.params.id)
        // console.log(checkAppointment);

        if (!checkAppointment) {
            return res.status(400).json({ msg: "Appointment not found" })
        }

        if (checkAppointment.creator.toString() !== req.userId) {
            return res.status(400).json({ msg: "You do not have the permission for update the appointment" })
        }

        const updateAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })

        return res.status(200).json({ msg: "Appointment Updated", updateAppointment: updateAppointment })
    } catch (error) {
        return res.status(400).json({ msg: "Appointment not Updated" })
    }
})

router.delete("/appointments/delete/:id", middeleware, async (req, res) => {
    try {

        const checkAppointment = await Appointment.findById(req.params.id)
        // console.log(checkAppointment);

        if (!checkAppointment) {
            return res.status(400).json({ msg: "Appointment not found" })
        }

        if (checkAppointment.creator.toString() !== req.userId) {
            return res.status(400).json({ msg: "You do not have the permission for delete the appointment" })
        }

        const deleteAppointment = await Appointment.findByIdAndDelete(req.params.id, { new: true })

        return res.status(200).json({ msg: "Appointment Updated", deleteAppointment: deleteAppointment })
    } catch (error) {
        return res.status(400).json({ msg: "Appointment not Updated" })
    }
})

module.exports = router