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
});

//GET grabs specific user in database

//GET endpoint that returns all products
router.get("/products", async (req, res) => {
    try{
        const product = await Product.find();
        return res.send(product);
    } catch (ex) {
        return res.send(500).send(`Internal Server Error: ${ex}`);
    }
});

//GET endpoint that returns individual product.
router.get("/products/:productId", async (req,res) => {
    try {
        const product = await Product.findById(req.params.productId);
        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//GET endpoint that returns reviews related to a individual product
router.get("/products/reviews/:productId", async (req, res) => {
try {
    const product = await Product.findById(req.params.productId);
    return res.send(product.productReview);

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

//POST endpoint that creates a new product
router.post('/products' , async (req,res) => {
    try {
        const {error} = validateProduct(req.body);
        if (error) return res.status(400).send(error);

        product = new Product({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productDescription: req.body.productDescription
        });
        await product.save();
    } catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

//PUT endpoint that adds a new review to a product
router.put("/products/reviews/:productId", async (req,res) => {
    try {
        let product = await Product.findById(req.params.productId);
        if (!product) return res.status(400).send(`Product does not exist.`);

        const{error} = validateReview(req.body);
        if(error) return res.status(400).send(error)

        review = new Review({
            text: req.body.text,
        });
        
        await review.save();
    } catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});



module.exports = router;