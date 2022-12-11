const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

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

configRoutes(app);


app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

//Search bar from WebDevSimplified