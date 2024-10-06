const express = require('express');
const router = require('./routes/indexRouter.js')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/Database.js');
dotenv.config();

const app = express();

const port = process.env.PORT || 8081;
//cau hinh formdata
app.use(express.urlencoded({extended:true}))
app.use(express.json());
// Connect to MongoDB once when the server starts
connectDB();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


router(app);
