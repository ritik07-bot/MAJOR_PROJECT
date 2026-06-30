const express = require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");

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

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.get("/",(req,res)=>{
    res.send("Hi,i am root");
})

// app.get("/testListing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// })
//Index route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
})

//new route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new");
})

//create new route
app.post("/listings",async(req,res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
})
//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
})
//update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const editListing=req.body.listing;
    await Listing.findByIdAndUpdate(id,{...editListing});

    res.redirect(`/listings/${id}`);
})

//Delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing});
})


app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})