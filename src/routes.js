'use strict';

const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt')


const basicAuth = require('./auth/middleware/basic')
const bearerAuth = require('./auth/middleware/bearer')
const {Users} = require('./auth/model/index')
const acl = require('./auth/middleware/acl.js');

const router = express.Router();


//Routes
router.post('/signup',signup)
router.post('/signin',basicAuth,signinHandler)
router.put('/user',bearerAuth,acl('create'),userEditHandler)
router.put('/users/:id',bearerAuth,acl('delete'),updateUserHandler);
router.delete('/users/:id',bearerAuth,acl('delete'),deleteHandler);
router.get('/user',bearerAuth,acl('read'),getUserInfo)
router.get('/users',bearerAuth,acl('delete'),getAllUsersInfo)


//Functions
async function signup(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 5);
        const record = await Users.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(403).send(error);
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

async function userEditHandler(req,res){
   const reqBody=req.body;
   await Users.update(reqBody,{where:{id:req.user.id}})
   res.status(200).send(await Users.findOne({where:{id:req.user.id}}))
}
module.exports = router;