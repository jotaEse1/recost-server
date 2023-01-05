const { verify, sign } = require('jsonwebtoken');
const { hash, compare, genSalt } = require('bcryptjs') 
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, 'server', '.env')})
//token senders
const {sendAccessToken, sendRefreshToken} = require('../helper/tokenHelper')
//models from db
const {User, PriceList} = require('../db')

//controllers
const signIn = async (req, res) => {
    let errors = validationResult(req),
        {username, password, email} = req.body;
       
    //checking for errors in email and password
    if(!errors.isEmpty()) return res.json({success: false, response: errors.array()[0].msg, type: 'signin'})

    try {
        //check if the user exists
        const find = await User.find({email})
        if(find.length) return res.json({success: false, response: 'El usuario ya existe', type: 'signin'})
    
        //hash password
        const salt = await genSalt()
        password = await hash(password, salt)

        //new user
        const newUser = new User({username, email, password, token: ''})
        await newUser.save()

        //create a price list JUST for this user
        const newList = new PriceList({idUser: newUser['_id'], lastupdate: Date.now() ,list: [{}]})
        await newList.save()

        res.status(201).json({success: true, response: 'Usuario creado', _id: newUser['_id'], type: 'signin'})
    } 
    catch {
        res.status(500).json({success: false, response: 'Ocurrió un error. Intente mas tarde', type: 'signin'});
    }
}

const logIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        //find user and compare hash password
        const user = await User.find({email})
        if(!user.length) return res.send({success: false, response: 'Email o contraseña incorrectos', type: 'login'})
    
        const {password: hashPassword, _id, username} = user[0]
            verified = await compare(password, hashPassword) 
        if(!verified) return res.send({success: false, response: 'Email o contraseña incorrectos', type: 'login'})
    
        //create access and refresh tokens
        const accessToken = sign({_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}),
            refreshToken = sign({_id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
        
        //save refreshToken in database 
        await User.updateOne({_id}, {$set: {'token': refreshToken}})
    
        //send tokens
        sendRefreshToken(res, refreshToken)
        sendAccessToken(res, _id, accessToken, 'login', username)
        
    } 
    catch {
        res.status(500).json({success: false, response: 'Ocurrió un error. Intente mas tarde.', type: 'login'});
    }
}

const checkToken = async (req, res) => {
    const token = req.cookies.refreshtoken
  
    //validate if token exists
    if(!token) return res.json({success: false, token: '', type: 'refresh'})

    //verify token
    let payload;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch {
        return res.json({success: false, token: '', type: 'refresh'})
    }

    //validate user
    const user = await User.find({'_id': payload['_id']}),
        {_id, token: dbToken} = user[0];

    if(!user) return res.json({success: false, token: '', type: 'refresh'})
    if(dbToken !== token) return res.json({success: false, token: '', type: 'refresh'})

    //create access and refresh tokens
    const accessToken = sign({_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}),
        refreshToken = sign({_id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

    //save refreshToken in database 
    await User.updateOne({_id}, {$set: {'token': refreshToken}})

    //send tokens
    sendRefreshToken(res, refreshToken)
    res.json({success: true, token: accessToken, type: 'refresh', _id})
}

const logOut = async (req, res) => {
    const token = req.cookies.refreshtoken;

    if(!token) return res.json({success: false, response: '', type: 'logout'})

    //find user, I need the _id
    let payload;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return res.json({success: false, response: 'Ocurrió un error. Intente mas tarde.', type: 'logout' })
    }

    //delete token in db
    await User.updateOne({'_id': payload['_id']}, {$set: {'token': ''}})

    //delete cookie
    res.clearCookie('refreshtoken')
    return res.json({success: true, response: 'Hasta pronto!', type: 'logout'})
}


module.exports = {
    signIn,
    logIn,
    checkToken,
    logOut
}



