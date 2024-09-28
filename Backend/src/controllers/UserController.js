const userService = require('../services/userService.js')
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

}
module.exports = new UserController