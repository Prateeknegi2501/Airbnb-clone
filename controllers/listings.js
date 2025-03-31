const Listing = require("../models/listing.js");
const mbxGeocoading = require("@mapbox/mapbox-sdk/services/geocoding");
const MapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoading({ accessToken: MapToken });

module.exports.index = async (req, res) => {
  const category = req.query.category;
  let allListing;
  if (category) {
    allListing = await Listing.find({ category: category });
  } else {
    allListing = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListing });
};

module.exports.newForm = async (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.search = async (req, res) => {
  const searchQuery = req.query.search || ""; // Default to empty string if no search term is provided

  // Find listings based on the search term
  const listings = await Listing.find({
    $or: [
      { title: { $regex: searchQuery, $options: "i" } },
      { category: { $regex: searchQuery, $options: "i" } },
      { country: { $regex: searchQuery, $options: "i" } },
      { location: { $regex: searchQuery, $options: "i" } },
    ],
  });

  if (!listings || listings.length===0) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  } else {
    res.render("listings/index", { allListing: listings });
  }
};
module.exports.showForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing Created");
  req.flash("failure", "Something went wrong");
  res.redirect("/listings");
};
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failure", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Successfully Updated");
    req.flash("failure", "Something went wrong");
    res.redirect("/listings");
  } catch (error) {
    req.flash("failure", "Something went Wrong");
    res.redirect("/listings");
  }
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Successfully");
  req.flash("failure", "Something went wrong");
  res.redirect("/listings");
};
