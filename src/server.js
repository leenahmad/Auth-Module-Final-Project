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
app.post('/signup',signup)
app.post('/signin',basicAuth,signinHandler)
app.put('/user/:id',bearerAuth,acl('create'),updateUserHandler);
app.delete('/user/:id',bearerAuth,acl('delete'),deleteHandler);
app.get('/user',bearerAuth,acl('read'),getUserInfo)
app.get('/users',bearerAuth,acl('delete'),getAllUsersInfo)


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

async function signinHandler(req,res){
    res.status(201).send(req.user)
}

async function updateUserHandler(req,res){
    const reqBody = req.body;
    const id = req.params.id;
    await Users.update(reqBody,{where:{ id:id}});
    res.status(200).send(await Users.findOne({where:{id:id}}))
}

async function deleteHandler(req,res){
    const id = req.params.id;
    await Users.destroy({where:{id:id}})
    res.status(200).json({
        action: 'delete',
        userId: id,
        username: req.user.username,
    })
}

async function getUserInfo(req,res){
    res.status(200).send(req.user)
}
async function getAllUsersInfo(req,res){
    const usersInfo = await Users.findAll()
    res.status(200).send(usersInfo)
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