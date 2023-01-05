const express = require('express');
const router = express.Router()

//controllers
const {
    getBudgets,
    createBudget,
    upgradeBudget,
    removeBudget,
} = require('../controllers/budget')

//routes
router.route('/main')
    .get(getBudgets)
    .post(createBudget)
    .put(upgradeBudget)
    .delete(removeBudget)

module.exports = router