'use strict';

const express = require('express');
const cors = require('cors')


const errorHandler = require('./errorHandlers/500.js');
const notFound = require('./errorHandlers/404.js');

const router = require('./routes.js')

const app = express();

app.use(express.json());

app.use(cors());

app.use(router);

//routes 
app.get('/' , home);

//function start

function home (req,res) {
    res.send('home route')
} 

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