/* ******************************
 * Required Resources
 * ******************************/
const mongodb = require('../')
const ObjectId = require('mongodb').ObjectId;

/* ******************************
 * Get all vehicles
 * ******************************/
const getAll = async(req, res) => {
    const result = await mongodb.getDb().collection('vehicles').find();
    result.toArray().then((vehicles) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(vehicles);
    });
};

/* *******************************
 * Get single vehicle by ID
 * *******************************/
const getSingle = async(req, res) => {
    const vehicleId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('vehicles').find({_id: vehicleId });
    result.toArray().then((vehicles) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(vehicles[0]);
    });
};

/* ********************************
 * POST Create New Vehicle
 * ********************************/
const createNewVehicle = async(req, res) => {
    const newVehicle = {
        name: req.body.name,
        model: req.body.model,
        manufacturer: req.body.manufacturer,
        cost_in_credits: req.body.cost_in_credits,
        length: req.body.length,
        max_atmosphering_speed: req.body.max_atmosphering_speed,
        crew: req.body.crew,
        cargo_capacity: req.body.cargo_capacity,
        vehicle_class: req.body.vehicle_class
    };
    
    const response = await mongodb.getDb().collection('vehicles').insertOne(newVehicle);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'An error occurred while creating a vehicle')
    }
};



module.exports = { getAll, getSingle, createNewVehicle }