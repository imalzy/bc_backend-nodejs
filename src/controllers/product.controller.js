const product_services = require("../services/product.service");
const { successResponse } = require("../utils/response.util");

async function getAll(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category_id,
      supplier_id,
    } = req.query;

    const products = await product_services.findAll(
      page,
      limit,
      search,
      category_id,
      supplier_id,
    );

    return successResponse(res, "Products retrieved successfully", products);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const product = await product_services.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return successResponse(res, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {

    const payload = {
      code: req.body.code,
      name: req.body.name,
      category_id: req.body.category_id,
      supplier_id: req.body.supplier_id,
      price: req.body.price,
      stock: req.body.stock,
    };

    const images = (req.files || []).map((file) => {
      return {
        name: file.filename,
      }
    });
    const product = await product_services.create(payload, images);

    return successResponse(res, "Product created successfully", product, 201);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const product = await product_services.update(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return successResponse(res, "Product updated successfully", product);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await product_services.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return successResponse(res, "Product deleted successfully", {
      deleted,
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
  remove,
};
