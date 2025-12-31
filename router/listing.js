const express = require('express');
const router = express.Router();
const wrapAsync = require("../util/wrapasync.js")
const ExpressError = require("../util/ErrorExpess.js")
const { listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner } = require("../middleware.js")
const controllers = require("../controllers/listing.js")
const multer = require("multer")
const { storage } = require("../cloudConfig.js")
const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB
});



const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error.details.map(el => el.message).join(","), 400)
    } else {
        next();
    }
}

// index route
router.get("/", wrapAsync(controllers.index));

// new route
router.get("/new", isLoggedIn, controllers.renderNewForm);
// show route

router.get("/:id", wrapAsync(controllers.showListing));

/// create
router.post(
    "/", isLoggedIn,
    upload.single("image"), validateListing,
    wrapAsync(controllers.createListing)
);



// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(controllers.renderEditForm));
// update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(controllers.updateListing));

// delete route

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(controllers.deleteListing));

module.exports = router;