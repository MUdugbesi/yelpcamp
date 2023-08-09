const Joi = require('joi')

const reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),

        body: Joi.string()
        .min(5)
        .required()

    }).required()
})

module.exports = reviewJoiSchema;