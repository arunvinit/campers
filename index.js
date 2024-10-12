if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const {storage}=require("./cloudinary")
const multer  = require('multer')
const upload = multer({ storage })
const session=require("express-session")
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const { campgroundSchema , reviewSchema } = require('./schema.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const passport=require("passport");
const LocalStrategy = require("passport-local");
const userRoute= require("./routes/users");
const User= require("./models/user");
const campgrounds=require("./controllers/campgrounds");
const reviews=require("./controllers/reviews");
const MongoStore= require('connect-mongo')
const {isLoggedIn,isAuthor,validateCampground,validateReview,isReviewAuthor}=require("./middlare");
// const { session } = require('passport');
const dbUrl=process.env.DB_URL|| 'mongodb://localhost:27017/yelpcamp'

main().catch(err => console.log(err));
async function main() {
    // 
    await mongoose.connect(dbUrl);
    console.log("connection open");
}
const app = express();

app.use(cors(
    {
        origin: ["https://deploy-mern-frontend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// store.on("error",function(e){
//     console.log('Session error');
// })
const secret=process.env.SECRET || 'thisshouldbeabettersecret!'
const sessionConfig = {
    secret,
    // store:new MongoStore({
    //     url:dbUrl,
    //     secret:'thisshouldbeabettersecret!',
    //     touchAfter:24*60*60
    // }),
    resave: false,
    saveUninitialized: true,
    
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/",userRoute)

app.get('/', async(req, res) => {
    const campground=await Campground.find();
    const campgrounds=[];
    let i=0;
    while(i<campground.length && i<3){
        campgrounds.push(campground[i]);
        i++;
    }
    res.render('home',{campgrounds});
});
app.get('/campground', catchAsync(campgrounds.index));

app.get('/campground/new',isLoggedIn,campgrounds.newForm)

// app.post("/campground", upload.array('image') ,(req,res)=>{
//     console.log(req.body,req.files);
//     res.send("It worked")
// })

app.post('/campground',isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

app.get('/campground/:id',catchAsync(campgrounds.showCampground));

app.get('/campground/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.editForm))

app.put('/campground/:id',isLoggedIn,isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground));

app.delete('/campground/:id',isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));

app.post('/campground/:id/reviews',isLoggedIn, validateReview, catchAsync(reviews.createReview))

app.delete('/campground/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port= process.env.BASE_URL || 3000 
app.listen(port, () => {
    console.log(`serving on port ${port}`)
})




