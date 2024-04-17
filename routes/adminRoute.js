const express =require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Appointment = require('../models/appointmentModel')

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        if (await Doctor.findOne({ email: req.body.email })) {
            res.status(200).send({ success: false, message: "Лікар вже існує" })
            return;
        } else {
            await newDoctor.save();
        }
        const filter = { email: req.body.email };
        const isDoctor = true;
        const user = await User.findOne(filter);
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "doctor-account-added",
            message: "Вам було надано роль 'Лікар'",

        })
        await User.findOneAndUpdate(filter, { isDoctor, unseenNotifications })
        res.status(200).send({ success: true, message: "Лікаря було успішно додано до системи", data: user })
    } catch (error) {
        res.status(500).send({ message: "Помилка у створенні лікаря", success: false, error })
    }
})

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({
            message: "Список усіх лікарів успішно завантажений",
            success: true,
            data: doctors
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при спробі завантажити усіх лікарів",
            success: false,
            error
        })        
    }
})

router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({
            message: "Список усіх користувачів успішно завантажений",
            success: true,
            data: users
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при спробі завантажити усіх користувачів",
            success: false,
            error
        })        
    }
})

router.post("/delete-user", authMiddleware, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.body.deleteUserId});
        await Doctor.deleteOne({ email: req.body.email});
        res.status(200).send({
            message: "Користувача було успішно видалено",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при видаленні користувача",
            success: false,
            error
        })
    }
})

router.post("/delete-doctor-access", authMiddleware, async (req, res) => {
    try {
        await User.findOneAndUpdate({ email: req.body.email }, { isDoctor: false })
        await Doctor.deleteOne({ _id: req.body.doctorId});
        await Appointment.deleteMany({ doctorId: req.body.doctorId });
        res.status(200).send({
            message: "Роль лікаря успішно видалено",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при видаленні ролі лікаря",
            success: false,
            error
        })
    }
})
module.exports = router;