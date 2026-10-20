const user_services = require('../services/user.service');
const { successResponse } = require('../utils/response.util');

async function getAll(req, res, next) {
    try {
        const users = await user_services.findAll();

        res.status(200).json({
            message: 'Success',
            data: users
        })
    } catch (error) {
        next(error)
    }
}

async function create(req, res, next) {
    try {
        const payload = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        const user = await user_services.create(payload);
        return successResponse(res, 'User created successfully', user, 201);
    } catch (error) {
        next(error)
    }
}

async function update(req, res, next){
    const paramsId = req.params.id;

    try {
        const user = await user_services.update(paramsId, req.body);
        return successResponse(res, 'User updated successfully', user, 200);
    } catch (error) {
        next(error)
    }
}

async function remove(req, res, next){
    const paramsId = req.params.id;

    const deleted = await user_services.remove(paramsId);
    return successResponse(res, 'User deleted successfully', deleted, 200);
}
module.exports = {
    getAll, create, update, remove
}