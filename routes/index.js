const routes = require('express').Router();
const { getNews } = require('../controllers/newsContoller');


routes.get('/', (req,res) => {
    //#swagger.tags=['Hello World']
    res.send("Hello World!");
});

routes.get('/news', getNews);

module.exports = routes; 