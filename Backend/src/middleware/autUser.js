const jwt = require('jsonwebtoken')
const Users = require('../models/userModel')
require('dotenv').config()


const autUser = async (req, res, next) => {
    try {
        // Kiểm tra nếu có Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Authorization header không hợp lệ!"
            });
        }

        // Lấy token từ Authorization header
        const token = authHeader.split(' ')[1];
        console.log("Token nhận được:", token);

        if (!token) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập!"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(404).json({
                message: "Người dùng không tồn tại!"
            });
        }

        // Kiểm tra quyền truy cập
        if (decoded.role === "Admin") {
            return res.status(403).json({
                message: "Người dùng không có quyền truy cập!"
            });
        }

        // Lưu thông tin người dùng vào req
        req.user = decoded;
        req.token = token;

        next();

    } catch (error) {
      
        return res.status(401).json({
            message: "Xác thực thất bại!",
            error: error.message
        });
    }
};

module.exports = autUser
