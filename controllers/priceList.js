//actions from db
const {
    findItem,
    addItem,
    updateList,
    deleteItem
} = require('../db')

//controllers
const getItems = (req, res) => {
    const {idUser} = req.query

    findItem(idUser)
        .then(data => res.json({success: true, response: data, type: 'read'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const appendItem = (req, res) => {
    const data = req.body

    addItem(data)
        .then(data => res.json({success: true, response: data, type: 'new'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const upgradeList = (req, res) => {
    const data = req.body;

    updateList(data)
        .then(data => res.json({success: true, response: data, type: 'update'}))
        .catch(err => res.status(500).json({success: false, response: err}))
}

const removeItem = (req, res) => {
    const data = req.body;

    deleteItem(data)
        .then(data => res.json({success: true, response: data.result, type: 'delete', list: data.list}))
        .catch(err => res.status(500).json({success: false, response: err}))
}


module.exports = {
    getItems,
    appendItem,
    upgradeList,
    removeItem
}