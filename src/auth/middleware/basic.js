'use strict';

const {Users} = require('../model/index')

const base64 = require('base-64')


module.exports =  async (req , res, next) => {

    if(req.headers['authorization']){
        let basicHeaderPerts = req.headers.authorization.split(' ');

        let encodedPart = basicHeaderPerts.pop();

        let decodedPart = base64.decode(encodedPart);

        let [username,password] = decodedPart.split(':');

        Users.authenticate(username,password).then(validUser => {
            req.user = validUser;
            next();
        }).catch(error => next(`invalid user ${error}`));
    }
}