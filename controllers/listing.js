const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const allListing= await Listing.find({})
    res.render("listings/index.ejs",{ allListing });
}

module.exports.newForm=async(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you are requested for doesnot exist" );
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
      
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing); 
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry= response.body.features[0].geometry;

    let savedListing=await newListing.save();  
    console.log(savedListing);
    
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are requested for doesnot exist" );
         res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_400")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}
module.exports.update = async(req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(list);
    if(typeof req.file!="undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = {url,filename};
       await list.save();
    }
    req.flash('success',"Post has been successfully updated");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully")
    res.redirect("/listings");
}