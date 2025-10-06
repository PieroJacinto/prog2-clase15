const express = require('express');
const router = express.Router();
const homeController = require("../controllers/HomeController")

router.get('/', homeController.index )
router.get('/about', homeController.about )
router.get('/contacto', homeController.contacto )

module.exports = router; 