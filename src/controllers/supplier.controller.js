
const supplier_service = require('../services/supplier.service');
const { successResponse } = require('../utils/response.util');

//pagenation
async function getAll(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;

        const supplierss = await supplier_services.findAll(
            page,
            limit
        );

        return successResponse(
            res,
            'Suplliers retrieved successfully',
            Suppliers
        );
    } catch (error) {
        next(error);
    }
}
const getById = async (req, res, next) => {
  try {
    const data = await supplier_service.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    return successResponse(res, 'Supplier edited successfully', data);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
   console.log("[log create supplier]",req)
    const data = await supplier_service.create(req.body);
    return res.status(201).json({
      message: 'Supplier created successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await supplier_service.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const data = await supplier_service.update(req.params.id, req.body);
    return successResponse(res, data, 'Supplier updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await supplier_service.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    return successResponse(res, null, 'Supplier deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
