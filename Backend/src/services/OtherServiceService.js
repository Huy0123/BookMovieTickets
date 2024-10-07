const otherSerivce = require('../models/OtherService');

class OtherServiceService {

    createService = async (service) => {
        return await otherSerivce.create(service);
    }

    getAllServices = async () => {
        return await otherSerivce.find();
    }

    getServiceByID = async (id) => {
        return await otherSerivce.findById(id);
    }

    updateService = async (id, service) => {
        return await otherSerivce.findByIdAndUpdate(id, service, { new: true });
    }

    deleteService = async (id) => {
        return await otherSerivce.findByIdAndDelete(id);
    }
}

module.exports = new OtherServiceService;