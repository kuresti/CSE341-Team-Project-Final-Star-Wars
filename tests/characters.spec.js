/* *******************************
 * Required Resources
 * *******************************/
const httpMocks = require('node-mocks-http');
const mongodb = require('../config/db');
const characterController = require('../controllers/characters');
const ObjectId = require('mongodb').ObjectId;

// Mock the database function and controller
jest.mock('../config/db.js');

// Create an array of sample data to be used for testing
const mockCharacters = [
  {
    _id: '674f5b96baff3b3ddcee0697',
    name: 'Padme Amidala',
    alignment: 'Light',
    category: ['Human', 'Galactic Republic'],
    vehicles: [],
    ships: [],
    homeworld: 'Naboo'
  },
  {
    _id: '674f8adbf224bfa60d3892e3',
    name: 'Jar Jar Binks',
    alignment: 'Light',
    category: ['Gungan', 'Galactic Republic'],
    vehicles: [],
    ships: [],
    homeworld: 'Naboo'
  },
  {
    _id: '674f8b88740e335913d45c6a',
    name: 'Yoda',
    alignment: 'Light',
    category: ['Jedi', 'Galactic Republic'],
    vehicles: [],
    ships: [],
    homeworld: 'Dagobah'
  },
  {
    _id: '674f8c2d740e335913d45c6c',
    name: 'Obi-Wan Kenobi',
    alignment: 'Light',
    category: ['Jedi', 'Galactic Republic'],
    vehicles: [],
    ships: [],
    homeworld: 'Stewjon'
  }
];

/* **********************************
 * Test Script for GET all ships
 * **********************************/
describe('GET /ships', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test getAll', async () => {
    const mockToArray = jest.fn().mockResolvedValue(mockCharacters);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.getAll(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockCharacters);
  });
  test('Test getAll with 500 status code', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await characterController.getAll(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual(
      'An error occurred while retrieving characters.'
    );
  });

  test('Test getById', async () => {
    // Create a variable with a single ship
    const mockCharacter = mockCharacters[0];
    // Create a variable with id of ship
    const mockCharacterId = mockCharacters[0]._id;

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue([mockCharacter]);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.getById(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual([mockCharacter]);
  });
  test('Test getById with 404', async () => {
    // Create a variable with id of ship
    const mockCharacterId = mockCharacters[0]._id;

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue([]);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.getById(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual('Character not found');
  });
  test('Test getById with 500', async () => {
    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      params: { id: '' }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.getById(req, res);

    // Assertions
    expect(res.statusCode).toBe(500);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual({
      error: 'An error occurred while retrieving characters.'
    });
  });

  test('Test findByName', async () => {
    // Create a variable with id of ship
    const mockCharacterName = 'Padme Amidala';

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue(mockCharacters);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      query: { name: mockCharacterName }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.findByName(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockCharacters);
  });
  test('Test findByName with no results', async () => {
    // Create a variable with id of ship
    const mockCharacterName = 'Emperor Palpatine';

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue([]);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      query: { name: mockCharacterName }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.findByName(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual('Character not found');
  });
  test('Test findByName with 500 status code', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await characterController.findByName(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'An error occurred while retrieving characters.'
    });
  });

  test('Test findByCategory', async () => {
    // Create a variable with id of ship
    const mockCharacterName = 'Gungan';

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue(mockCharacters);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      query: { category: mockCharacterName }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.findByCategory(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockCharacters);
  });
  test('Test findByCategory with no results', async () => {
    // Create a variable with id of ship
    const mockCharacterName = 'Jawa';

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue([]);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      query: { category: mockCharacterName }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.findByCategory(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual('Character not found');
  });
  test('Test findByCategory with 500 status code', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await characterController.findByCategory(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'An error occurred while retrieving characters.'
    });
  });

  test('Test findByAlignment', async () => {
    // Create a variable with id of ship
    const mockCharacterName = 'Light';

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue(mockCharacters);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      query: { category: mockCharacterName }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.findByAlignment(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockCharacters);
  });
  test('Test findByCategory with no results', async () => {
    // Create a variable with id of ship
    const mockCharacterName = 'Dark';

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue([]);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      query: { category: mockCharacterName }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.findByAlignment(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual('Character not found');
  });
  test('Test findByCategory with 500 status code', async () => {
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await characterController.findByAlignment(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'An error occurred while retrieving characters.'
    });
  });

  test('Test isValidObjectId with invalid id', async () => {
    const mockCharacterId = '--';

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    characterController.isValidObjectId(req, res);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual('id is not valid');
  });
  test('Test isValidObjectId with valid id', async () => {
    const mockCharacterId = mockCharacters[0]._id;

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Call the function
    characterController.isValidObjectId(req, res, next);

    // Assertions
    expect(res.statusCode).toBe(200);
  });
});

