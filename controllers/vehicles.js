/* ******************************
 * Required Resources
 * ******************************/
const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

/* ******************************
 * Get all vehicle
 * ******************************/
const getAll = async (req, res) => {
  //#swagger.tags['Vehicles']
  //#swagger.summary='GET all vehicles'
  //#swagger.description='Fetches all vehicles currently in the database.'
  const result = await mongodb.getDatabase().db().collection('vehicle').find();
  result.toArray().then((vehicle) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(vehicle);
  });
};

/* *******************************
 * Get single vehicle by ID
 * *******************************/
const getSingle = async (req, res) => {
  //#swagger.tags['Vehicles']
  //#swagger.summary='GET a single vehicle'
  //#swagger.description='Fetches a single vehicle by vehicle_id'
  const vehicleId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('vehicle')
    .find({ _id: vehicleId });
  result.toArray().then((vehicle) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(vehicle[0]);
  });
};

/* ********************************
 * GET Vehicle by vehicle_class,
 * manufacturer, or name
 * ********************************/
const getVehicleByAttribute = async (req, res) => {
  //#swagger.tags['Vehicles']
  //#swagger.summary='Retrieve vehicles by attribute'
  //#swagger.description='Fetches vehicles from the database using attribute names as search criteria, name, model, manufacturer, and vehicle_class

  const { name, model, manufacturer, vehicle_class } = req.query;

  const filter = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }
  if (model) {
    filter.model = { $regex: model, $options: 'i' };
  }
  if (manufacturer) {
    filter.manufacturer = { $regex: manufacturer, $options: 'i' };
  }
  if (vehicle_class) {
    filter.vehicle_class = { $regex: vehicle_class, $options: 'i' };
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('vehicle')
      .find(filter)
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching vehicles',
      details: error.message
    });
  }
};

/* ********************************
 * POST Create New Vehicle
 * ********************************/
const createNewVehicle = async (req, res) => {
  //#swagger.tags['Vehicles']
  //#swagger.summary='POST new vehicle to the database'
  //#swagger.description='Adds a new vehicle with attributes to the database'
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
    .collection('vehicle')
    .insertOne(newVehicle);
  if (response && response.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json((response && response.error)|| 'An error occurred while creating a vehicle');
  }
};

/* *********************************
 * PUT Update Vehicle by ID
 * *********************************/
const updateVehicle = async (req, res) => {
  //#swagger.tags['Vehicles']
  //#swagger.summary='PUT or updates vehicle by id'
  //#swagger.description='Updates vehicle and its attributes by the vehicle id'
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
    .collection('vehicle')
    .replaceOne({ _id: vehicleId }, vehicle);
  if (response && response.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json((response && response.error) || 'An error occurred while updating the vehicle.');
  }
};

/* ************************************
 * DELETE vehicle by ID
 * ************************************/
const deleteVehicle = async (req, res) => {
  //#swagger.tags['Vehicles']
  //#swagger.summary='DELETE vehicle'
  //#swagger.description='Removes a vehicle from the database by its id.'
  try {
    //validate vehicleId
    const vehicleId = req.params.id;
    if(!vehicleId) {
      return res.status(400).json({ error: 'Vehicle Id is required'});
    }
    if (!ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ error: 'Invalid vehicle ID.' });
    }

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('vehicle')
      .deleteOne({ _id: new ObjectId(vehicleId) });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    return res.status(500).json({
      error: 'An error occurred while attempting to delete the vehicle.',
    });
  }
};


module.exports = {
  getAll,
  getSingle,
  getVehicleByAttribute,
  createNewVehicle,
  updateVehicle,
  deleteVehicle
};
