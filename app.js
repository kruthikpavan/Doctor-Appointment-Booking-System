const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const mongoCollections= require('./config/mongoCollections')
// const mongoCollections= require('../Doctor-Appointment-Booking-System/config/mongoCollections')
const data = require("./data");
const userData = data.users;
const doctorData= data.doctors
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string',
        resave: false,
        saveUninitialized: true
    })
);

var indexRouter = require('./routes/index');
var nlpRouter = require('./routes/nlp');

app.use('/analyser', indexRouter);
app.use('/api/nlp', nlpRouter);
app.get("/doctordetails", async (req, res) => {

    let doctors = await doctorData.getAllDoctorDetails()
    res.send(doctors);
  });
  

configRoutes(app);


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

//Search bar from WebDevSimplified