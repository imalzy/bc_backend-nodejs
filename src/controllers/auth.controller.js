
const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'Register berhasil',
            data: user
        });
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: result
        });
    } catch (error) {
        next(error);
    }
};


const me = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token valid',
        data: req.user
    });
};



module.exports = {
    register,
    login,
    me
};
