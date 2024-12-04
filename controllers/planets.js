const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

/*****************************
 * Returns all planets
 *****************************/
const getAllPlanets = async (req, res) => {
  //#swagger.tags=['Planets']
  //#swagger.summary='Retrieve all planets'
  //#swagger.description ='Fetches a list of all planets from the database and returns them as a JSON array.'

  const result = await mongodb.getDatabase().db().collection('planet').find();

  result.toArray().then((planets) => {
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(planets);
  });
};

/***********************************
 * Returns a specific planet by ID
 **********************************/
const getPlanet = async (req, res) => {
  //#swagger.tags=['Planets']
  //#swagger.summary='Retrieve a planet by ID'
  //#swagger.description ='Fetches a specific planet from the database using its unique ID and returns it as a JSON object.'

  const planetId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('planet')
    .find({ _id: planetId });

  result.toArray().then((planet) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(planet[0]);
  });
};

/*****************
 * Adds a planet
 *****************/
const addPlanet = async (req, res) => {
  //#swagger.tags=['Planets']
  //#swagger.summary='Add a new planet'
  //#swagger.description ='Inserts a new planet into the database using the data provided in the request body.'

  const planet = {
    name: req.body.name,
    is_inhabited: req.body.is_inhabited,
    climate: req.body.climate,
    terrain: req.body.terrain,
    diameter: req.body.diameter,
    rotation_period: req.body.rotation_period,
    orbital_period: req.body.orbital_period,
    location: req.body.location
  };

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('planet')
    .insertOne(planet);

  if (0 < result.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || 'some error occurred while adding a new planet');
  }
};

/**********************
 * Edit a planet by ID
 **********************/
const editPlanet = async (req, res) => {
  //#swagger.tags=['Planets']
  //#swagger.summary='Edit a planet by ID'
  //#swagger.description ='Updates the details of an existing planet in the database using its unique ID and the data provided in the request body.'

  const planet = {
    name: req.body.name,
    is_inhabited: req.body.is_inhabited,
    climate: req.body.climate,
    terrain: req.body.terrain,
    diameter: req.body.diameter,
    rotation_period: req.body.rotation_period,
    orbital_period: req.body.orbital_period,
    location: req.body.location
  };

  const planetId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('planet')
    .replaceOne({ _id: planetId }, planet);

  if (0 < result.modifiedCount) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || 'some error occurred while updating the planet');
  }
};

/*****************************
 * Deletes a planet by ID
 *****************************/
const deletePlanet = async (req, res) => {
  //#swagger.tags=['Planets']
  //#swagger.summary='Delete a planet by ID'
  //#swagger.description ='Removes a planet from the database using its unique ID.'

  const planetId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('planet')
    .deleteOne({ _id: planetId }, true);

  if (0 < result.deletedCount) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || 'some error occurred while deleting a planet');
  }
};

/********************************
 * Gets planets based on location
 ********************************/
const getPlanetByLocation = async (req, res) => {
  //#swagger.tags=['Planets']
  //#swagger.summary='Retrieve planets by location'
  //#swagger.description ='Fetches planets from the database that match the specified location, using a search.'

  const { location } = req.query;

  const filter = {
    location: { $regex: location, $options: 'i' }
  };

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('planet')
    .find(filter);
  result.toArray().then((planets) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(planets);
  });
};

module.exports = {
  getAllPlanets,
  getPlanet,
  addPlanet,
  editPlanet,
  deletePlanet,
  getPlanetByLocation
};
