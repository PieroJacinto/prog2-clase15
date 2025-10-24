const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware')
const userController = require('../controllers/userController');
const validations = require('../middlewares/validations')
router.get('/',userController.index);

router.get('/:id', userController.show);

module.exports = router;