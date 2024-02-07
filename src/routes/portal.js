const express = require('express');
const router = express.Router();

const users = require('../../controllers/portal');

router.get('/', users.getAll);

module.exports = router;