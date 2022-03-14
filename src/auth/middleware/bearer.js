'use strict';

const  {Users}  = require("../model/index");


module.exports = (Users) =>async (req,res,next)=>{
    if(req.headers['authorization']) {
        // 'Bearer token'
        let bearerHeaderParts= req.headers.authorization.split(' ');
        console.log('bearerHeaderParts > ',bearerHeaderParts); 
        let token = bearerHeaderParts.pop(); 
        console.log('Token >>> ',token);
       
        Users.validateToken(token).then(user=>{
            req.user = user;
            next();
        }).catch(error=>next(`invalid user ${error}`));
    }
}

// module.exports = UserModel;/