const crypto = require('crypto');
require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.login = async (req, res) => {
    try {
        const User = global.User;
        if (!User) {
            return res.status(500).json({ message: "Database not initialized" });
        }
        
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password) {
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: "Incorrect password" });
            }

            const token = jwt.sign({ email }, process.env.LOGIN_SECRET_KEY, { expiresIn: "1h" });
            return res.json({ message: "Login successful", token, userID: user.id });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};