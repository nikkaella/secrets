
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const Schema = mongoose.Schema;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    ecryptedFields: ['password']
});


const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const userName = req.body.username;
        const password = req.body.password;

        User.findOne({
            email: userName,
        }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    if (foundUser.password === password) {
                        res.render("secrets");
                    }
                }
            };
        });
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });

app.listen(3000, function () {
    console.log("server started on port 3000.");
});