const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),

    messages: {
        'string.avoidHTML': 'Gotcha!! {{#label}} must not include HTML or codes!'
    },
    rules: {
        avoidHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.avoidHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);



const campgroundJoiSchema = joi.object({
    Campground: joi.object({
        title: joi.string().avoidHTML()
            .min(5)
            .max(50)
            .required(),

        price: joi.number()
            .min(5)
            .required(),

        location: joi.string().avoidHTML()
            .min(5)
            .max(50)
            .required(),

        // image: joi.string()
        //     .required(),

        description: joi.string().avoidHTML()
            .min(10)
            .required()


    }).required(),
    deleteImgs: joi.array()

});

module.exports = campgroundJoiSchema;