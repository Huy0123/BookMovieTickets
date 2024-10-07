const services = require('../models/OtherService');

class OtherService{

    createService = async (req, res) => {
        try {
            const service = new services(req.body);
            await service.save();
            res.status(201).send(service);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    getAllServices = async (req, res) => {
        try {
            const service = await services.find({});
            res.status(200).send(service);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    getServiceById = async (req, res) => {
        try {
            const service = await services.findById(req.params.id);
            if (!service) {
                return res.status(404).send();
            }
            res.status(200).send(service);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    updateService = async (req, res) => {
        try {
            const service = await services.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!service) {
                return res.status(404).send();
            }
            res.status(200).send(service);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    deleteService = async (req, res) => {
        try {
            const service = await services.findByIdAndDelete(req.params.id);
            if (!service) {
                return res.status(404).send();
            }
            res.status(200).send(service);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = new OtherService;