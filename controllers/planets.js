const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

const getAllPlanets = async (req, res) => {
  //#swagger.tags=['Planets']

  const result = await mongodb.getDatabase().db().collection('planet').find();

  result.toArray().then((planets) => {
    res.setHeader('Content-type', 'application/json');
    res.status(200).json(planets);
  });
};

const getPlanet = async (req, res) => {
  //#swagger.tags=['Planets']

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

const addPlanet = async (req, res) => {
  //#swagger.tags=['Planets']

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

const editPlanet = async (req, res) => {
  //#swagger.tags=['Planets']

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

const deletePlanet = async (req, res) => {
  //#swagger.tags=['Planets']

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

module.exports = {
  getAllPlanets,
  getPlanet,
  addPlanet,
  editPlanet,
  deletePlanet
};
