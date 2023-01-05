//actions from db
const {
    findBudget,
    newBudget,
    updateBudget,
    deleteBudget
} = require('../db')

//controllers
const createBudget = (req, res) => {
    const data = req.body;

    newBudget(data)
        .then(data => res.json({success: true, response: data, type: 'new'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const getBudgets = (req, res) => {
    const {idUser} = req.query

    findBudget(idUser)
        .then(data => res.json({success: true, response: data, type: 'read'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const upgradeBudget = (req, res) => {
    const data = req.body
    
    updateBudget(data)
        .then(data => res.json({success: true, response: data, type: 'update'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const removeBudget = (req, res) => {
    const data = req.body;

    deleteBudget(data)
        .then(data => res.json({success: true, response: data, type: 'delete'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

module.exports = {
    getBudgets,
    createBudget,
    upgradeBudget,
    removeBudget
}

