const express = require('express');
<<<<<<< HEAD
const route = require('./routes/indexRouter.js');
const cookieParser = require('cookie-parser');
=======
const router = require('./routes/indexRouter.js')
>>>>>>> 013d85ec86bebbb85163bf916e8516a4a3b91ebe
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/Database.js');
dotenv.config();

const app = express();

const port = process.env.PORT || 8081;
<<<<<<< HEAD

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

=======
//cau hinh formdata
app.use(express.urlencoded({extended:true}))
app.use(express.json());
>>>>>>> 013d85ec86bebbb85163bf916e8516a4a3b91ebe
// Connect to MongoDB once when the server starts
connectDB();
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


router(app);
