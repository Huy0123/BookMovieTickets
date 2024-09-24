const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userModel = require('./models/User');

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

// Connect to MongoDB once when the server starts
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Define the root route
app.get('/', async (req, res) => {
    try {
        const users = await userModel.find().lean(); // Use lean() to get plain JavaScript objects
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});
