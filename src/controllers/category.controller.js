
const category_services = require('../services/category.service');
const { successResponse } = require('../utils/response.util');

async function getAll(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;

        const categories = await category_services.findAll(
            page,
            limit
        );

        return successResponse(
            res,
            'Categories retrieved successfully',
            categories
        );
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const category = await category_services.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return successResponse(res, 'Category retrieved successfully', category);
    } catch (error) {
        next(error);
    }
}

async function create(req, res, next) {
    try {
        const payload = {
            name: req.body.name,
            description: req.body.description
        };

        const category = await category_services.create(payload);

        return successResponse(
            res,
            'Category created successfully',
            category,
            201
        );
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const category = await category_services.update(
            req.params.id,
            req.body
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return successResponse(res, 'Category updated successfully', category);
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const deleted = await category_services.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return successResponse(res, 'Category deleted successfully', {
            deleted
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
