require("dotenv").config();

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodeOverride = require("method-override")
const ejsMate = require("ejs-mate")

const ExpressError = require("./util/ErrorExpess.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")
const listings = require("./router/listing.js")
const reviews = require("./router/review.js")
const user = require("./router/user.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const mongo_url = "mongodb://127.0.0.1:27017/wander";


// cookie
const sessionOption = {
        secret: "this   isasecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
    // cookie end



// connect to database
// main().then(() => {
//     console.log("connect to db")
// }).catch((err) => {
//     console.log(err)
// })

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wander");
// }
const dbUrl = process.env.ATLASDB;

main()
    .then(() => {
        console.log("Connected to MongoDB Atlas ✅");
    })
    .catch((err) => {
        console.log("MongoDB connection error ❌", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

//  connect to database end

// middleware
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodeOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

// middleware end





//  passport config
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport config end



// flash middleware
app.use((req, res, next) => {
        res.locals.success = req.flash("success")
        res.locals.error = req.flash("error")
        res.locals.currentUser = req.user
        next()
    })
    // flash middleware end

app.get("/", (req, res) => {
        res.render("home")
    })
    // routes
app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)
app.use("/", user)
    // routes end



// 🔥 MULTER ERROR HANDLER (PASTE HERE)
app.use((err, req, res, next) => {
    if (err.name === "MulterError") {
        req.flash("error", err.message);
        return res.redirect("back");
    }
    next(err);
});

// 404 handler
app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404));
});

// general error handler (ALWAYS LAST)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});
app.listen(3000, () => {
    console.log("server is working is on port in 3000")
})