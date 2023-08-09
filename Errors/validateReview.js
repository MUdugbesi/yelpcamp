
const reviewJoiSchema = require('../Validation/review_Joi')

const ExpressError = require('../Errors/ExpressError');

const validateReview = async (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message);
        next(new ExpressError(msg, 400))
    } else {
        next();
    }
}

module.exports = validateReview;

