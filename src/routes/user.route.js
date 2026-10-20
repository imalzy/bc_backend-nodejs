const express = require('express');

const user_controller = require('../controllers/user.controller');
const {authLimit} = require("../middlewares/rate-limit.middleware");

const router = express.Router();

router.get("/", user_controller.getAll);
router.post("/", user_controller.create);
router.put("/", user_controller.update);
router.delete("/", user_controller.remove);
router.post("/login", authLimit, user_controller.login);

module.exports = router;