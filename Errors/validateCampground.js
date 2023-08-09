const campgroundJoiSchema = require('../Validation/campground_Joi')
const ExpressError = require('../Errors/ExpressError');

const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message);
        next(new ExpressError(msg, 400))
    } else {
        next();
    }
}

module.exports = validateCampground;