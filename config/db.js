/*****************************************
 * Required Assets
 ****************************************/
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// Variable to hold the database connection
let database;

/***************************************
 * Initializes the database connection
 ***************************************/
const initDb = async (callback) => {
  if (database) {
    console.log('Database is already initialized');
    return callback(null, database);
  }

  try {
    const client = await MongoClient.connect(process.env.MONGO_URL);
    database = client;
    callback(null, database)

  } catch (err) {
    callback(err)
  }

};

/*************************************
 * Retrieves the initialized database connection
 *************************************/
const getDatabase = () => {
  if (!database) {
    throw Error();
  }
  return database;
};

module.exports = { initDb, getDatabase };
