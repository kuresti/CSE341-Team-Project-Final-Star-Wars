const mongodb = require('../config/db');
const { app, server } = require('../server');
const request = require('supertest');

describe('Test Characters routes', () => {
  beforeAll(async () => {
    await new Promise((resolve) => mongodb.initDb(resolve));
  });
  afterAll(async () => {
    if (server) {
      server.close();
    }

    const db = mongodb.getDatabase();
    if (db) {
      await db.close();
    }
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  });

  // test('Test POST /characters/', async () => {
  //   const response = await request(app)
  //     .post('/characters')
  //     .send({
  //       name: 'Padme Amidala',
  //       alignment: 'Light',
  //       category: ['Human', 'Galactic Republic'],
  //       vehicles: [],
  //       ships: [],
  //       homeworld: 'Naboo'
  //     });
  //   expect(response.statusCode).toEqual(204);
  //   expect(response.headers['content-type']).toBeUndefined();
  // });

  test('Test GET /characters/', async () => {
    const response = await request(app).get('/characters');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  test('Test GET /characters/:id', async () => {
    const characters = await request(app).get('/characters');
    const charId = characters.body[0]._id;

    const response = await request(app).get(`/characters/${charId}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  test('Test GET/characters/findByAlignment', async () => {
    const response = await request(app).get('/characters?alignment=light');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  test('Test GET/characters/findByCategory', async () => {
    const response = await request(app).get('/characters?category=human');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  test('Test GET/characters/findByName', async () => {
    const response = await request(app).get('/characters?name=padme');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toBeDefined();
    expect(response.headers['content-type']).toEqual(
      'application/json; charset=utf-8'
    );
  });

  // test('Test PUT /characters/', async () => {
  //   const characters = await request(app).get('/characters');
  //   const charId = characters.body.at(-1)._id;

  //   const response = await request(app)
  //     .put(`/characters/${charId}`)
  //     .send({
  //       name: 'R2-D2',
  //       alignment: 'Light',
  //       category: ['Droid', 'Rebel'],
  //       vehicles: [],
  //       ships: [],
  //       homeworld: 'Naboo'
  //     });
  //   expect(response.statusCode).toEqual(204);
  //   expect(response.headers['content-type']).toBeUndefined();
  // });

  //   test('Test DELETE /characters/', async () => {
  //     const characters = await request(app).get('/characters');
  //     const charId = characters.body.at(-1)._id;

  //     const response = await request(app).delete(`/characters/${charId}`);
  //     expect(response.statusCode).toEqual(204);
  //     expect(response.headers['content-type']).toBeUndefined();
  //   });
});
