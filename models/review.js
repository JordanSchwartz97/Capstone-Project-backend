const mongoose = require('mongoose');
const Joi = require('joi');
const { text } = require('express');

const reviewSchema = new mongoose.Schema({
    text: {type: String, required: true, minlength: 2, maxlength: 50},
    rating: {type: Number, required: true},
    dateAdded: {type: Date, default: Date.now}
});

const Review = mongoose.model('Review', reviewSchema)

function validateReview(review) {
    const schema = Joi.object({
        text: Joi.string().required().min(2).max(50),
        rating: Joi.number().required()
    });
    return schema.validate(review);
}

exports.validateReview = validateReview;
exports.Review = Review;
exports.reviewSchema = reviewSchema;