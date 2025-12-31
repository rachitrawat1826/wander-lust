const mongoose = require("mongoose");
const { Schema } = mongoose;

const DEFAULT_IMG =
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60";

const ImageSchema = new Schema({
    url: {
        type: String,
        default: DEFAULT_IMG
    },
    filename: {
        type: String,
        default: "listingimage"
    }
});

const ListingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    country: String,
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: ImageSchema,
        default: () => ({})
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Listing", ListingSchema);