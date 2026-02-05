const mongoose = require("mongoose");
const initialisedata = require("./data.js");
const Listing = require("../models/listing.js"); // ✅ corrected
const mongo_url = "mongodb://127.0.0.1:27017/wander";

main()
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async() => {
    await Listing.deleteMany({});
    const listingsWithOwner = initialisedata.data.map((obj) => ({...obj, owner: "694a67f8d193d873de774b72x" }));
    await Listing.insertMany(listingsWithOwner);
    console.log("data is initialised");
};

initDB();