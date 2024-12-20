const jwt = require('jsonwebtoken')
const Users = require('../models/userModel.js')
require('dotenv').config()


const autAdmin = async(req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({
                    message: "Bạn chưa đăng nhập!"
                })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            if (!decoded) {
                return res.status(404).json({
                    message: "Người dùng không tồn tại!"
                })
            }
            if(decoded.role != 'Admin'){
                return res.status(401).json({
                    message: "Người dùng không có quyền truy cập!"
                })
            }
            
            next()

        } else {
            return res.status(401).json({
                message: "Authorization!"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Xác thực thất bại!",
            error: error.message
        })
    }
}

module.exports = autAdmin
