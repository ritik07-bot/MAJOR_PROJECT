const express = require("express");
const app=express();
const mongoose= require("mongoose");
// const initDB = require("./init/index.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session=require("express-session");
const flash =require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const { appendFile } = require("fs/promises");

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
app.use(cookieParser("secretcode"));

const sessionOptions = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        exprires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.get("/",(req,res)=>{
    console.log(req.cookies);
    res.send("Hi,i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// app.get("/signedCookies",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("check cookies");
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });
// app.get("/getCookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.send("give some cookies");
// });
// app.get("/greet",(req,res)=>{
//     let {name="anynomous"} = req.cookies;
//     res.send(`hii ${name}`);
// });

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