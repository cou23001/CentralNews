const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index');
const session = require('express-session');
const bodyParser = require('body-parser');


//const db = require('./models');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});