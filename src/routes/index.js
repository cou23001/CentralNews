const routes = require('express').Router();
const { getNews } = require('../controllers/newsController');


routes.get('/', (req,res) => {
    //#swagger.tags=['Hello World']
    res.send("Hello World!");
});

routes.get('/news', getNews);

routes.get('/portal', getNews);

module.exports = routes; 