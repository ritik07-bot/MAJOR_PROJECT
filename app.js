const express = require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const initDB = require("./init/index.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");

const MONGO_URl="mongodb://127.0.0.1:27017/wanderlusts";

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URl);
} 
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi,i am root");
})

const validateListing=(req,res,next)=>{
let {error} = listingSchema.validate(req.body);
if(error){
    let errorMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errorMsg);
}else{
    next();
}
}

app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));

//new route
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new");
}));

//create new route
app.post("/listings",validateListing ,wrapAsync(async(req,res)=>{
   
   let newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
    
}));
//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));
//update route
app.put("/listings/:id",validateListing ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const editListing=req.body.listing;
    await Listing.findByIdAndUpdate(id,{...editListing});

    res.redirect(`/listings/${id}`);
}));

//Delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing});
}));
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found! ") )
})
app.use((err, req, res, next) => {
    console.error(err);   // Terminal me original error print hoga
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})