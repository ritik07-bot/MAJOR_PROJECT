const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const { populate } = require("../models/review.js");

//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));

//new route
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    res.render("listings/new");
}));

//create new route
router.post("/",isLoggedIn,validateListing ,wrapAsync(async(req,res)=>{
   
   let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
    
}));
//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));
//update route
router.put(
  "/:id",
  isLoggedIn,isOwner,
  validateListing,
  wrapAsync(async (req, res) => {

    let { id } = req.params;

    const editListing = req.body.listing;

    await Listing.findByIdAndUpdate(id, editListing);

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}));
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show",{listing});
}));

module.exports = router;