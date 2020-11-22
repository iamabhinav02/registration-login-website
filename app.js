var express = require('express');
var hbs = require("hbs");
require('./src/db/connection');
var Register = require('./src/models/model');

hbs.registerPartials("./partials");

var app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/register', function(req, res) {
    const pwd = req.body.password;
    const cpwd = req.body.confirmpassword;

    if (pwd === cpwd) {
        Register({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        }).save((err, data) => {
            if (err) {
                res.status(400).send('User cannot be registered!!!');
            } else {
                res.render('index');
            }
        });
    } else {
        res.status(400).send('Passwords do not match');
    }
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Register.findOne({ email: email }, function(err, data) {
        if (err) {
            res.status(400).send("Invalid login details.");
        } else {
            if (data.password === password) {
                res.status(200).render('index');
            } else {
                res.status(404).send("Either Email or Password is incorrect.");
            }
        }
    });
});

app.listen(port, function() {
    console.log(`App running on port ${port}...`);
});