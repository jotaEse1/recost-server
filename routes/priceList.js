const express = require('express');
const router = express.Router()

//controllers
const {
    getItems,
    appendItem,
    upgradeList,
    removeItem
} = require('../controllers/priceList')

//routes
router.route('/main')
    .get(getItems)
    .post(appendItem)
    .put(upgradeList)
    .delete(removeItem)

module.exports = router