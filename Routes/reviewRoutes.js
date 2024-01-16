const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../Controller/review')

const wrapAsync = require('../Errors/wrapAsync');
const validateReview = require('../Errors/validateReview')

const { isLoggedIn } = require('../middlewares/login');
const { isReviewAuthor } = require('../middlewares/isAuthor')

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;