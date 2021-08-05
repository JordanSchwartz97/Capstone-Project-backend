const mongoose = require('mongoose');
const {productSchema} = require("../models/product");
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 1, maxlength: 30},
    lastName: {type: String, required: true, minlength: 1, maxlength: 30},
    email: {type: String, required: true, minlength: 4, maxlength: 30},
    age: {type: String, required: true},
    username: {type: String, required: true, minlength: 1, maxlength: 30},
    password: {type: String, required: true, minlength: 4, maxlength: 50},
    cart: {type: [productSchema], default: [] },

})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().required().min(1).max(30),
        lastName: Joi.string().required().min(1).max(30),
        email: Joi.string().required().min(4).max(30),
        age: Joi.string().required(),
        username: Joi.string().required().min(1).max(30),
        password: Joi.string().required().min(4).max(50),
    })
    return schema.validate(user);
}

exports.validateUser = validateUser;
exports.User = User;
exports.userSchema = userSchema;

