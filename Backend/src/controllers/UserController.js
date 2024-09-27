const userService = require('../services/userService.js')
const jwt = require('jsonwebtoken')
class UserController{
    
    // dang ki
    createUser = async(req,res,next)=>{
       const data = req.body
       try {
        
        const create = await userService.createUserService(data) // Lưu đối tượng vào cơ sở dữ liệu
        
        return res.status(200).json(create)
       } catch (error) {
        if (error.code === 11000) {
            // Lỗi trùng lặp
            console.error('Tên người dùng hoặc email đã tồn tại!');
            return res.status(409).json({
                message:'Tên người dùng hoặc email đã tồn tại!',
            }); 
        } else if (error.name === 'ValidationError') {
            // Lỗi do thiếu hoặc dữ liệu không hợp lệ
            console.error('Dữ liệu không hợp lệ:', error);
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ hoặc thiếu thông tin cần thiết',
            });
        } else {
            // Các lỗi khác không xác định
            console.error('Lỗi khi tạo người dùng:', error);
            return res.status(500).json({
                message: 'Lỗi máy chủ, vui lòng thử lại sau',
            });
                
            }
       }
       
    }

    //dang nhap
    login = async(req,res,next)=>{
        const data = req.body
        const data1=await userService.login(data)
        return res.status(200).json(data1)

    }

    //Get User
    getUsers = async (req,res,next)=>{
        const data = req.body
        const dataUsers=await userService.getUsers(data)
        return res.status(200).json(dataUsers)
    }

    //refresh_token
    refreshToken = async(req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Expired Authorization!" });
            }
            const dataToken = await userService.refreshToken(token);
            return res.status(200).json(dataToken);
        } catch (error) {
            console.error('Error in refreshToken controller:', error.message); 
            return res.status(401).json({ message: error.message });
        }
    };
    
}
module.exports = new UserController