const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../util/wrapasync.js")
const ExpressError = require("../util/ErrorExpess.js")
const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isReviewAuthor } = require("../middleware.js")

const constrollers = require("../controllers/review.js")

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(el => el.message).join(","), 400)
    } else {
        next();
    }
}


// post review
router.post("/", validateReview, wrapAsync(constrollers.postReview));

// delete review
router.delete("/:reviewId", isReviewAuthor, wrapAsync(constrollers.deleteReview));

module.exports = router;