const doctors= require("./doctors");
const users = require("./users");
const reviews  = require("./reviews");
const home = require('./home');

const path = require('path');

const constructorMethod = app => {
    app.use("/doctors", doctors);
    app.use("/users", users);
    app.use("/reviews", reviews); 
    app.use("/", home); 
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not found' });  
    }); 
  };
  
  module.exports = constructorMethod;