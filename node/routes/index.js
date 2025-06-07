const express = require('express');
const router = express.Router();
const { filter_data, university_data } = require('../controllers/filter');

router.get('/', filter_data);
router.get('/universities', university_data);
router.get('/universities/:category/:slug', university_data);


module.exports = router;