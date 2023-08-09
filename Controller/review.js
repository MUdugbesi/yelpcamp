const Campground = require('../model/campground');
const Review = require('../model/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const reviews = new Review(req.body.review);
    reviews.author = req.user._id
    camp.review.push(reviews);
    await reviews.save();
    await camp.save();
    req.flash('success', 'New review posted')
    res.redirect(`/campgrounds/${camp._id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted successfully')
    res.redirect(`/campgrounds/${id}`)
};