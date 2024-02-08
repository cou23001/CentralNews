const path = require('path');
const router = require('express').Router();
const { getNews } = require('../controllers/newsController');

//routes.get('/', (req,res) => {
    //#swagger.tags=['Hello World']
    //res.send("Hello World!");
//});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

router.get('/news', getNews);

//routes.get('/portal', getNews);

module.exports = router; 