const sendRefreshToken = (res, token) => {
    res.cookie('refreshtoken', token, {httpOnly: true})
}

const sendAccessToken = (res, _id, token, type, username) => {
    res.json({success: true, token, _id, type, response: `Hola de nuevo ${username}!`})
}

module.exports = {sendAccessToken, sendRefreshToken}