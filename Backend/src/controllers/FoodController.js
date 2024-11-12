
const FoodService = require('../services/FoodService.js')

class FoodController {

    getFood = async(req,res)=>{
        try {
            const result = await FoodService.getFood()
            return res.status(200).json(result)
        } catch (error) {
            throw error
        }
       
    };
    createrFood = async (req,res)=>{
        try {
            const result = await FoodService.createrFood(req)
            return res.status(201).json(result)
        } catch (error) {
            throw error
        }
    }

    editFood = async (req,res)=>{
        try {
            const idFood = req.params.id
            const result = await FoodService.editFood(idFood,req)
            return res.status(200).json(result)
        } catch (error) {
            throw error
        }
    }

    getFoodById = async(req,res)=>{
        try {
            const idFood = req.params.id
            const result = await FoodService.getFoodById(idFood)
            return res.status(200).json(result)
        } catch (error) {
            
        }
    }

    deleteFood = async(req,res)=>{
        try{
            await FoodService.deleteFood(req.params.id);
            res.status(204).json({message: 'Movie deleted successfully'});
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete movie' });
        }
    
    }
}
module.exports = new FoodController