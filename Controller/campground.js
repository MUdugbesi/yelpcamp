const Campground = require('../model/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const mbxGeoCoder = mbxGeocoding({ accessToken: mbxToken });
const cloudinary = require('../cloudinary');

module.exports.isHome = async (req, res) => {
    const campground = await Campground.find({})
    res.render('campgrounds/index', { campground })
}

module.exports.isPrice = async (req, res) => {
    const campground = await Campground.find({})
    res.render('campgrounds/price', { campground })
}

module.exports.isPriceList = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/prices', { campgrounds })
}
module.exports.newCamp = (req, res) => {
    res.render('campgrounds/new')
}
module.exports.createCamp = async (req, res) => {
    const camp = req.body.Campground;

    const mbxGeoData = await mbxGeoCoder.forwardGeocode({
        query: camp.location,
        limit: 1
    }).send();
    const mbxLocation = mbxGeoData.body.features[0].geometry;

    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    const newCamp = new Campground(camp);
    newCamp.geometry = mbxLocation;
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'New campground sucesssfully added')
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.renderCamp = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!camp) {
        req.flash('error', 'Campground do not exist!');
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { camp })

}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp })
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.Campground }, { runValidators: true, new: true });

    const mbxGeoData = await mbxGeoCoder.forwardGeocode({
        query: camp.location,
        limit: 1
    }).send();
    const mbxLocation = mbxGeoData.body.features[0].geometry;

    
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    camp.geometry = mbxLocation;
    await camp.save();
    if (req.body.deleteImgs) {
        for (let filename of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(filename).then(console.log('Deleted'));
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImgs } } } });
    }
    req.flash('success', 'Campground Updated')
    res.redirect(`/campgrounds/${camp._id}`)

}
module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted successfully')
    res.redirect('/campgrounds')
}

