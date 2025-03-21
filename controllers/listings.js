const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.newForm = async (req, res) => {
  res.render("listings/new.ejs");
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
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
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
    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Successfully Updated");
    req.flash("failure", "Something went wrong");
    res.redirect("/listings");
  } catch (error) {
    req.flash("failure","Something went Wrong")
    res.redirect("/listings")
  }
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Successfully");
  req.flash("failure", "Something went wrong");
  res.redirect("/listings");
};
