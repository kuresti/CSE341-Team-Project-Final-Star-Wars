/* ************************************
 * Required Resources
 * ************************************/
const httpMocks = require('node-mocks-http');
const request = require('supertest');
const express = require('express');
const app = require('../server');
const passport = require('passport');
const mongodb = require('../config/db');

/* ************************************
 * Mock Database
 * ************************************/
jest.mock('../config/db.js');

/* ************************************
 * Test Scripts
 * ************************************/
describe('Server Tests', () => {
    it('should return "Logged Out" when no session is running', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Logged Out');
    });
});
