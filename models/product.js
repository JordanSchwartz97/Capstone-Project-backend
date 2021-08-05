const mongoose = require('mongoose');
const Joi = require('joi');
const {reviewSchema} = require("../models/review");

const productSchema = new mongoose.Schema({
    productImage: {type: String, default: './assets/error-icon-25243-Windows.ico' },
    productName: {type: String, required: true, minlength: 0, maxlength: 40},
    productPrice: {type: Number, required: true, },
    productDescription: {type: String, required: true},
    productReview: {type: [reviewSchema], default: [] },
    productDateAdded: {type: Date, default: Date.now}
})

const Product = mongoose.model("Product", productSchema)

function validateProduct(product) {
    const schema = Joi.object({
        productName: Joi.string().required().min(0).max(40),
        productPrice: Joi.number().required(),
        productDescription: Joi.string().required(),  
    });
    return schema.validate(product);
}


exports.validateProduct = validateProduct;
exports.Product = Product;
exports.productSchema = productSchema;