const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../util/wrapasync.js")
const ExpressError = require("../util/ErrorExpess.js")
const { reviewSchema } = require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isReviewAuthor } = require("../middleware.js")


module.exports.postReview = async(req, res) => {
    const { id } = req.params
    const listing = await Listing.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    console.log(review)
    listing.reviews.push(review)
    await review.save()
    await listing.save()
    req.flash("success", "successfully made a review")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "successfully deleted the review")
    res.redirect(`/listings/${id}`)
}