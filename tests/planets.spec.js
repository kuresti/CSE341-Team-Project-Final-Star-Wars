/************************
 * Required Resources
 ************************/
const request = require('supertest');
const { app, server } = require('../server');
const mongodb = require('../config/db');

describe('test handlers', function () {
  beforeAll(async () => {
    // Ensure the database is initialized before running tests
    await new Promise((resolve) => mongodb.initDb(resolve));
  });

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
});
