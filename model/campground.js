const opts = { toJSON: { virtuals: true } };
const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_scale,w_200')
})

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    images: [ImageSchema],

    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

campgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0, 100)}...</p>`
})
//mongoose middleware- sensitive to delete method 'findoneAndDelete on app.js

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})



const Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground