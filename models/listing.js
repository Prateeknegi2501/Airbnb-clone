const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./reviews.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    set: (v) =>
      v === ""
        ? "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?cs=srgb&dl=dug-out-pool-hotel-pool-1134176.jpg&fm=jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    { 
      type: Schema.Types.ObjectId, 
      ref: "Review" }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id: {$in:Listing.reviews}})  
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
