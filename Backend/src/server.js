const express = require('express');
const route = require('./routes/indexRouter.js');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // Thêm dòng này để import cors

dotenv.config();

const app = express();

const port = process.env.PORT || 8081;

// Sử dụng CORS cho tất cả các yêu cầu
app.use(cors({
    origin: 'http://localhost:3000',  // Chỉ định nguồn frontend
    credentials: true                 // Cho phép gửi cookie/credentials
}));

// Cấu hình đọc JSON
app.use(express.json());
// Cấu hình form-data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB once when the server starts
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

route(app); // Di chuyển route(app) lên trên app.listen

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
