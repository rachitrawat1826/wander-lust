const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../util/wrapasync.js");
const { saveRedirectUrl } = require("../middleware.js");

// register user

module.exports.rendersignup = (req, res) => {
    res.render("signup");
};

module.exports.signup = async(req, res) => {
    console.log("fiii")
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "welcome to the site!");

        })
        res.redirect("/listings");
    } catch (error) {
        console.log("Signup Error:", error);
        res.status(500).send("Error signing up user.");
    }

}
module.exports.renderlogin = (req, res) => {
    res.render("login");
}
module.exports.login = async(req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
}
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");
    });
}