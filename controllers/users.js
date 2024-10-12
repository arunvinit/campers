const User=require("../models/user");

module.exports.renderRegister=(req,res)=>{
    res.render("users/register");
}

module.exports.register=async (req,res)=>{
    try{
        const {email,username,password}=req.body;
        const user=new User({email,username});
        const regiuser=await User.register(user,password);
        req.login(regiuser,err=>{
            if(err){
                return next(err);
            }
            req.flash('success',`Welcome to Yelp Camp ${username} !`);
            res.redirect("/campground")
        })
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect("/register")
    }
    // console.log(regiuser);
}

module.exports.loginRender=(req,res)=>{
    res.render("users/login")
}

module.exports.login=(req,res)=>{
    req.flash('success',`Welcome Back ${req.user.username}`);
    // console.log(`current user ${req.user.username}`);
    const redirectUrl=req.session.returnTo || "/campground";
    delete req.session.returnTo
    res.redirect("/")
}

module.exports.logout=(req,res)=>{
    if(req.isAuthenticated()){
        req.logout();
        req.flash('success','See You Soon');
        res.redirect("/campground")
        return;
    }
    else{
        req.flash('error','Your are not logged in ');
        res.redirect("/campground")
    }
    
}