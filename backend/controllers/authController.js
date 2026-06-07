const bcrypt = require('bcryptjs');
const { getUserByEmail, createUser } = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        console.log("OTRZYMANE DANE Z KLIENTA:", req.body);
        const email = rawEmail?.toLowerCase().trim();
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required."
            });
        }

        const users = await getUserByEmail(email);
        if (users.length > 0) {
            return res.status(400).json({
                message: "User with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(email, hashedPassword);
        return res.status(201).json({
            message: 'Registration succesful.'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
        });

    }
};

module.exports = { register };