const { body } = require('express-validator')

module.exports= {
    signinValidator: [
        body('email', 'Ingrese un mail válido').isEmail(), 
        body('password', 'Contraseña muy corta').isLength({min: 8}), 
        body('username', 'Nombre de usuario muy corto').isLength({min: 5})],
    loginValidator: [
        body('email', 'Ingrese un mail válido').isEmail(), 
        body('password', 'Contraseña muy corta').isLength({min: 8})]
} 