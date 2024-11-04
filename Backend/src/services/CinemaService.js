const cinema = require('../models/Cinema');
const UserModel = require('../models/userModel')
const saltRounds =10
const bcrypt =require('bcrypt')
class CinemaService {
    createCinema = async (data) => {
        const hashPassword = await bcrypt.hash(data.password, saltRounds);
        const userCinema = await UserModel.create({
            fullname: data.nameCinema,
            username: data.username,
            email: data.email,
            num: data.num,
            password: hashPassword,
            role:"Cinema"         
        })

        const Cinema = await cinema.create({
            name:data.nameCinema,
            address:data.address,
            user_id:userCinema._id

        })
       return {userCinema,Cinema} 
    }

    getCinemas = async () => {
        return cinema.find();
    }

    getCinemaByID = async (id) => {
        return cinema.findById(id);
    }

    updateCinema = async (id, cinemaData) => {
        await cinema.findByIdAndUpdate(id, cinemaData);
        return cinema.findById(id);
    }

    deleteCinema = async (id) => {
        await cinema.findByIdAndDelete(id);
    }

    getCinemasByMovieID = async (id) => {
        return cinema.find({ movies: id });
    }

    getCinemasByCity = async (city) => {
        return cinema.find({ address: { $regex: city, $options: 'i' } });
    }

    getCinemasByMovieIDAndCity = async (id, city) => {
        return cinema.find({ movies: id,  address: { $regex: city, $options: 'i' } });
    }
}

module.exports = new CinemaService;