const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username,email,password} = req.body;

    const newUser = new User({
        username:username,
        email:email,
    })
    const registerUser= await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
           return next(err); 
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    });
    
}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}));

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login", saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","your are logged out!");
        res.redirect("/listings");
    })
})

module.exports = router;