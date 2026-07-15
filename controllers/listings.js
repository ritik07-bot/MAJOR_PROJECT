const Listing = require("../models/listing.js")

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm = async(req,res)=>{
    res.render("listings/new");
};

module.exports.showListing = async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show",{listing});
};

module.exports.createListing = async(req,res)=>{
   
   let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
    
};

module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing= async(req, res) => {

    let { id } = req.params;

    const editListing = req.body.listing;

    await Listing.findByIdAndUpdate(id, editListing);

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};