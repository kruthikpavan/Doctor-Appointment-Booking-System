const doctors= require("./doctors");
const users = require("./users");
const reviews  = require("./reviews");
const path = require('path');

const constructorMethod = app => {
    app.get("/",(req,res)=>{
        res.sendFile(path.resolve('static/homepage.html'));
    })
    app.use("/doctors", doctors);
    app.use("/users", users);
    app.use("/reviews", reviews); 


    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not found' });  
    }); 
  };
  
  module.exports = constructorMethod;