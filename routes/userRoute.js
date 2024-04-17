const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel")
const Appointment = require("../models/appointmentModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const moment = require("moment");

router.post('/register', async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(200).send({ success: false, message: "Користувач з такою поштою вже існує" })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(password, salt);
        req.body.password = encryptPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).send({ success: true, message: "Користувач успішно створений" })
    } catch (error) {
        return res.status(500).send({ success: false, message: "Помилка при створенні користувача", error })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ success: false, message: "Користувача з такою поштою не існує" })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ success: false, message: "Пароль невірний" })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "6h" });
            res.status(200).send({ success: true, data: token, message: "Вхід виконано успішно" })
        }
    } catch (error) {
        res.status(500).send({ success: false, error, message: "Помилка при авторизації" })
    }
})

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({success: false, message: 'Користувача не існує'})
        } else {
            res.status(200).send({ success: true, data: {...user._doc, password: ''} })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Помилка у отриманні інформації про користувача", error })
    }
})

router.post("/mark-all-notifications-as-seen", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;
        const updateUser = await user.save();
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Усі повідомлення позначені як прочитані",
            data: updateUser
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при спробі позначити усі повідомлення, як прочитані",
            success: false,
            error
        })        
    }
})

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updateUser = await user.save();
        updateUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Усі повідомлення видалені",
            data: updateUser
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при спробі видалити повідомлення",
            success: false,
            error
        })        
    }
})

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({
            message: "Інформація про лікарів була успішно завантажена",
            success: true,
            data: doctors
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при спробі завантажити інформацію про лікарів",
            success: false,
            error
        })        
    }
})

router.post("/book-appointment", authMiddleware, async (req, res) => {
    try {
        req.body.status = "Очікує";
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        const user = await User.findOne({ email: req.body.doctorInfo.email });
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `Створено новий запит на прийом від ${req.body.userInfo.name}`,
            onClickPath: '/doctor/appointments'
        });
        await user.save();
        res.status(200).send({
            message: "Бронювання пройшло успішно",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при бронюванні",
            success: false,
            error
        })        
    }
})

router.post("/get-booked-appointment-by-date", authMiddleware, async (req, res) => {
    try {
        const newDate = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const appointment = await Appointment.find({ date: newDate, doctorId: req.body.doctorId });
        res.status(200).send({
            message: "Вільні місця отримані",
            success: true,
            data: appointment
        })
    } catch (error) {
        res.status(500).send({
            message: "Помилка при отриманні місць",
            success: false,
            error
        })        
    }
})

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.body.userId })
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
module.exports = router;