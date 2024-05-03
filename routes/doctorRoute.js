const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointments = require('../models/appointmentModel');
const User = require("../models/userModel");

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: req.body.email });
        res.status(200).send({success: true, message: 'Інформація про лікаря успішно завантажена', data: doctor})
    } catch (error) {
        res.status(500).send({ success: false, message: "Помилка у отриманні інформації про лікаря", error })
    }
})

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId });
        res.status(200).send({success: true, message: 'Інформація про лікаря успішно завантажена', data: doctor})
    } catch (error) {
        res.status(500).send({ success: false, message: "Помилка у отриманні інформації про лікаря", error })
    }
})

router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findOneAndUpdate({ email: req.body.email }, req.body);
        res.status(200).send({success: true, message: 'Інформація про лікаря успішно оновлена', data: doctor})
    } catch (error) {
        res.status(500).send({ success: false, message: "Помилка у оновленні інформації про лікаря", error })
    }
})

router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const doctor = await Doctor.findOne({ email: user.email })
        const appointments = await Appointments.find({ doctorId: doctor._id })
        res.status(200).send({
            message: "Записи успішно отримані",
            success: true,
            data: appointments
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при отриманні записів",
            success: false,
            error
        })        
    }
})

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointments.findByIdAndUpdate(appointmentId, { status });
        const user = await User.findOne({ _id:  appointment.userId});
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "appointment-status-change",
            message: `Ваше бронювання було ${status}`,
            onClickPath: "/appointments"
        })
        await user.save();
        res.status(200).send({
            message: "Статус бронювання було успішно змінено",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при зміні статуса бронювання",
            success: false,
            error
        })        
    }
})

router.post("/get-appointment-info", authMiddleware, async (req, res) => {
    try {
        const appointmentInfo = await Appointments.find({ _id: req.body.appointmentId })
        res.status(200).send({
            message: "Інформація про записи успішно отримана",
            success: true,
            data: appointmentInfo
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при отриманні записів",
            success: false,
            error
        })        
    }
})

router.post("/save-response", authMiddleware, async (req, res) => {
    try {
        const { doctorResponse, currentAppointment } = req.body;
        const appointment = await Appointments.findByIdAndUpdate(currentAppointment._id, { doctorResponse });
        const user = await User.findOne({ _id:  appointment.userId});
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "response-added",
            message: 'Вам надіслали результат вашого огляду',
            onClickPath: "/appointments"
        })
        await user.save();
        res.status(200).send({
            message: "Зміни були успішно збережені",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при внесенні змін",
            success: false,
            error
        })        
    }
})

router.post("/save-prescriptions", authMiddleware, async (req, res) => {
    try {
        const { correctPrescriptions, currentAppointmentId } = req.body;
        await Appointments.findByIdAndUpdate(currentAppointmentId, { "doctorResponse.prescriptions": correctPrescriptions });
        res.status(200).send({
            message: "Рецепти успішно виписані",
            success: true
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при внесенні змін",
            success: false,
            error
        }) 
    }
})

module.exports = router;