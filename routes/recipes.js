const express = require('express');
const router = express.Router()

//controllers
const {
    getRecipes,
    createRecipe,
    upgradeRecipe,
    removeRecipe
} = require('../controllers/recipes')

//routes
router.route('/main')
    .get(getRecipes)
    .post(createRecipe)
    .put(upgradeRecipe)
    .delete(removeRecipe)

module.exports = router