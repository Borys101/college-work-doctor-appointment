const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ success: false, message: "Авторизація не пройшла" })
            } else {
                req.body.userId = decoded.id;
                next();
            }
        })
    } catch (error) {
        return res.status(401).send({success: false, message: "Аутентифікація не пройшла"})
    }
}