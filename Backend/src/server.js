const express = require('express');

const router = require('./routes/indexRouter.js');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Thêm dòng này để import cors
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/Database.js');
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
// thiet lap hdb
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: false
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

// Connect to MongoDB once when the server starts
connectDB();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


router(app);
