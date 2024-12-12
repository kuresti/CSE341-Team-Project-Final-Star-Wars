const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

/* ******************************
 * Return an array of all the ships
 * ******************************/
const getAll = async (req, res) => {
  //#swagger.tags=['Ships']
  //#swagger.summary='Get array of ships'
  //#swagger.description = 'Returns an array of all the ships in the collection'

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('ship')
    .find()
    .toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

/* ******************************
 * Return an array of all the ships where the search string exists in the given parameter
 * Can search by name and/or starship_class
 * If both searches are null it will return all ships
 * ******************************/
const getListBySearch = async (req, res) => {
  //#swagger.tags=['Ships']
  //#swagger.summary='Search for ships by name or starship class'
  //#swagger.description = 'Returns an array of ships that contain the search string in the given field(s)'

  const { name, starship_class } = req.query;

  const filter = {};
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  if (starship_class) {
    filter.starship_class = { $regex: starship_class, $options: 'i' };
  }

  const results = await mongodb
    .getDatabase()
    .db()
    .collection('ship')
    .find(filter)
    .toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(results);
};

/* ******************************
 * Return a single ship by id
 * ******************************/
const getSingle = async (req, res) => {
  //#swagger.tags=['Ships']
  //#swagger.summary='Get ship by id'
  //#swagger.description = 'Returns details of a single ship.'

  if (!ObjectId.isValid(req.params.id)) {
    //check if valid id format
    return res.status(400).json('Must use a valid id to find ship.');
  }

  const shipId = new ObjectId(req.params.id);

  const result = await mongodb
    .getDatabase()
    .db()
    .collection('ship')
    .find({ _id: shipId })
    .toArray();
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result[0]);
};

/* ******************************
 * Add a ship to the collection
 * ******************************/
const addShip = async (req, res) => {
  //#swagger.tags=['Ships']
  //#swagger.summary='Add a ship'
  //#swagger.description = 'Adds a new ship to the collection'

  const newShip = {
    name: req.body.name,
    model: req.body.model,
    length: req.body.length,
    crew: req.body.crew,
    passengers: req.body.passengers,
    cargo_capacity: req.body.cargo_capacity,
    starship_class: req.body.starship_class,
    hyperdrive_rating: req.body.hyperdrive_rating
  };

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('ship')
    .insertOne(newShip);

  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || 'An error occurred while adding the ship.');
  }
};

/* ******************************
 * Update a ship by id
 * ******************************/
const updateShip = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    //check if valid id format
    return res.status(400).json('Must use a valid id to find ship.');
  }

  const shipId = new ObjectId(req.params.id);

  const ship = {
    name: req.body.name,
    model: req.body.model,
    length: req.body.length,
    crew: req.body.crew,
    passengers: req.body.passengers,
    cargo_capacity: req.body.cargo_capacity,
    starship_class: req.body.starship_class,
    hyperdrive_rating: req.body.hyperdrive_rating
  };

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('ship')
    .replaceOne(
      {
        _id: shipId
      },
      ship
    );

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'An error occurred while updating the ship.');
  }
};

/* ******************************
 * Delete a ship by id
 * ******************************/
const deleteShip = async (req, res) => {
  //#swagger.tags=['Ships']
  //#swagger.summary='Delete a ship by Id'
  //#swagger.description = 'Delete a ship from the collection'

  if (!ObjectId.isValid(req.params.id)) {
    //check if valid id format
    return res.status(400).json('Must use a valid id to find ship.');
  }

  const shipId = new ObjectId(req.params.id);

  const response = await mongodb
    .getDatabase()
    .db()
    .collection('ship')
    .deleteOne({ _id: shipId }, true);

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'An error occurred while deleting the ship.');
  }
};

module.exports = {
  getAll,
  getListBySearch,
  getSingle,
  addShip,
  updateShip,
  deleteShip
};
