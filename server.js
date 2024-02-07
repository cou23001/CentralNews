const express = require('express');
const { getNews } = require('./controllers/newsContoller');
const cors = require('cors');
const app = express();
const routes = require('./routes/index');
const axios = require('axios');

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', routes);

app.use(express.static('public'));

app.get('/api/news', getNews);


//const db = require('./models');

/*
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });
  */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});