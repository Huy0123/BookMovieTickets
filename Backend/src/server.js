const express = require('express');
const route = require('./routes/indexRouter.js')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

const port = process.env.PORT || 8081;
//cau hinh doc json
app.use(express.json());
//cau hinh formdata
app.use(express.urlencoded({extended:true}))

// Connect to MongoDB once when the server starts
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


route(app)
