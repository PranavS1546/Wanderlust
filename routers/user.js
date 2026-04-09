const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controllers/users")
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signupUser))

router
    .route("/login")
    .get( userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}),userController.loginUser)


router.get("/logout",userController.logoutUser)


router.get("/forgot-password", userController.renderForgotPassForm);
router.post("/forgot-password",userController.forgotPass)

// 3. Show the "New Password" form
router.get("/reset/:token", userController.resetTokenShow);

// 4. Save the new password
router.post("/reset/:token", userController.resetTokenSave);

module.exports.renderResetForm = async (req, res) => {
    let { token } = req.params;
    // ... logic to find user by token ...
    res.render("users/reset.ejs", { token }); // Passing token here is vital!
};

module.exports=router;