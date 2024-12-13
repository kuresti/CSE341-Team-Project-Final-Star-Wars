const httpMocks = require('node-mocks-http');
const {
  validateCharacter
} = require('../validation/characters');

describe('Character Validation', () => {
  test('validateCharacter should return 200', async () => {
    const req = httpMocks.createRequest({
      body: {
        // valid character data
        name: 'Test Character',
        alignment: 'Light',
        category: ['Human'],
        homeworld: 'The Moon',
        vehicles: [],
        ships: []
      }
    });
    const res = httpMocks.createResponse();
  
    await validateCharacter(req, res, ()=>{});
  
    expect(res.statusCode).toBe(200);
  });
});