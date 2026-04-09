const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.renderSignupForm=(req, res)=>{
    res.render("users/signup.ejs")
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.signupUser= async(req,res)=>{
    try{let {username, email, password}=req.body;
    const newUser= new User({email,username})
    const registerUser= await User.register(newUser, password)
    console.log(registerUser)
    req.login(registerUser,(err)=>{
        if(err){
           return next(err)
        }  
            req.flash("success", "Welcom To Wanderlust")
            res.redirect("/listing")
        })
    }catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcom To wanderlust")
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)
}

module.exports.logoutUser=(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/listing")
    })
}

module.exports.renderForgotPassForm=(req, res) => {
    res.render("users/forgot.ejs");
}

module.exports.forgotPass= async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        req.flash("error", "No account with that email address exists.");
        return res.redirect("/forgot-password");
    }

    // Create a random token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Setup Email Transporter (Nodemailer)
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            user: process.env.EMAIL_ID, // Your email
            pass: process.env.EMAIL_PASSWORD // Your app password
        }
    });

    const mailOptions = {
        to: user.email,
        from: 'yourproject@gmail.com',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://${req.headers.host}/reset/${token}\n\n`
    };

    await transporter.sendMail(mailOptions);
    req.flash("success", `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect("/login");
}

module.exports.resetTokenShow=async (req, res) => {
    const user = await User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
    });

    if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
    }
    res.render("users/reset.ejs", { token: req.params.token });
}

module.exports.resetTokenSave=async (req, res) => {
    const user = await User.findOne({ 
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: { $gt: Date.now() } 
    });

    if (user) {
        // Use passport-local-mongoose's setPassword method
        await user.setPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        req.flash("success", "Success! Your password has been changed.");
        res.redirect("/login");
    }
}
