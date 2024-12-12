/************************
 * Required Resources
 ************************/
const request = require('supertest');
const { app, server } = require('../server');
const mongodb = require('../config/db');
const planetController = require('../controllers/planets');
const httpMocks = require('node-mocks-http');
const { ObjectId } = require('mongodb');

describe('test handlers', function () {
  beforeAll(async () => {
    // Ensure the database is initialized before running tests
    await new Promise((resolve) => mongodb.initDb(resolve));
  }, 10000);

  afterAll(async () => {
    // Clean up server or any lingering connections
    if (server) {
      server.close();
    }
    const db = mongodb.getDatabase();
    if (db) {
      await db.close();
    }
    await new Promise((resolve) => setTimeout(() => resolve(), 1000)); // Ensures all async operations are stopped
  });

  test('GET /planets', async () => {
    const response = await request(app).get('/planets');

    // Check the status code
    expect(response.status).toBe(200);

    // Check response body structure
    expect(Array.isArray(response.body)).toBe(true);

    // Check properties of the first planet
    const firstPlanet = response.body[0];
    expect(firstPlanet).toHaveProperty('_id');
    expect(firstPlanet).toHaveProperty('name');
    expect(firstPlanet).toHaveProperty('is_inhabited');
    expect(firstPlanet).toHaveProperty('climate');
    expect(firstPlanet).toHaveProperty('terrain');
    expect(firstPlanet).toHaveProperty('diameter');
    expect(firstPlanet).toHaveProperty('rotation_period');
    expect(firstPlanet).toHaveProperty('orbital_period');
    expect(firstPlanet).toHaveProperty('location');
  });

  test('GET by ID', async () => {
    // bad ID
    const responseBadId = await request(app).get(
      '/planets/674fae819baa535b0d51e79'
    );

    // Check the status code
    expect(responseBadId.status).toBe(400);
    expect(responseBadId.body.error).toBe('Invalid ID format');

    const responseGoodId = await request(app).get(
      '/planets/674fae819baa535b0d51e795'
    );
    expect(responseGoodId.status).toBe(200);
  });

  test('GET bad ID /planets/674fae819baa535b0d51e79', async () => {
    const response = await request(app).get('/planets/674fae819baa535b0d51e79');

    // Check the status code
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid ID format');
  });

  test('GET planets by location', async () => {
    const response = await request(app).get('/planets/?location=Outer%20Rim');

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST a new planet, PUT (change) it, and DELETE it', async () => {
    const newPlanet = {
      name: 'Earth',
      is_inhabited: true,
      climate: 'Temperate',
      terrain: 'Varied',
      diameter: 12742,
      rotation_period: 24,
      orbital_period: 365,
      location: 'Solar System'
    };

    const response = await request(app)
      .post('/planets')
      .send(newPlanet)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(204);

    // Obtaining information to change and delete
    const responseArray = await request(app).get('/planets');
    const earthObject = responseArray.body.filter((planet) => {
      return planet.name === 'Earth';
    });
    const earthId = earthObject[0]._id;

    const changePlanet = {
      name: 'Earth',
      is_inhabited: true,
      climate: 'Temperate',
      terrain: 'Varied',
      diameter: 123,
      rotation_period: 24,
      orbital_period: 365,
      location: 'Solar System in the milky way'
    };
    const changeResponse = await request(app)
      .put(`/planets/${earthId}`)
      .send(changePlanet)
      .set('Content-Type', 'application/json');

    expect(changeResponse.status).toBe(204);

    const deleteResponse = await request(app).delete(`/planets/${earthId}`);

    expect(deleteResponse.status).toBe(204);
  });
});

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
});
