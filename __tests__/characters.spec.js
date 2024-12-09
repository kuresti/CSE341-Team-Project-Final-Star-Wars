const mongodb = require('../config/db');
const app = require('../server');
const request = require('supertest');

beforeAll(async () => {
  await mongodb.initDb(() => {});
});

describe('POST /characters', () => {
  test('Test POST /characters/', async () => {
    const response = await request(app)
      .post('/characters')
      .send({
        name: 'Padme Amidala',
        alignment: 'Light',
        category: ['Human', 'Galactic Republic'],
        homeworld: 'Naboo'
      });
    expect(response.statusCode).toEqual(204);
    expect(response.headers['content-type']).toBeUndefined();
  });
});

describe('GET /characters', () => {
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
});

describe('PUT /characters', () => {
  test('Test PUT /characters/', async () => {
    const characters = await request(app).get('/characters');
    const charId = characters.body.at(-1)._id;

    const response = await request(app)
      .put(`/characters/${charId}`)
      .send({
        name: 'R2-D2',
        alignment: 'Light',
        category: ['Droid', 'Rebel'],
        homeworld: 'Naboo'
      });
    expect(response.statusCode).toEqual(204);
    expect(response.headers['content-type']).toBeUndefined();
  });
});

describe('DELETE /characters', () => {
  test('Test DELETE /characters/', async () => {
    const characters = await request(app).get('/characters');
    const charId = characters.body.at(-1)._id;

    const response = await request(app).delete(`/characters/${charId}`);
    expect(response.statusCode).toEqual(204);
    expect(response.headers['content-type']).toBeUndefined();
  });
});
