'use strict';

require('dotenv').config();

const server = require('./src/server.js');
const {db} = require('./src/auth/model/index.js');

db.sync().then(() => {
    server.start(process.env.PORT || 3001)
})

.catch(console.error)

// server.start(process.env.PORT || 3001);