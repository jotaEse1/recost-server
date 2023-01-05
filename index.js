const express = require('express');
const app = express()
const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '/.env')})
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//port
const port = process.env.PORT || 8000

//connection database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to database'))
    .catch(err => {
        console.log("error in db")
        console.log(err)
    })

//routes
const priceList = require('./routes/priceList'),
    budget = require('./routes/budget'),
    recipes = require('./routes/recipes'),
    auth = require('./routes/auth')

//middlewares
app.use(cors({
    origin: 'https://jotaese1.github.io',  
    credentials: true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/priceList', priceList)
app.use('/api/v1/budget', budget)
app.use('/api/v1/recipes', recipes)
app.use('/api/authentication', auth);
app.get("/", (req, res) => res.send("<h1>Welcome to Recost app</h1>"))
app.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1> <p>Page not found<p>`)
})
app.listen(port, (req, res) => console.log(`Server is running on port ${port}...`))