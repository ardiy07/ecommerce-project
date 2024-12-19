const env = require("../config/env");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, {
        expiresIn: "15m",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET_REFRESH, {
        expiresIn: "7d",
    });
};

const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, env.JWT_SECRET_REFRESH);
};

const getExperiedAt = () => {
    const now = new Date();
    const experiedAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return experiedAt;
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    getExperiedAt
}