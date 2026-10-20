
const express = require('express');
const supplier_controller = require('../controllers/supplier.controller');
const {
  validateSupplier,
  validateUpdateSupplier
} = require('../validators/supplier.validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.get('/', supplier_controller.getAll);
router.get('/:id', supplier_controller.getById);

router.post(
  '/',
  validateSupplier,
  validate,
  supplier_controller.create
);

router.put(
  '/:id',
  validateUpdateSupplier,
  validate,
  supplier_controller.update
);

router.delete('/:id', supplier_controller.remove);

module.exports = router;
