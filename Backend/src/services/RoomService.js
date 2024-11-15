const room = require('../models/Room')
const seat = require('../models/Seat')
class RoomService {
    createRoom = async (data) => {
        const newRoom = await room.create(data)
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seats = [];
    
        for (const row of rows) {
            for (let i = 1; i <= 12; i++) {
                seats.push({
                    room_id: newRoom._id,
                    seat_number: `${row}${i}`,
                    price: 50000,
                    seat_type: 'Standard'
                });
            }
        }
    
        await seat.insertMany(seats);
    
        return newRoom;
        
    };
    

    getRoomByCinemaID = async (id) => {
        return await room.find({ cinema_id: id })
    }

    getRooms = async () => {
        return await room.find()
    }

    getRoomByID = async (id) => {
        return await room.findById(id)
    }

    updateRoom = async (id, data) => {
        await room.findByIdAndUpdate(id, data)
        return await room.findById(id)
    }

    deleteRoom = async (id) => {
        await seat.deleteMany({ room_id: id })
        await room.findByIdAndDelete(id)
    }
}

module.exports = new RoomService;