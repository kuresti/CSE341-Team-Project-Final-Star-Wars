/* *******************************
 * Required Resources
 * *******************************/
const shipsController = require('../controllers/ships');
const httpMocks = require('node-mocks-http');
const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

// Mock the database function and controller
jest.mock('../config/db.js');

