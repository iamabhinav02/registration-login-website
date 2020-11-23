var express = require('express');
var hbs = require("hbs");
require('./src/db/connection');
var Register = require('./src/models/model');
var bcrypt = require('bcryptjs');

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

app.post('/register', async function(req, res) {
    try {
        const pwd = req.body.password;
        const cpwd = req.body.confirmpassword;

        if (pwd === cpwd) {
            const user = new Register({
                firstname: req.body.firstName,
                lastname: req.body.lastName,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            });

            const registered = await user.save();
            res.render('index');

        } else {
            res.status(400).send('Passwords do not match');
        }
    } catch (error) {
        res.status(400).send('Cannot be registered!!')
    }
});

app.post('/login', async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email: email });
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.status(200).render('index');
        } else {
            res.status(404).send("Either Email or Password is incorrect.");
        }
    } catch (error) {
        res.status(400).send("Invalid login details.");
    }
});

app.listen(port, function() {
    console.log(`App running on port ${port}...`);
});