const FoodModel = require('../models/FoodAndDrinkModel.js')
const upload = require('../utils/upload.js')
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
        const {files,body} = data;
        const uploadFile = async (file) => {
            return await upload.uploadFile(
                String(file.originalname), 
                file.buffer, 
                String(file.mimetype)
            );
        };

        const exitingFood = await FoodModel.findById(idFood);
        if(files.Image && files.Image[0]){
            if(exitingFood.Image){
                await upload.deleteFile(exitingFood.Image);
            }
            const imageUrl = await uploadFile(files.Image[0]);
            data.body.Image = imageUrl;
        }

        return await FoodModel.findByIdAndUpdate(idFood,data.body,{new:true});
    }

    getFoodById = async(idFood)=>{
        const food = await FoodModel.findById(idFood)
        return {food}
    }
    deleteFood = async(idFood) =>{
        const existingFood = await FoodModel.findById(idFood);
        if(existingFood.Image){
            await upload.deleteFile(existingFood.Image);
        }
        return await FoodModel.findByIdAndDelete(idFood);
    }
}

module.exports = new FoodService