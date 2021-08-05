const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const { Product, validateProduct } = require("../models/product");
const { Review, validateReview } = require("../models/review");

//GET Grabs all users in database

router.get("/allUsers", async (req, res) =>{
    try{
        const user = await User.find();
        return res.send(user);

    }catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
    
})

//POST creates a new user to add to the database

router.post("/register", async (req, res) => {
    try{
    const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error);

        let user = await User.findOne ({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');
        
        
        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age,
            username: req.body.username,
            password: req.body.password
        });
        await user.save();
    } catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

module.exports = router;