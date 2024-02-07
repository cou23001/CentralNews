const express = require('express');
const { getNews } = require('../controllers/newsController');

const router = express.Router();

router.get('/api/news', getNews);

module.exports = router;
