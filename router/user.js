const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../util/wrapasync.js");
const { saveRedirectUrl } = require("../middleware.js");
const constrollers = require("../controllers/user.js");

router.get("/signup", constrollers.rendersignup);


router.post("/signup", wrapAsync(constrollers.signup));

router.get("/login", (constrollers.renderlogin));

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), constrollers.login);

router.get("/logout", constrollers.logout);


module.exports = router