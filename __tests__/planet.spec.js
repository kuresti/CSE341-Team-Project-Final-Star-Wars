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
    mockRes = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 500 when database operation fails', async () => {
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

  it('should return 500 when editing a planet fails', async () => {
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

    await planetController.editPlanet(mockReq, mockRes);
    expect(mockRes.statusCode).toBe(500);
    expect(JSON.parse(mockRes._getData())).toBe('Database error occurred');
  });
});
