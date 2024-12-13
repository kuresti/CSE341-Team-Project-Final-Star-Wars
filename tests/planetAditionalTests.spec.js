const planetController = require('../controllers/planets');
const httpMocks = require('node-mocks-http');
const { ObjectId } = require('mongodb');
const mongodb = require('../config/db');

// Mock database and controller
jest.mock('../config/db.js');

describe('Error handling with database errors', () => {
  beforeEach(() => {
    mockReq = httpMocks.createRequest({
      method: 'POST',
      url: '/planets',
      body: {
        name: 'Mars',
        is_inhabited: false,
        climate: 'Cold',
        terrain: 'Rocky',
        diameter: 6779,
        rotation_period: 24.6,
        orbital_period: 687,
        location: 'Solar System'
      }
    });
    mockReqPut = httpMocks.createRequest({
      method: 'PUT',
      url: '/planets',
      body: {
        name: 'Mars',
        is_inhabited: false,
        climate: 'Cold',
        terrain: 'Rocky',
        diameter: 6779,
        rotation_period: 24.6,
        orbital_period: 687,
        location: 'Solar System'
      }
    });

    mockRes = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 500 when database operation fails when adding a new Planet', async () => {
    mongodb.getDatabase.mockReturnValue({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue({
            acknowledged: 0,
            error: 'Database error occurred'
          })
        })
      })
    });

    await planetController.addPlanet(mockReq, mockRes);
    expect(mockRes.statusCode).toBe(500);
    expect(JSON.parse(mockRes._getData())).toBe('Database error occurred');
  });

  it('should return 204 if modifiedCount is greater than 0 and 500 otherwise', async () => {
    const mockReq = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: {
        name: 'Mars',
        is_inhabited: false,
        climate: 'Cold',
        terrain: 'Rocky',
        diameter: 6779,
        rotation_period: 24.6,
        orbital_period: 687,
        location: 'Solar System'
      }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };

    const mockDb = {
      collection: jest.fn().mockReturnThis(),
      replaceOne: jest.fn()
    };

    jest.spyOn(mongodb, 'getDatabase').mockReturnValue({
      db: () => mockDb
    });

    // Test case 1: modifiedCount > 0
    mockDb.replaceOne.mockResolvedValueOnce({ modifiedCount: 1 });
    await planetController.editPlanet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();

    // Reset mockRes for the next test
    mockRes.status.mockClear();
    mockRes.send.mockClear();
    mockRes.json.mockClear();

    // Test case 2: modifiedCount === 0
    mockDb.replaceOne.mockResolvedValueOnce({ modifiedCount: 0 });
    await planetController.editPlanet(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      'some error occurred while updating the planet'
    );
  });

  // Successfully insert planet with all valid required fields
  it('should return 204 status when planet is successfully inserted', async () => {
    const mockReq = {
      body: {
        name: 'Mars',
        is_inhabited: false,
        climate: 'Cold',
        terrain: 'Rocky',
        diameter: 6779,
        rotation_period: 24.6,
        orbital_period: 687,
        location: 'Solar System'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };

    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: 1 });
    const mockCollection = { insertOne: mockInsertOne };
    const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
    jest.spyOn(mongodb, 'getDatabase').mockReturnValue({ db: () => mockDb });

    await planetController.addPlanet(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  // Successfully delete existing planet and return 204 status code
  it('should return 204 status code when deleting existing planet', async () => {
    const mockReq = {
      params: {
        id: '507f1f77bcf86cd799439011'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };

    const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const mockCollection = { deleteOne: mockDeleteOne };
    const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };

    jest.spyOn(mongodb, 'getDatabase').mockReturnValue({
      db: () => mockDb
    });

    await planetController.deletePlanet(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });

  // Non-existent planet ID returns 500 status code
  it('should return 500 status code when planet ID does not exist', async () => {
    const mockReq = {
      params: {
        id: '507f1f77bcf86cd799439011'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };

    const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });
    const mockCollection = { deleteOne: mockDeleteOne };
    const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };

    jest.spyOn(mongodb, 'getDatabase').mockReturnValue({
      db: () => mockDb
    });

    await planetController.deletePlanet(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      'some error occurred while deleting a planet'
    );
  });
  // Valid location query returns matching planets array
  it('should return matching planets when valid location is provided', async () => {
    const mockPlanets = [
      { name: 'Mars', location: 'Solar System' },
      { name: 'Venus', location: 'Solar System' }
    ];

    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(mockPlanets)
    };

    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    jest.spyOn(mongodb, 'getDatabase').mockReturnValue({
      db: jest.fn().mockReturnValue(mockDb)
    });

    const req = { query: { location: 'Solar System' } };
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await planetController.getPlanetByLocation(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPlanets);
  });
});
