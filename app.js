const express = require("express");
const app=express();
const mongoose= require("mongoose");
// const initDB = require("./init/index.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found! ") )
// })
app.all("*", (req, res, next) => {
    console.log("404 Route:", req.method, req.originalUrl);
    next(new ExpressError(404, "Page not found!"));
});
app.use((err, req, res, next) => {
    console.error(err);   // Terminal me original error print hoga
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})