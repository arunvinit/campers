const Campground = require('../models/campground');
const {cloudinary}=require("../cloudinary")
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mbxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mbxToken})
module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newForm= (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url: f.path,filename: f.filename}))
    campground.author=req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success','Campground Added Successfully')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.showCampground=async (req, res,) => {
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(camp);
    if(!camp){
        req.flash('error',"Cannot find the campground");
        res.redirect("/")
    }
    res.render('campgrounds/show', { camp });
}

module.exports.editForm=async (req, res) => {
    const { id } = req.params;
    const camp=await Campground.findById(id);
    if(!camp){
        req.flash('error',"Cannot find the campground");
        res.redirect("/campground")
    }
    
    // const camp1 = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { camp});
}

module.exports.updateCampground=async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs=req.files.map(f=>({url: f.path,filename: f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated campground')
    res.redirect(`/campground/${campground._id}`)
}

module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    const camp=await Campground.findById(id);
    
    await Campground.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the campground")
    res.redirect('/');
}