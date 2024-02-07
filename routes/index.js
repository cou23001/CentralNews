const routes = require('express').Router();

routes.get('/', (req,res) => {
    //#swagger.tags=['Hello World']
    res.send("Hello World!");
});

module.exports = routes; 