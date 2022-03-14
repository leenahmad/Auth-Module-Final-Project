"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;

//userModel
const userModel = (sequelize, DataTypes) => {
    //preparing users table schema
  const Users = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allownNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
    },
    //ACL roles
    role: {
      type: DataTypes.ENUM("admin", "writer" , "editor" ,"user"),
      defaultValue: "user",
    },
    //ACL Actions and Permissions
    actions: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ["read", "create", "update"],
          writer : ["read", "create"],
          editor : ["read", "create", "update"],
          admin: ["read", "create", "update", "delete"],
        };
        return acl[this.role];
      },
    },
  });

  //basic auth method
  Users.authenticate = async function (username, password) {
    try {
        // inquire the user data from database
      const user = await this.findOne({ where: { username: username } });
      // check if the password is correct
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
          //create a token with an expiration of 20 minutes
        let token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 1200,
            id: user.id,
          },
          SECRET
        );
        //add a property called tokens inside the user object
        user.token = token;
        return user;
      } else {
        throw new Error("token is invalid or expired: Please sign in again");
      }
    } catch (e) {
      throw new Error(`error: ${e}`);
    }
  };

  //Verify Bearer Token method
  Users.verifyBearerToken = async function (token) {
      //check if the user is valid for the same token
    let validUser = jwt.verify(token, SECRET);
    try {
      let user = await Users.findOne({ where: { id: validUser.id } });
      return user;
    } catch (e) {
      throw new Error(`error varifying the token: ${e}`);
    }
  };
  return Users;
};
module.exports = userModel;
