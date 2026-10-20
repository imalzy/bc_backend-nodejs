const express = require('express');

const user_controller = require('../controllers/user.controller');

const { validateRegistration, validateUpdateProfile } = require('../validators/user.validator');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.get("/", user_controller.getAll);
router.post("/", validateRegistration, validate, user_controller.create);
router.put("/:id", validateUpdateProfile, validate, user_controller.update);
router.delete("/:id", user_controller.remove);

module.exports = router;