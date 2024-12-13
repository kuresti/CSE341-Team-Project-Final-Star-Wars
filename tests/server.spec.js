/* ************************************
 * Required Resources
 * ************************************/
const express = require('express');
//const app = express();
const httpMocks = require('node-mocks-http');
const session = require('express-session');
const { app } = require('../server');
const passport = require('passport');
const mongodb = require('../config/db');

/* ************************************
 * Mock Dependencies
 * ************************************/
jest.mock('../config/db.js', () => ({
    initDb: jest.fn(),
}));
// jest.mock('express', () => ({
//     ...jest.requireActual('express'),
//     listen: jest.fn(),
// }));
jest.mock('express-session', () => jest.fn(() => (req, res, next) => next()));
jest.mock('passport', () => ({
    initialize: jest.fn(() => (req, res, next) => next()),
    session: jest.fn(() => (req, res, next) => next()),
    use: jest.fn(),
    authenticate: jest.fn(() => (req, res, next) => {
        req.user = { displayName: 'Test User'};
        return next();
    }),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
}));

/* ************************************
 * Test Scripts
 * ************************************/
describe('Server Tests',  () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return "Logged Out" when there is no session running', async () => {
        const req = httpMocks.createRequest({ 
            method: 'GET', 
            url: '/',
            session: {},
         });
        const res = httpMocks.createResponse();

        // Call to route
        app.handle(req, res);

        // Assertions
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe('Logged Out');
    });

    it('should return user displayName when logged in', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/',
            session: {
                user: {
                    displayName: 'Test User'
                }
            },
        });
        const res = httpMocks.createResponse();

        // Call to route
       app.handle(req, res);

        // Assertions
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe('Logged in as Test User');
    });

    it('should authenticate and redirect on successful login', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/github/callback',
            session: {},
        });
        const res = httpMocks.createResponse();

        // Mock passport.authenticate
        passport.authenticate.mockImplementation((strategy, options, callback) => {
            return (req, res, next) => {
                req.user =  { displayName: 'Test User' };
                callback(null, req.user);
            };
        });

        // call to route
        app.handle(req, res);

        // Assertions
        expect(req.session.user).toEqual({ displayName: "Test User" });
        expect(res.statusCode).toBe(302);
    });

    it('Error handling middleware should return 500 on error', () => {
        const req = httpMocks.createRequest({ method: 'GET', url: '/error' });
        const res = httpMocks.createResponse();

        // Simulates an error in the app
        const next = jest.fn((err) => {
            const middleware = app._router.stack.find((layer) => layer.handle.length === 4);
            middleware.handle(err, req, res, next);
        });

        const error = new Error('Test Error');
        next(error);

        //Assertions
        expect(res.statusCode).toBe(500);
        expect(res._getData().replace(/"/g, '')).toEqual('500: Test Error');
    });

    // // Simulates a successful start of initDb
    // it('should call initDb and start the server if successful', async () => {
    //     const mockListen = jest.fn();
    //     mongodb.initDb.mockImplementation((callback) => {
    //         callback(null);
    //     });

    // // Call the function that checks for 'require.main'
    // if (require.main === module) {
    //     mongodb.initDb((err) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             mockListen(port, () => {
    //                 console.log(`Database is listening and node running on port ${port}`);
    //             });
    //         }
    //     });
    // }

    // // Assertions
    // expect(mongodb.initDb).toHaveBeenCalledTimes(1);
    // expect(mockListen).toHaveBeenCalledTimes(1);
    // expect(mockListen).toHaveBeenCalledWith(port, expect.any(Function));
    // });

    // it('should log an error if initDb fails', async () => {
    //     const mockListen = jest.fn();

    //     //Mock Failure
    //     mongodb.initDb.mockImplementation((callback) => {
    //         callback(new Error('Database connection failed'));
    //     });

    //     //Call function to check for require.main
    //     if (require.main === module) {
    //         mongodb.initDb((err) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 mockListen(port, () => {
    //                     console.log(`Database is listening and node running on port ${port}`);
    //                 });
    //             }
    //         });
    //     }

    //     //Assertions
    //     expect(mongodb.initDb).toHaveBeenCalledTimes(1);
    //     expect(mockListen).toHaveBeenCalledTimes(0);
    // });
});
