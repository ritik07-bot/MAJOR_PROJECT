const User=require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup");
};

module.exports.signup = async(req,res)=>{
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
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","your are logged out!");
        res.redirect("/listings");
    })
};