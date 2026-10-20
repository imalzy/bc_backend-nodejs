
const express = require('express');
const category_controller = require('../controllers/category.controller');

const {
    validateCategory,
    validateUpdateCategory
} = require('../validators/category.validator');

const { validate } =
    require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', category_controller.getAll);
router.get('/:id', category_controller.getById);
router.post('/', validateCategory, validate, category_controller.create);
router.put('/:id', validateUpdateCategory, validate, category_controller.update);
router.delete('/:id', category_controller.remove);

module.exports = router;
