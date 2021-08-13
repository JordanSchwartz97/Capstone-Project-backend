const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const { Product, validateProduct } = require("../models/product");
const { Review, validateReview } = require("../models/review");
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


//GET Grabs all users in database
router.get("/users", async (req, res) =>{
    try{
        const user = await User.find();
        return res.send(user);

    }catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }   
});


//GET grabs specific user in database
router.get("/users/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

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
router.get("/products/:productId", auth, async (req,res) => {
    try {
        const product = await Product.findById(req.params.productId);
        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//GET endpoint that returns reviews related to a individual product
router.get("/products/reviews/:productId", auth, async (req, res) => {
try {
    const product = await Product.findById(req.params.productId);
    return res.send(product.productReview);

}catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})


// //POST creates a new user to add to the database
// router.post("/register", async (req, res) => {
//     try{

//         let user = await User.findOne ({ email: req.body.email });
//         if (user) return res.status(400).send('User already registered.');
        
        
//         user = new User({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email,
//             age: req.body.age,
//             username: req.body.username,
//             password: req.body.password
//         });
//         await user.save();
//         return res.send(id)
//     } catch (ex) {
//         return res.status(500).send(`Internal Server Error ${ex}`);
//     }
// });

//POST WITH LOGIN VERIFICATION FOR REGISTER
router.post('/register', async (req, res) => {
    try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
    
    const salt = await bcrypt.genSalt(10);
    user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age,
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, salt),
    });
    await user.save();
    
    const token = user.generateAuthToken();

    return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send({_id: user._id, username: user.username, email: user.email});
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    }
   });
//POST endpoint that creates a new product
router.post('/products', [auth, admin], async (req,res) => {
    try {
        const {error} = validateProduct(req.body);
        if (error) return res.status(400).send(error);

        product = new Product({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            productDescription: req.body.productDescription
        });
        await product.save();
        return res.send(product);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

//POST endpoint that adds a new product to the cart
router.post("/cart/:userId/:productId", async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(400).send(`The user with id ${req.params.userId} does not exist`);

        const product = await Product.findById(req.params.productId);
        if(!product) return res.status(400).send(`The product with id ${req.params.productId} does not exist.`);

        user.cart.push(product);

        await user.save();
        return res.send(product);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});

//PUT endpoint that adds a new review to a product
router.put("/products/reviews/:productId", auth, async (req,res) => {
    try {
        let product = await Product.findById(req.params.productId);
        if (!product) return res.status(400).send(`Product does not exist.`);

        const{error} = validateReview(req.body);
        if(error) return res.status(400).send(error)

        review = new Review({
            text: req.body.text,
        });
        
        await review.save();
        return res.send(review);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error ${ex}`);
    }
});


// //PUT endpoint that changes user info
router.put("/users/:userId", async (req, res) => {
    try{
        let user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`User does not exist.`);

        
            user.firstName = req.body.firstName,
            user.lastName = req.body.lastName,
            user.email = req.body.email,
            user.age = req.body.age,
            user.username = req.body.username
            
            await user.save();
            return res.send(user);
            
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//DELETE endpoint that deletes a product from a cart
 router.delete("/cart/:userId/:productId", auth, async (req,res) => {
    try{
     const user = await User.findById(req.params.userId);
     if(!user) return res.status(400).send(`The user with id ${req.params.userId} does not exist.`);

     let product = user.cart.id(req.params.productId);
     if(!product) return res.status(400).send(`The product with id ${req.params.productId} does not exist.`);

     product = await product.remove();
     
     await user.save();

     return res.send(product);
 }  catch (ex) {
     return res.status(500).send(`Internal Server Error: ${ex}`);
 }});

 //DELETE endpoint that deletes a user's account
 router.delete("/delete/:userId", auth, async (req,res) => {
     try{
        const user = await User.findByIdAndRemove(req.params.userId);
        if (!user) return res.status(400).send(`The user with id ${req.params.email} does not exist.`);

        return res.send(`User was succesfully deleted.`);
     }  catch (ex) {
         return res.status(500).send(`Internal Server Error: ${ex}`);
     }
 })

module.exports = router;