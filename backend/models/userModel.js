const db = require('../config/db');

const getUserByEmail = async (email) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows;
};

const createUser = async (email, hashedPassword) => {
    await db.execute(
        'INSERT INTO users (email, password) VALUES(?, ?)',
        [email, hashedPassword]
    );
}

module.exports = {
    getUserByEmail,
    createUser
};