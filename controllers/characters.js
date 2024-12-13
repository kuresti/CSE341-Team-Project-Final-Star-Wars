const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;
const characterController = {};

characterController.isValidObjectId = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('id is not valid');
  } else {
    next();
  }
};

characterController.getAll = async (_, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .find();
    const result = await response.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch {
    res.status(500).json('An error occurred while retrieving characters.');
  }
};

characterController.findByName = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .find({ name: { $regex: req.query.name, $options: 'i' } });
    const result = await response.toArray();
    if (!result.length) {
      res.status(404).json('Character not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving characters.' });
  }
};

characterController.findByCategory = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .find({
        category: {
          $elemMatch: {
            $regex: req.query.category,
            $options: 'i'
          }
        }
      });
    const result = await response.toArray();
    if (!result.length) {
      res.status(404).json('Character not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving characters.' });
  }
};

characterController.findByAlignment = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .find({ alignment: { $regex: req.query.alignment, $options: 'i' } });
    const result = await response.toArray();
    if (!result.length) {
      res.status(404).json('Character not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving characters.' });
  }
};

characterController.getById = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .find({ _id: new ObjectId(req.params.id) });
    const result = await response.toArray();
    if (!result.length) {
      res.status(404).json('Character not found');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving characters.' });
  }
};

characterController.createCharacter = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .insertOne({
        name: req.body.name,
        alignment: req.body.alignment,
        category: req.body.category,
        homeworld: req.body.homeworld,
        vehicles: req.body.vehicles,
        ships: req.body.ships
      });
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ error: 'An error occurred while creating character.' });
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the character.' });
  }
};

characterController.updateCharacter = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .replaceOne(
        { _id: new ObjectId(req.params.id) },
        {
          name: req.body.name,
          alignment: req.body.alignment,
          category: req.body.category,
          homeworld: req.body.homeworld,
          vehicles: req.body.vehicles,
          ships: req.body.ships
        }
    );
    
    if (response.modifiedCount === 0) {
      res.status(404).json('Character not found');
    } else if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json('An error occurred while updating the character.');
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the character.' });
  }
};

characterController.deleteCharacter = async (req, res) => {
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('character')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount === 0) {
      res.status(404).json('Character not found');
    } else if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json('An error occurred while deleting the character.');
    }
  } catch {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the character.' });
  }
};

module.exports = characterController;
