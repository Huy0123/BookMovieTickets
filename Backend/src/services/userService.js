const user = require('../models/userModel.js')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const saltRounds =10
const client_id = process.env.GG_CLIENT_ID
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(client_id);
class userService{
    



createUserService = async(data)=>{
    try{
        let hashPassword;
        if (data.googleToken) {
            const ticket = await client.verifyIdToken({
                idToken: data.googleToken,
                audience: client_id
            });
            const payload = ticket.getPayload();
            
            // Kiểm tra xem người dùng đã tồn tại chưa
            const existingUser = await user.findOne({ email: payload.email });
            if (existingUser) {
                return existingUser; // Nếu đã tồn tại, trả về người dùng
            }

            // Tạo người dùng mới bằng thông tin từ Google
            const newUser = await user.create({
                fullname: payload.name,
                username: payload.email.split('@')[0], // Có thể tạo username từ email
                email: payload.email,
                num: data.num || '', // Nếu cần thêm số điện thoại
                password: null, // Không cần mật khẩu nếu đăng ký qua Google
                role: data.role || 'User'
            });
            
            return newUser;
        } else{
            hashPassword = await bcrypt.hash(data.password,saltRounds)
            let result = await user.create({
                fullname: data.fullname,
                username: data.username,
                email: data.email,
                num: data.num,
                password: hashPassword,
                role: data.role
            })
            return result
        }

       
    } catch(error){
        console.error('Lỗi tạo người dùng:', error); // In lỗi ra console
        throw error; 
    }
}

login = async (data) => {
    try {
        // Kiểm tra xem người dùng có đăng nhập qua Google hay không
        console.log("Đang cố gắng đăng nhập...");
        if (data.googleToken) {
            console.log("Đang xác thực token Google...");

            const googleUser = await this.verifyGoogleToken(data.googleToken);
            console.log("Đang xác thực token Google...",googleUser);
            if (!googleUser) {
                return { EC: 3, EM: "ID Token không hợp lệ!" };
            }
            
            // Tìm người dùng trong cơ sở dữ liệu
            let userFound = await user.findOne({ email: googleUser.email });
            if (!userFound) {
                // Nếu không tìm thấy, tạo tài khoản mới
                userFound = await user.create({
                    fullname: googleUser.name,
                    email: googleUser.email,
                    password: null, // Không cần mật khẩu khi đăng nhập qua Google
                    role: 'User' // Hoặc giá trị khác tùy thuộc vào logic của bạn
                });
            }

            // Tạo JWT cho người dùng
            const payload = {
                userId: userFound._id,
                fullname: userFound.fullname,
                email: userFound.email,
                role: userFound.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });

            return {
                token,
                user: {
                    userId: userFound._id,
                    fullname: userFound.fullname,
                    email: userFound.email,
                    role: userFound.role
                }
            };
        } else {
            // Đăng nhập bằng tên người dùng và mật khẩu
            const userFound = await user.findOne({ username: data.username });
            if (userFound) {
                const isMatchPassword = await bcrypt.compare(data.password, userFound.password);
                if (!isMatchPassword) {
                    return { EC: 1, EM: "Email hoặc Password không hợp lệ!" };
                }

                const payload = {
                    userId: userFound._id,
                    fullname: userFound.fullname,
                    email: userFound.email,
                    role: userFound.role
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRE
                });

                return {
                    token,
                    user: {
                        userId: userFound._id,
                        fullname: userFound.fullname,
                        email: userFound.email,
                        role: userFound.role
                    }
                };
            } else {
                return { EC: 2, EM: "Email hoặc Password không hợp lệ!" };
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

/////// giai ma toke id cua thk gg
verifyGoogleToken = async (token) => {
    try {
        console.log("Verifying Google token:", token);
        console.log("client_id",process.env.GG_CLIENT_ID)
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GG_CLIENT_ID 
        });
        console.log(ticket)
        const payload = ticket.getPayload(); 
        console.log("Payload:", payload); 
        return payload;
    } catch (error) {
        console.error('Error verifying Google token:', error.message);
        throw new Error("Token không hợp lệ");
    }
};



////////////////////////////

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