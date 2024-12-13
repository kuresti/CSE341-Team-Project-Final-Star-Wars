/* *******************************
 * Required Resources
 * *******************************/
const shipsController = require('../controllers/ships');
const httpMocks = require('node-mocks-http');
const mongodb = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

// Mock the database function and controller
jest.mock('../config/db.js');

// Create an array of sample data to be used for testing
const mockShips = [
  {
    _id: '674f5b96baff3b3ddcee0697',
    name: 'Star Destroyer',
    model: 'Imperial I-class Star Destroyer',
    length: 1600,
    crew: '47,060',
    passengers: 'n/a',
    cargo_capacity: 36000000,
    starship_class: 'Star Destroyer',
    hyperdrive_rating: 2
  },
  {
    _id: '674f8adbf224bfa60d3892e3',
    name: 'Millennium Falcon',
    model: 'YT-1300 light freighter',
    length: 34.37,
    crew: '4',
    passengers: '6',
    cargo_capacity: 100000,
    starship_class: 'Light freighter',
    hyperdrive_rating: 0.5
  },
  {
    _id: '674f8b88740e335913d45c6a',
    name: 'Y-wing',
    model: 'BTL Y-wing',
    length: 14,
    crew: '2',
    passengers: '0',
    cargo_capacity: 110,
    starship_class: 'assault starfighter',
    hyperdrive_rating: 1.0
  },
  {
    _id: '674f8c2d740e335913d45c6c',
    name: 'X-wing',
    model: 'T-65 X-wing',
    length: 12.5,
    crew: '1',
    passengers: '0',
    cargo_capacity: 110,
    starship_class: 'starfighter',
    hyperdrive_rating: 1.0
  }
];

/* **********************************
 * Test Script for GET all ships
 * **********************************/
describe('GET /ships', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return all ships', async () => {
    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue(mockShips);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock the database connection
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
    await shipsController.getAll(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockShips);
  });
});

/* **********************************
 * Test Script for GET ships by Id
 * **********************************/
describe('GET /ships/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a single ship if the id is valid and exists', async () => {
    // Create a variable with a single ship
    const mockShip = mockShips[0];
    // Create a variable with id of ship
    const mockShipId = mockShips[0]._id;

    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue([mockShip]);
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
      params: { id: mockShipId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.getSingle(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockShip);
  });

  test('should return a status 400 if the id is invalid', async () => {
    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      params: { id: 'invalidId' }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.getSingle(req, res);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toBe('Must use a valid id to find ship.');
  });
});

/* **********************************
 * Test Script for GET getListBySearch
 * **********************************/
describe('GET /ships/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return ships filtered by name', async () => {
    // Create an array of expected results from mock data
    const mockShipsResponse = mockShips.filter((ship) =>
      ship.name.toLowerCase().includes('wing')
    );
    // Create an array of mock database information
    const mockToArray = jest.fn().mockResolvedValue(mockShipsResponse);
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
      query: { name: 'wing' }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.getListBySearch(req, res);

    // Assertions
    expect(mockFind).toHaveBeenCalledWith({
      name: { $regex: 'wing', $options: 'i' }
    });
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockShipsResponse);
  });

  test('should return ships filtered by starship_class', async () => {
    const mockShipsResponse = mockShips.filter((ship) =>
      ship.starship_class.toLowerCase().includes('star')
    );
    const mockToArray = jest.fn().mockResolvedValue(mockShipsResponse);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest({
      query: { starship_class: 'star' }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.getListBySearch(req, res);

    // Assertions
    expect(mockFind).toHaveBeenCalledWith({
      starship_class: { $regex: 'star', $options: 'i' }
    });
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockShipsResponse);
  });

  test('should return empty array if no results are found', async () => {
    const mockShipsResponse = mockShips.filter((ship) =>
      ship.name.toLowerCase().includes('no-match')
    );
    const mockToArray = jest.fn().mockResolvedValue(mockShipsResponse);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest({
      query: { name: 'no-match' }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.getListBySearch(req, res);

    // Assertions
    expect(mockFind).toHaveBeenCalledWith({
      name: { $regex: 'no-match', $options: 'i' }
    });
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual([]);
  });

  test('should return all ships if no filters given', async () => {
    const mockShipsResponse = mockShips.filter((ship) =>
      ship.name.toLowerCase().includes('')
    );
    const mockToArray = jest.fn().mockResolvedValue(mockShipsResponse);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ find: mockFind })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    const req = httpMocks.createRequest({
      query: {}
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.getListBySearch(req, res);

    // Assertions
    expect(mockFind).toHaveBeenCalledWith({});
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Content-Type')).toBe('application/json');
    expect(res._getJSONData()).toEqual(mockShips);
  });
});

/* **********************************
 * Test Script for POST ships
 * **********************************/
describe('POST /ships', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add a new ship and return status 201', async () => {
    // Mock ship data to add
    const newShip = {
      name: 'New Ship',
      model: 'Sample Model',
      length: 100,
      crew: '10',
      passengers: '100',
      cargo_capacity: 250000,
      starship_class: 'Starship',
      hyperdrive_rating: 2.0
    }
  
    // Mock database insertOne response
    const mockInsertOne = jest.fn().mockResolvedValue({
      acknowledged: true,
      insertedId: '674f9d2e4bf3fa7cc7d47b00'
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
      body: newShip
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.addShip(req, res);

    // Assertions
    expect(mockInsertOne).toHaveBeenCalledWith(newShip);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      acknowledged: true,
      insertedId: '674f9d2e4bf3fa7cc7d47b00'
    });
  })

  test('should return status 500 if database insert failed', async () => {
    // Mock ship data to add
    const newShip = {
      name: 'New Ship',
      model: 'Sample Model',
      length: 100,
      crew: '10',
      passengers: '100',
      cargo_capacity: 250000,
      starship_class: 'Starship',
      hyperdrive_rating: 2.0
    }

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
      body: newShip
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.addShip(req, res);

    // Assertions
    expect(mockInsertOne).toHaveBeenCalledWith(newShip);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toBe('An error occurred while adding the ship.');
  })
})

