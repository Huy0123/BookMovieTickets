const user = require('../models/userModel.js')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const saltRounds =10

class userService{
    
createUserService = async(data)=>{
    try{
        const hashPassword = await bcrypt.hash(data.password,saltRounds)
        let result = await user.create({
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            num: data.num,
            password: hashPassword,
            role: data.role
        })
        return result
    } catch(error){
        console.error('Lỗi tạo người dùng:', error); // In lỗi ra console
        throw error; 
    }
}

login= async(data)=>{
    try{
        const users = await user.findOne({username:data.username})
        if(users){
            const isMatchPassword = await bcrypt.compare(data.password, users.password)
            if(!isMatchPassword){
               return {
                    EC: 1,
                    EM: "Email hoặc Password không hợp lệ!"
                }
            }else{
                const payload ={
                    userId:users._id,
                    fullname:users.fullname,
                    email:users.email,
                    role:users.role
                }
                const token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                    return {
                        token, 
                        user:{    
                            userId:users._id,                     
                            fullname:users.fullname,
                            email:users.email,
                            role:users.role
                        }
                    }
            }
        }else{
            return {
                EC:2,
                EM: "Email hoặc Password không hợp lệ!"
            }
        }
    }
    catch(error){
        console.log(error)
        return null
    }
}

getUsers=async()=>{
    try{
        const result = await user.find({role: 'User'})
        return result
    }catch(error){
        throw error; 
    }
}

// Get user by ID
getUserById = async (id) => {
    try {
        const userFound = await user.findById(id); // Find user by ID
        if (!userFound) {
            return null; // Return null if user not found
        }
        // Return the user object including _id
        return {
            _id: userFound._id, 
            fullname: userFound.fullname,
            username: userFound.username,
            email: userFound.email,
            password: userFound.password,
            num: userFound.num,
            role: userFound.role
        };
    } catch(error){
        throw error; 
    }
}

updateUser = async (userId, updateData) => {
    try {
        let hashPassword;
        if (updateData.password) {
             hashPassword = await bcrypt.hash(updateData.password, saltRounds);
            updateData.password = hashPassword; // Cập nhật mật khẩu đã mã hóa vào updateData
        }
        const updatedUser = await user.findByIdAndUpdate(
            userId,           
            updateData,        
            { new: true }      // Trả về dữ liệu đã cập nhật
        );

        if (!updatedUser) {
            return {
                message: 'Người dùng không tìm thấy!' 
            };
        }

        return {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                username: updatedUser.username,
                email: updatedUser.email,
                password: updateData.password ? hashPassword : updatedUser.password,
                num: updatedUser.num,
                role: updatedUser.role    
        };

    } catch(error){
        throw error; 
    }
}

deleteUser = async (userId) => {
    try{
        const deletedUser = await user.findByIdAndDelete(userId);
    } catch(error){
        throw error; 
    }
}



refreshToken = async(token)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const users = await user.findOne({ _id: decoded.userId }); 
        if(users){
            const payload ={
                userId:users._id,  
                fullname:users.fullname,
                email:users.email,
                role:users.role
            }
            const newToken = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE
                }
            )
                return {
                    newToken, 
                    user:{    
                        userId:users._id,             
                        fullname:users.fullname,
                        email:users.email,
                        role:users.role
                    }
                }
        }else{
            return res.status(401).json({
                message: "Authorization!"
            })
        }

    }  catch (error) {
        console.error("Error in jwt.verify:", error.message); // Ghi log chi tiết lỗi
        throw new Error("Failed to verify token: " + error.message);
    }
}
}
module.exports = new userService