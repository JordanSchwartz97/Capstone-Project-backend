const mongoose = require('mongoose');
const Joi = require('joi');
const { text } = require('express');

const reviewSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: 2, maxlength: 30},
    text: {type: String, required: true, minlength: 2, maxlength: 200},
    rating: {type: Number, required: true},
    dateAdded: {type: Date, default: Date.now}
});

const Review = mongoose.model('Review', reviewSchema)

function validateReview(review) {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(30),
        text: Joi.string().required().min(2).max(200),
        rating: Joi.number().required()
    });
    return schema.validate(review);
}

exports.validateReview = validateReview;
exports.Review = Review;
exports.reviewSchema = reviewSchema;