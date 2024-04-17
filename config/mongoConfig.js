const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;
connection.on("connected", () => console.log("База даних піключена"));
connection.on("error", () => console.log("Помилка у підключенні до бази даних"));

module.exports = mongoose;