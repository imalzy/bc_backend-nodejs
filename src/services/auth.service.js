
const connect = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        const error = new Error('Nama, email, dan password wajib diisi');
        error.status = 400;
        throw error;
    }

    if (typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string') {
        const error = new Error('Format input tidak valid');
        error.status = 400;
        throw error;
    }

    if (password.length < 8) {
        const error = new Error('Password minimal 8 karakter');
        error.status = 400;
        throw error;
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (!name || name.length > 100) {
        const error = new Error('Nama wajib diisi dan maksimal 100 karakter');
        error.status = 400;
        throw error;
    }

    if (email.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const error = new Error('Format email tidak valid');
        error.status = 400;
        throw error;
    }

    const existingUsers = await connect.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existingUsers.length > 0) {
        const error = new Error('Email sudah terdaftar');
        error.status = 409;
        throw error;
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 12);

    await connect.query(
        `INSERT INTO users (id, name, email, password)
         VALUES (?, ?, ?, ?)`,
        [id, name, email, hashedPassword]
    );

    return {
        id,
        name,
        email
    };
};



const login = async ({ email, password }) => {
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        const error = new Error('Email dan password wajib diisi');
        error.status = 400;
        throw error;
    }

    email = email.trim().toLowerCase();

    const users = await connect.query(
        'SELECT id, name, email, password FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
        const error = new Error('Email atau password salah');
        error.status = 401;
        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        const error = new Error('Email atau password salah');
        error.status = 401;
        throw error;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET belum dikonfigurasi');
    }

    const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        {
            subject: String(user.id),
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            algorithm: 'HS256'
        }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
};


module.exports = {
    register,
    login
};
