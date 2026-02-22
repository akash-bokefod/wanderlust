const express=require("express");
const router=express.Router();
const user=require("../models/user");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controller/user");

router
.route("/signup")
.get(userController.renderSignUpFrom)
.post(wrapAsync(userController.signUpUser))

router
.route("/login")
.get(userController.renderLoginFrom)
.post(
    saveRedirectUrl,
    passport.authenticate(
        "local",{
        failureRedirect: '/login',
        failureFlash:true}
    ),
    userController.loginUser
)

//logout User route
router.get("/logout",userController.logoutUser)


module.exports=router;