'use strict';

const express = require('express');
const cors = require('cors')


const errorHandler = require('./errorHandlers/500.js');
const notFound = require('./errorHandlers/404.js');

const basicAuth = require('./auth/middleware/basic')
const bearerAuth = require('./auth/middleware/bearer')
const {Users} = require('./auth/model/index')

const app = express();

app.use(express.json());

app.use(cors());




//Routes
app.get('/' , home);



//Functions
function home (req,res) {
    res.send('home route')
}

async function signup(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 5);
        const record = await User.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(403).send("Error occurred");
    }
}



//function start
function start(port){
    
    app.listen(port, () =>{
        console.log(`running on port ${port}`)
    })
    } 

//error-handlers    
app.use(errorHandler);
app.use('*',notFound);



module.exports = {
    app: app,
    start: start,
}