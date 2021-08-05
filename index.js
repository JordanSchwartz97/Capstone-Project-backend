const connectDB = require('./startup/db');
const express = require("express");
const app = express();
const cors = require('cors');

connectDB();

app.use(cors());
app.use(express.json());

app.listen(5000, function () {
    console.log('Server Started. Listening on port 5000.')
    connectDB();
})