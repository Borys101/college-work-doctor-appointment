const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        fatherName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        placeOfStudy: {
            type: String,
            required: true
        },
        days: {
            type: Array,
            required: true
        },
        startOfWork: {
            type: Object,
            required: true
        },
        endOfWork: {
            type: Object,
            required: true
        }
    }, {timestamps: true}
)

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;