const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary')
const uploads = multer({ storage })
// models

const campgrounds = require('../Controller/campground')
// errors
const wrapAsync = require('../Errors/wrapAsync');
const validateCampground = require('../Errors/validateCampground');
// Middleware
const { isLoggedIn } = require('../middlewares/login');
const { isAuthor } = require('../middlewares/isAuthor');

router.route('/')
    .get(isLoggedIn, wrapAsync(campgrounds.isHome))
    .post(isLoggedIn, uploads.array('image'), validateCampground, wrapAsync(campgrounds.createCamp))

router.get('/price', wrapAsync(campgrounds.isPrice));
router.get('/prices', isLoggedIn, wrapAsync(campgrounds.isPriceList));
router.get('/new', isLoggedIn, campgrounds.newCamp);

router.route('/:id')
    .get(isLoggedIn, wrapAsync(campgrounds.renderCamp))
    .put(isLoggedIn, isAuthor, uploads.array('image'), validateCampground, wrapAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.editCamp));

module.exports = router;