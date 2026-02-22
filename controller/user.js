const user=require("../models/user");

module.exports.renderSignUpFrom=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUpUser=async(req,res,next)=>{
    try {
        const {email,username,password}=req.body;
        const newUser=new user({
        email:email,
        username:username 
        })
        const registerUser=await user.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to Wanderlust");
            res.redirect("listings");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginFrom=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.loginUser=(req,res)=>{
        req.flash("success","welcome to Wanderlast");
        let redirect=res.locals.redirectUrl || "/listings";
        res.redirect(redirect)
}

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out");
        res.redirect("/listings");
    })
}