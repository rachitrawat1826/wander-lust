const express = require('express');
const router = express.Router();
const wrapAsync = require("../util/wrapasync.js")
const ExpressError = require("../util/ErrorExpess.js")
const { listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner } = require("../middleware.js")
const controllers = require("../controllers/listing.js")



module.exports.index = async(req, res, next) => {
    try {
        const listings = await Promise.race([
            Listing.find({}),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("DB timeout")), 5000)
            )
        ]);

        res.render("index", { listings });
    } catch (err) {
        console.error("Index load failed:", err.message);
        req.flash("error", "Listings are loading slowly. Please refresh.");
        res.render("index", { listings: [] });
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render("new")
}
module.exports.showListing = async(req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing")
        return res.redirect("/listings")
    }
    console.log(listing)
    res.render("show", { listing })
}

// module.exports.createListing = async(req, res) => {
//     let url = req.file.path
//     let filename = req.file.filename


//     const doc = new Listing(listing);

//     doc.owner = req.user._id;
//     // doc.image = { url: url, filename: filename }

//     console.log(doc.owner)

//     await doc.save();
//     req.flash("success", "successfully made a new listing")
//     res.redirect(`/listings`);
// }
module.exports.createListing = async(req, res) => {
    const listing = new Listing(req.body.listing);

    // ✅ save Cloudinary image
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    listing.owner = req.user._id;

    await listing.save();

    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
};


module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("edit", { listing })

}

module.exports.updateListing = async(req, res) => {
    const { id } = req.params;
    const payload = {...req.body.listing };
    const listing = await Listing.findById(id);

    if (payload.image && (!payload.image.url || payload.image.url.trim() === "")) {
        delete payload.image;
    }

    await Listing.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    req.flash("success", "listing successfully updated");
    res.redirect("/listings");
};


module.exports.deleteListing = async(req, res) => {
    let { id } = req.params
    const deletedLinsting = await Listing.findByIdAndDelete(id)
    console.log(deletedLinsting)
    req.flash("success", "successfully deleted the listing")
    res.redirect("/listings")
}