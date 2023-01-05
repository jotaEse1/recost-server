//actions form db
const {
    findRecipes,
    newRecipe,
    updateRecipe,
    deleteRecipe
} = require('../db')

//controllers
const getRecipes = (req, res) => {
    const {idUser} = req.query

    findRecipes(idUser)
        .then(data => res.json({success: true, response: data, type: 'read'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const createRecipe = (req, res) => {
    const data = req.body;

    newRecipe(data)
        .then(data => res.json({success: true, response: data, type: 'new'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const upgradeRecipe = (req, res) => {
    const data = req.body

    updateRecipe(data)
        .then(data => res.json({success: true, response: data, type: 'update'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const removeRecipe = (req, res) => {
    const data = req.body;

    deleteRecipe(data)
        .then(data => res.json({success: true, response: data, type: 'delete'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}


module.exports ={
    getRecipes,
    createRecipe,
    upgradeRecipe,
    removeRecipe
}