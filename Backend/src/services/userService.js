const user = require('../models/userModel.js')
const nodemailer = require('nodemailer'); 
const bcrypt =require('bcrypt')
const cookie = require('cookie');
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
      

       
    } catch(error){
        console.error('Lỗi tạo người dùng:', error); // In lỗi ra console
        throw error; 
    }
}

login = async (data,res) => {
    try {
        // Kiểm tra xem người dùng có đăng nhập qua Google hay không
        console.log("Đang cố gắng đăng nhập...");
        if (data.googleToken) {
            console.log("Đang xác thực token Google...");
            const ticket = await client.verifyIdToken({
                idToken: data.googleToken,
                audience: client_id
            });
            const payload = ticket.getPayload();
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
                    fullname: payload.name,
                    username: payload.email.split('@')[0], // Có thể tạo username từ email
                    email: payload.email,
                    num: data.num || '', // Nếu cần thêm số điện thoại
                    password: null, // Không cần mật khẩu nếu đăng ký qua Google
                    role: data.role || 'User'
                });
            }

            // Tạo JWT cho người dùng
            const payload1 = {
                userId: userFound._id,
                fullname: userFound.fullname,
                email: userFound.email,
                role: userFound.role
            };

            const accesstoken = jwt.sign(payload1, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });
            const refreshToken = jwt.sign({ userId: userFound._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRE // Thời gian tồn tại của Refresh Token
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, 
                secure: true, // Chỉ gửi qua HTTPS nếu ở môi trường sản xuất
                maxAge: 30 * 24 * 60 * 60 * 1000 // Thời gian sống của cookie (ví dụ: 30 ngày)
            });

            return {
                accesstoken,
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
                if( userFound.password!=null){
                    var isMatchPassword = await bcrypt.compare(data.password, userFound.password);
                }else{
                    return { EC: 0, EM: "Email hoặc Password không hợp lệ!" };
                }
                
                if (!isMatchPassword) {
                    return { EC: 1, EM: "Email hoặc Password không hợp lệ!" };
                }

                const payload = {
                    userId: userFound._id,
                    fullname: userFound.fullname,
                    email: userFound.email,
                    role: userFound.role
                };

                const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRE
                });
                const refreshToken = jwt.sign({ userId: userFound._id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_REFRESH_EXPIRE // Thời gian tồn tại của Refresh Token
                });

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true, 
                    secure: true, // Chỉ gửi qua HTTPS nếu ở môi trường sản xuất
                    maxAge: 30 * 24 * 60 * 60 * 1000 // Thời gian sống của cookie (ví dụ: 30 ngày)
                });

                return {
                    accesstoken,
                    
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
        console.log(decoded)
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
            return {
                message: "Authorization!"
            }
        }

    }  catch (error) {
        console.error("Error in jwt.verify:", error.message); // Ghi log chi tiết lỗi
        throw new Error("Failed to verify token: " + error.message);
    }
}


forgotpassword = async (email)=>{
    if(!email){
        return{
            message: 'Bạn chưa nhập email !',
        }
    }
    const users = await user.findOne({email})
    if(!users){
        return {
            message: 'email chưa được đăng kí !',
        }
    }
    const token = jwt.sign({email:users.email},process.env.JWT_SECRET,{ expiresIn: '30m' })
    const link = `http://localhost:3000/reset-password/${token}`; // Updated URL

    
    console.log(token)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_MYEMAIL, 
            pass: process.env.EMAIL_PASSWORD 
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_MYEMAIL,
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `<p>Xin chào,</p>
               <p>Để đặt lại mật khẩu của bạn, hãy nhấp vào liên kết bên dưới:</p>
               <a href="${link}">Đặt lại mật khẩu</a>
               <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return {
        message: 'Email đã được gửi để đặt lại mật khẩu!',
    };
}


resetpassword = async (token , newpassword)=>{
    if(!token || !newpassword){
        return { message: 'Thiếu thông tin!' };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users =await user.findOne({email:decoded.email})
    if(!users){
        return {
            message: 'email không tồn tại',
        };
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    users.password=hashedPassword;
    await users.save()
    return { message: 'Mật khẩu đã được đổi thành công!' };
}
}



module.exports = new userService