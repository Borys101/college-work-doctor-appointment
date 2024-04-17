const express = require("express");
const app = express();
require('dotenv').config();
const mongoConfig = require("./config/mongoConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require('./routes/adminRoute');
const doctorRoute = require("./routes/doctorRoute");

app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Сервер завантажено на порті ${5000}`));