const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload.middleware');

const file_controller = require('../controllers/file.controller');

router.get('/', file_controller.listFile);
router.post('/', upload.single("file"), file_controller.uploadFile);

module.exports = router;