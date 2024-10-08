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
        const data1=await userService.login(data,res)
        
        return res.status(200).json(data1)

    }
//logout
    logout = async (req, res, next) => {
        try {
            // Xóa cookie refresh_token
            res.clearCookie('refreshToken', {
                httpOnly: true, // Đảm bảo rằng cookie đã được thiết lập là httpOnly
                secure: process.env.NODE_ENV === 'production' 
            });
    
            
            
            return res.status(200).json({ message: "Logout successful!" });
        } catch (error) {
            console.error('Error in logout controller:', error.message);
            return res.status(500).json({ message: "Logout failed." });
        }
    };

   // refresh_token
    refreshToken = async (req, res, next) => {
        try {
            const { refresh_token } = req.body; // Lấy Refresh Token từ body
            console.log(refresh_token);
            
            // Kiểm tra xem Refresh Token có tồn tại không
            if (!refresh_token) {
                return res.status(401).json({ message: "Refresh Token is required!" });
            }

            // Gọi service để làm mới Access Token
            const dataToken = await userService.refreshToken(refresh_token); // Gọi service với Refresh Token

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // Không thể truy cập từ JavaScript
                secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS nếu ở môi trường sản xuất
                maxAge: 30 * 24 * 60 * 60 * 1000 // Thời gian sống của cookie (ví dụ: 30 ngày)
            });
            // Trả về Access Token mới
            return res.status(200).json(dataToken);
        } catch (error) {
            console.error('Error in refreshToken controller:', error.message); 
            return res.status(401).json({ message: error.message });
        }
    };

     //Get User
     getUsers = async (req,res,next)=>{
        const data = req.body
        const dataUsers=await userService.getUsers(data)
        return res.status(200).json(dataUsers)
    }

    // Get user by ID
    getUserByID = async (req, res, next) => {
        const userId = req.params.id; 
        try {
            const user = await userService.getUserById(userId); // Call the service method
            if (!user) {
                return res.status(404).json({
                    message: 'Người dùng không tìm thấy!', // User not found
                });
            }
            return res.status(200).json(user); // Return the found user
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error); // Log the error
            return res.status(500).json({
                message: 'Lỗi máy chủ, vui lòng thử lại sau', // Internal server error message
            });
        }
    }

    //update user

    updateUser = async (req, res, next) => {
        const userId = req.params.id; 
        const updateData = req.body;   
    
        try {
            const existingUser = await userService.getUserById(userId);
    
            if (!existingUser) {
                return res.status(404).json({
                    message: 'Người dùng không tìm thấy!',
                });
            }
    
            // Nếu người dùng tồn tại, tiến hành cập nhật
            const updatedUser = await userService.updateUser(userId, updateData);
    
            return res.status(200).json({
                message: 'Cập nhật người dùng thành công!',
                updatedUser,
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            return res.status(500).json({
                message: 'Lỗi máy chủ, vui lòng thử lại sau.',
            });
        }
    }
    
    //delete user
    deleteUser =async (req,res,next) =>{
        const userId = req.params.id;
        try {
            const existingUser = await userService.getUserById(userId);
    
            if (!existingUser) {
                return res.status(404).json({
                    message: 'Người dùng không tìm thấy!',
                });
            }
            const deletedUser = await userService.deleteUser(userId);
            return res.status(200).json({
                message: 'Xóa người dùng người dùng thành công!',
            });
    } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error);
        return res.status(500).json({
            message: 'Lỗi máy chủ, vui lòng thử lại sau.',
        });
    }
}
    
forgotpassword = async(req,res)=>{
    try {
        const {email} = req.body
        const forgotpassword = await userService.forgotpassword(email);
        return res.status(200).json({forgotpassword})
    } catch (error) {
        throw error
    }
   

}
resetpassword = async (req,res)=>{
    try {
        const {token , newpassword} = req.body
        const resetpassword = await userService.resetpassword(token , newpassword);
        return res.status(200).json({resetpassword})
    } catch (error) {
        throw error
    }
   
}


    
}
module.exports = new UserController