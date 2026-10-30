
const express = require('express');
const product_controller = require('../controllers/product.controller');
const upload = require('../middlewares/upload.middleware');

const {
    validateProduct,
    validateUpdateProduct
} = require('../validators/product.validator');

const { validate } =
    require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', product_controller.getAll);
router.get('/:id', product_controller.getById);
router.post('/', upload.array('images', 10), validateProduct, validate, product_controller.create);
router.put('/:id', upload.array('images', 10), validateUpdateProduct, validate, product_controller.update);
router.delete('/:id', product_controller.remove);

module.exports = router;

