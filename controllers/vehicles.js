/* ******************************
 * Required Resources
 * ******************************/
const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

/* ******************************
 * Get all vehicles
 * ******************************/
const getAll = async (req, res) => {
  const result = await mongodb.getDatabase().db().collection('vehicles').find();
  result.toArray().then((vehicles) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(vehicles);
  });
};

/* *******************************
 * Get single vehicle by ID
 * *******************************/
const getSingle = async (req, res) => {
  const vehicleId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('vehicles')
    .find({ _id: vehicleId });
  result.toArray().then((vehicles) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(vehicles[0]);
  });
};

/* ********************************
 * POST Create New Vehicle
 * ********************************/
const createNewVehicle = async (req, res) => {
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

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('vehicles')
    .insertOne(newVehicle);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'An error occurred while creating a vehicle');
  }
};

/* *********************************
 * PUT Update Vehicle by ID
 * *********************************/
const updateVehicle = async (req, res) => {
  const vehicleId = new ObjectId(req.params.id);
  const vehicle = {
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
  const response = await mongodb
    .getDatabase()
    .db()
    .collection('vehicles')
    .replaceOne({ _id: vehicleId }, vehicle);
  if (response) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'An error occurred while updating the vehicle.');
  }
};

/* ************************************
 * DELETE vehicle by ID
 * ************************************/
const deleteVehicle = async (req, res) => {
  try {
    //validate vehicleId
    const vehicleId = req.params.id;
    if (!ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ error: 'Invalid vehicle ID.' });
    }

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('vehicles')
      .deleteOne({ _id: new ObjectId(vehicleId) });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      return res.status(400).json({ error: 'Vehicle not found.' });
    }
  } catch (err) {
    console.error('Error deleting recipe:', err);
    return res.status(500).json({
      error: 'An error occurred while attempting to delete the vehicle.'
    });
  }
};

module.exports = {
  getAll,
  getSingle,
  createNewVehicle,
  updateVehicle,
  deleteVehicle
};
