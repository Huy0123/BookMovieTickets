const express = require('express');
const route = require('./routes/indexRouter.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // Thêm dòng này để import cors

dotenv.config();

const app = express();

const port = process.env.PORT || 8081;

// Sử dụng CORS cho tất cả các yêu cầu
app.use(cors()); // Thêm dòng này để sử dụng cors

// Cấu hình đọc JSON
app.use(express.json());
// Cấu hình form-data
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB once when the server starts
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

route(app); // Di chuyển route(app) lên trên app.listen

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
