const request = require('supertest');
const { app, server } = require('../server');
const mongodb = require('../config/db');

/* *******************************
 * Wait for db initialization
 * *******************************/
beforeAll(async () => {
  await new Promise((resolve, reject) => {
    mongodb.initDb((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
});

/* *******************************
 * Cleanup server after tests
 * *******************************/
afterAll(async () => {
  if (mongodb.getDatabase) {
    await mongodb.getDatabase().close();
  }
  if (server) {
    server.close();
  }
});

/* *******************************
 * Test GET ships
 * *******************************/
describe('GET /ships', () => {
  test('should return an array of ships', async () => {
    const response = await request(app).get('/ships');

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const ship = response.body[0];
      // check that it has the required fields
      expect(ship).toHaveProperty('name');
      expect(ship).toHaveProperty('model');
      expect(ship).toHaveProperty('crew');
      expect(ship).toHaveProperty('passengers');
      expect(ship).toHaveProperty('starship_class');
    }
  });
});

/* *******************************
 * Test GET ships by Id
 * *******************************/
describe('GET /ships/:id', () => {
  test('should return a single ship by Id', async () => {
    const shipsResponse = await request(app).get('/ships');

    // if no ships in collection, skip this test
    if (shipsResponse.body.length === 0) {
      console.log('No ships available for testing.');
      expect(shipsResponse.body).toEqual([]);
      return;
    }

    const shipId = shipsResponse.body[0]._id;
    const response = await request(app).get(`/ships/${shipId}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('should return 400 for invalid ship Id format', async () => {
    const invalidId = '1234';
    const response = await request(app).get(`/ships/${invalidId}`);

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });
});

/* *******************************
 * Test GET ships by search
 * *******************************/
describe('GET /ships/search', () => {
  test('should return an array of ships with "star" in the name', async () => {
    const shipsResponse = await request(app).get('/ships');

    // if no ships in collection, skip this test
    if (shipsResponse.body.length === 0) {
      console.log('No ships available for testing.');
      expect(shipsResponse.body).toEqual([]);
      return;
    }

    const response = await request(app).get('/ships/search?name=star');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('should return an array of ships with "assault" in the starship_class', async () => {
    const shipsResponse = await request(app).get('/ships');

    // if no ships in collection, skip this test
    if (shipsResponse.body.length === 0) {
      console.log('No ships available for testing.');
      expect(shipsResponse.body).toEqual([]);
      return;
    }

    const response = await request(app).get(
      '/ships/search?starship_class=assault'
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test('should return an array of ships with "star" in the name and "assault" in the starship_class', async () => {
    const shipsResponse = await request(app).get('/ships');

    // if no ships in collection, skip this test
    if (shipsResponse.body.length === 0) {
      console.log('No ships available for testing.');
      expect(shipsResponse.body).toEqual([]);
      return;
    }

    const response = await request(app).get(
      '/ships/search?name=star&starship_class=assault'
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
