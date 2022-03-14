'user strict';
const {Sequelize, DataTypes} = require ('sequelize');
const users = require('./user-model');
require('dotenv').config;

// if we are testing use sqlite, else we will use our database from the .env file
const DATABASE_URL =
  process.env.NODE_ENV == "test" ? "sqlite:memory" : process.env.DATABASE_URL;

  //add SSL if we are in production, else no options are needed
let sequelizeOptions =
  process.env.NODE_ENV === "production"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

    //initialize the sequelize database
    const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

    //export the db and the Users model.
    module.exports= {
        db: sequelize,
        Users: users(sequelize,DataTypes),
    }