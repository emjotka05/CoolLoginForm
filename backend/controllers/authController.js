const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const login = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail.toLowerCase().trim();

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required."
            });
        }
        const users = await getUserByEmail(email);
        if (users.length === 0) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login succesful.',
            token: token
        });

    } catch (error) {
        console.error("🔥 BŁĄD KRYTYCZNY LOGOWANIA:", error);
        res.status(500).json({
            message: "Something went wrong."
        });

    }
}

module.exports = {
    register,
    login
};