
const express = require('express');
const product_controller = require('../controllers/product.controller');

const {
    validateProduct,
    validateUpdateProduct
} = require('../validators/product.validator');

const { validate } =
    require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', product_controller.getAll);
router.get('/:id', product_controller.getById);
router.post('/', validateProduct, validate, product_controller.create);
router.put('/:id', validateUpdateProduct, validate, product_controller.update);
router.delete('/:id', product_controller.remove);

module.exports = router;

