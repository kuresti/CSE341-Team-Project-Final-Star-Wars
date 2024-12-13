const { isAuthenticated } = require('../middleware/authenticate'); // Adjust the path to your file

describe('isAuthenticated Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { session: {} }; // Mock the request object
    res = {
      status: jest.fn().mockReturnThis(), // Mock the response object with method chaining
      json: jest.fn(), // Mock the `json` method
    };
    next = jest.fn(); // Mock the `next` function
  });

  test('should return 401 if user is not authenticated', () => {
    // Call the middleware
    isAuthenticated(req, res, next);

    // Assert the response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith('You do not have access.');
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next if user is authenticated', () => {
    // Set up authenticated user
    req.session.user = { id: 1, name: 'John Doe' };

    // Call the middleware
    isAuthenticated(req, res, next);

    // Assert `next` was called
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
