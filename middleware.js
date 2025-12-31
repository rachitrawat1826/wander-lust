const Listing = require("./models/listing.js")
const Review = require("./models/review.js")


module.exports.isLoggedIn = (req, res, next) => {
    console.log("[middleware] isLoggedIn called, req.user:", req.user);

    if (!req.isAuthenticated()) {
        console.log("[middleware] BLOCKED → redirecting to /login");
        req.flash("error", "You must be logged in");
        return res.redirect("/login"); // ✅ VERY IMPORTANT
    }

    console.log("[middleware] PASSED");
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        console.log("hiiiii")
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}


module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};