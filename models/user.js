const mongoose = require('mongoose');
const {productSchema} = require("../models/product");
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, minlength: 1, maxlength: 30},
    lastName: {type: String, required: true, minlength: 1, maxlength: 30},
    email: {type: String, required: true, minlength: 4, maxlength: 30},
    age: {type: String, required: true},
    username: {type: String, required: true, minlength: 1, maxlength: 30},
    password: {type: String, required: true, minlength: 4, maxlength: 100},
    cart: {type: [productSchema], default: [] },
    profileImage: {type: String, required: true,default: 'no Photo' },
    isAdmin: { type: Boolean, default: false},

});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, username: this.username, isAdmin: this.isAdmin}, config.get('jwtSecret'));
};
const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().required().min(1).max(30),
        lastName: Joi.string().required().min(1).max(30),
        email: Joi.string().required().min(4).max(30),
        age: Joi.string().required(),
        username: Joi.string().required().min(1).max(30),
        password: Joi.string().required().min(4).max(100),
    })
    return schema.validate(user);
}

exports.validateUser = validateUser;
exports.User = User;
exports.userSchema = userSchema;

