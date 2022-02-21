const express = require('express')
const router = express.Router()

const search = require('../controllers/search')

router.route('/').get(search)

module.exports = router