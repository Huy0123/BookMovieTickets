const FoodModel = require('../models/FoodAndDrinkModel.js')
const upload = require('../utils/upload')
class FoodService {
    getFood = async ()=>{
        try {
            const Food = await FoodModel.find()
            return {Food}
        } catch (error) {
            throw error
        }
    }
    
    createrFood = async (data)=>{
        try {
            const ImageFile = data.files.Image ? data.files.Image[0] : null;
            let ImageUrl = null;
            if(ImageFile){
                ImageUrl = await upload.uploadFile(String(ImageFile.originalname), ImageFile.buffer, String(ImageFile.mimetype));
            }
            const Food = await FoodModel.create({
                name:data.body.name,
                Image:ImageUrl,
                price:data.body.price,
                category:data.body.category
            })

            return {Food}
        } catch (error) {
            return error
        }
    }

    editFood = async (idFood,data)=>{
        const ImageFile = data.files.Image ? data.files.Image[0] : null;
        const food = await FoodModel.findById(idFood)
        if(!food){
            return {message:"no food"}
        }
        if(food.Image){
            await upload.deleteFile(food.Image);
        }
        const ImageUrl = await upload.uploadFile(String(ImageFile.originalname), ImageFile.buffer, String(ImageFile.mimetype));
        const Food = await FoodModel.findByIdAndUpdate(idFood,{
            name:data.body.name,
            Image:ImageUrl,
            price:data.body.price,
            category:data.body.category 
        }, { new: true } )
        
        console.log(Food)
        return {Food}
    }

    getFoodById = async(idFood)=>{
        const food = await FoodModel.findById(idFood)
        return {food}
    }
    deleteFood = async(idFood) =>{
        return await FoodModel.findByIdAndDelete(idFood);
    }
}

module.exports = new FoodService