describe('POST /characters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add a new character and return status 201', async () => {
    // Mock character data to add
    const newCharacter = {
      name: 'New Character',
      alignment: 'Neutral',
      category: ['Human'],
      homeworld: 'Earth',
      vehicles: [],
      ships: []
    };

    // Mock database insertOne response
    const mockInsertOne = jest.fn().mockResolvedValue({
      acknowledged: true
    });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ insertOne: mockInsertOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'POST',
      body: newCharacter
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.createCharacter(req, res);

    // Assertions
    expect(mockInsertOne).toHaveBeenCalledWith(newCharacter);
    expect(res.statusCode).toBe(204);
  });
  test('should add a new character and return status 201', async () => {
    // Mock character data to add
    const newCharacter = {
      name: 'New Character',
      alignment: 'Neutral',
      category: ['Human'],
      homeworld: 'Earth',
      vehicles: [],
      ships: []
    };

    // Mock database insertOne response
    const mockInsertOne = jest.fn().mockResolvedValue({
      acknowledged: false
    });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ insertOne: mockInsertOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'POST',
      body: newCharacter
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.createCharacter(req, res);

    // Assertions
    expect(mockInsertOne).toHaveBeenCalledWith(newCharacter);
    expect(res.statusCode).toBe(500);
  });
  test('should return status 500 if database insert failed', async () => {
    // Mock character data to add
    const newCharacter = {
      name: 'New Character',
      alignment: 'Neutral',
      category: ['Human'],
      homeworld: 'Earth',
      vehicles: [],
      ships: []
    };

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'POST',
      body: newCharacter
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.createCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(500);
  });
});

describe('PUT characters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update a character and return status 204', async () => {
    // Mock character data to update
    const mockCharacterId = mockCharacters[0]._id;
    const updatedCharacter = {
      name: 'Updated Character',
      alignment: 'Good',
      category: ['Human'],
      homeworld: 'Earth',
      vehicles: [],
      ships: []
    };

    // Mock database updateOne response
    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ replaceOne: mockUpdateOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: mockCharacterId },
      body: updatedCharacter
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.updateCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(204);
  });
  test('should update a character and return status 404', async () => {
    // Mock character data to update
    const mockCharacterId = new ObjectId();
    const updatedCharacter = {
      name: 'Updated Character',
      alignment: 'Good',
      category: ['Human'],
      homeworld: 'Earth',
      vehicles: [],
      ships: []
    };

    // Mock database updateOne response
    const mockUpdateOne = jest
      .fn()
      .mockResolvedValue({ acknowledged: true, modifiedCount: 0 });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ replaceOne: mockUpdateOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: mockCharacterId },
      body: updatedCharacter
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.updateCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
  });
  test('should update a character and return status 500', async () => {
    // Mock character data to update
    const mockCharacterId = mockCharacters[0]._id;
    const updatedCharacter = {
      name: 'Updated Character',
      alignment: 'Good',
      category: ['Human'],
      homeworld: 'Earth',
      vehicles: [],
      ships: []
    };

    // Mock database updateOne response
    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: false });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ replaceOne: mockUpdateOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: mockCharacterId },
      body: updatedCharacter
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.updateCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(500);
  });
  test('should update a character and return status 500', async () => {
    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: ''
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: '' },
      body: {}
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.updateCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(500);
  });
});

describe('DELETE characters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a character and return status 204', async () => {
    const mockCharacterId = mockCharacters[0]._id;

    // Mock database deleteOne response
    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ deleteOne: mockDeleteOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.deleteCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(204);
  });

  test('should delete a character and return status 404', async () => {
    const mockCharacterId = new ObjectId();

    // Mock database deleteOne response
    const mockDeleteOne = jest
      .fn()
      .mockResolvedValue({ acknowledged: true, deletedCount: 0 });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ deleteOne: mockDeleteOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.deleteCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(404);
  });
  test('should delete a character and return status 500', async () => {
    const mockCharacterId = new ObjectId();

    // Mock database deleteOne response
    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: false });

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ deleteOne: mockDeleteOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: mockCharacterId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.deleteCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(500);
  });
  test('should delete a character and return status 500', async () => {
    // Mock the database connection
    const mockDb = {
      db: ''
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'DELETE'
    });
    const res = httpMocks.createResponse();

    // Call the function
    await characterController.deleteCharacter(req, res);

    // Assertions
    expect(res.statusCode).toBe(500);
  });
});
