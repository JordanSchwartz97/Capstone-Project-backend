const mongoose = require('mongoose');
const {productSchema} = require("../models/product");
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 1, maxlength: 30},
    lastName: {type: String, required: true, minlength: 1, maxlength: 30},
    email: {type: String, required: true, minlength: 4, maxlength: 30},
    age: {type: Number, required: true},
    username: {type: String, required: true, minlength: 1, maxlength: 30},
    password: {type: String, required: true, minlength: 8, maxlength: 50},
    cart: {type: [productSchema], default: [] },

})

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().required().minlength(1).maxlength(30),
        lastName: Joi.string().required().minlength(1).maxlength(30),
        email: Joi.string().required().minlength(4).maxlength(30),
        age: Joi.number().required(),
        username: Joi.string().required().minlength(1).maxlength(30),
        password: Joi.string().required().minlength(8).maxlength(50),

    })
}

exports.validateUser = validateUser;
exports.User = User;
exports.userSchema = userSchema;