/* **********************************
 * Test Script for PUT ships
 * **********************************/
describe('PUT /ships/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update a ship and return status 204', async () => {
    // Mock ship data to update
    const mockShipId = '674f9d2e4bf3fa7cc7d47b00';
    const updatedShip = {
      name: 'Updated Ship',
      model: 'Sample Model',
      length: 100,
      crew: '10',
      passengers: '100',
      cargo_capacity: 250000,
      starship_class: 'Starship',
      hyperdrive_rating: 2.0
    }
  
    const mockReplaceOne = jest.fn().mockResolvedValue({ modifiedCount: 1 })

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ replaceOne: mockReplaceOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: mockShipId },
      body: updatedShip
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.updateShip(req, res);

    // Assertions
    expect(mockReplaceOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockShipId) },
      updatedShip
    );
    expect(res.statusCode).toBe(204);
    expect(res._getData()).toEqual('');
  })

  test('should return status 400 for invalid ship Id', async () => {
    // Mock ship data to update
    const updatedShip = {
      name: 'Updated Ship',
      model: 'Sample Model',
      length: 100,
      crew: '10',
      passengers: '100',
      cargo_capacity: 250000,
      starship_class: 'Starship',
      hyperdrive_rating: 2.0
    }

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 'invalidId' },
      body: updatedShip
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.updateShip(req, res);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toBe('Must use a valid id to find ship.');
  }) 

  test('should return status 500 if database update failed', async () => {
    // Mock ship to update
    const mockShipId = '674f9d2e4bf3fa7cc7d47b00';
    const updatedShip = {
      name: 'Updated Ship',
      model: 'Sample Model',
      length: 100,
      crew: '10',
      passengers: '100',
      cargo_capacity: 250000,
      starship_class: 'Starship',
      hyperdrive_rating: 2.0
    }

    // Mock database replaceOne respone
    const mockReplaceOne = jest.fn().mockResolvedValue({
      modifiedCount: 0
    })

    // Mock the database connection
    const mockDb = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ replaceOne: mockReplaceOne })
      })
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: mockShipId },
      body: updatedShip
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.updateShip(req, res);

    // Assertions
    expect(mockReplaceOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockShipId) },
      updatedShip
    );
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toBe('An error occurred while updating the ship.');
  })
})

/* **********************************
 * Test Script for DELETE ships
 * **********************************/
describe('DELETE /ships/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete a ship and return status 204', async () => {
    const mockShipId = '674f9d2e4bf3fa7cc7d47b00';

    const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

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
      params: { id: mockShipId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.deleteShip(req, res);

    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: new ObjectId(mockShipId) }, true);
    expect(res.statusCode).toBe(204);
    expect(res._getData()).toEqual('');
  })

  test('should return status 400 for invalid ship Id', async () => {
    
    // Mock HTTP req and res
    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: 'invalidId' }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.deleteShip(req, res);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toBe('Must use a valid id to find ship.');
  }) 

  test('should return status 500 if database delete failed', async () => {
    // Mock ship to delete
    const mockShipId = '674f9d2e4bf3fa7cc7d47b00';
    
    // Mock database replaceOne respone
    const mockDeleteOne = jest.fn().mockResolvedValue({
      deletedCount: 0
    })

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
      params: { id: mockShipId }
    });
    const res = httpMocks.createResponse();

    // Call the function
    await shipsController.deleteShip(req, res);

    // Assertions
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: new ObjectId(mockShipId) }, true);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toBe('An error occurred while deleting the ship.');
  })
})