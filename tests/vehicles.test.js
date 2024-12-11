/* *******************************
 * Required Resources
 * *******************************/
const vehiclesCont = require('../controllers/vehicles');
const httpMocks = require('node-mocks-http');
const mongodb = require('../config/db');
const { ObjectId } = require('mongodb');

/* ********************************
 * Test Scripts
 * ********************************/

// Mock the database function and controller
jest.mock('../config/db.js');

/* ********************************
 * Test Script for getAll vehicles
 * ********************************/
// describe what the function vehiclesCont.getAll is expected to do
describe('vehiclesCont.getAll', () => {
    it('vehiclesCont.getAll is expected to return a list of vehicles and respond with status 200', async () => {
        //Mock response for the database
    const mockVehicles = [
        {
            _id: '1', 
            name: 'AT-RT',
            model: 'All Terrain Recon Transport',
            manufacturer: 'Kuat Drive Yards',
            cost_in_credits: '40000',
            length: '3.2',
            max_atmosphering_speed: "90",
            crew: '1',
            cargo_capacity: '20',
            vehicle_class: 'walker'                 
        },
        {
            _id: '2',
            name: 'Clone turbo tank',
            model: 'HAVw A6 juggernaut',
            manufacturer: 'Kuat Drive Yards',
            cost_in_credits: '350000',
            length: '10.96',
            max_atmosphering_speed: "160",
            crew: '1',
            cargo_capacity: '30000',
            vehicle_class: 'wheeled walker'     
        }
    ];
    // Turns mock database information into an array
    const mockToArray = jest.fn().mockResolvedValue(mockVehicles);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

    // Mock database connection
    const mockDb = {
        db: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({ find: mockFind }),
        }),
    };
    mongodb.getDatabase.mockReturnValue(mockDb);

    // Mock HTTP req and res
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // Call Controller
    await vehiclesCont.getAll(req, res);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockVehicles);
    expect(mockDb.db().collection).toHaveBeenCalledWith('vehicle');
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockToArray).toHaveBeenCalledTimes(1);
   });
});

/* ************************************
 * Test Script for getSingle vehicle by Id
 * ************************************/
// describe what the function is expected to do
describe('vehiclesCont.getSingle', () => {
    it('vehiclesCont.getSingle is expected to return a single vehicle and its attributes by ID with status 200', async () => {
        // Mock database response
        const mockVehicle = 
            {
                _id: '00000001c2bdafe808c3b183', 
                name: 'AT-RT',
                model: 'All Terrain Recon Transport',
                manufacturer: 'Kuat Drive Yards',
                cost_in_credits: '40000',
                length: '3.2',
                max_atmosphering_speed: "90",
                crew: '1',
                cargo_capacity: '20',
                vehicle_class: 'walker'                 
            };
            
        // Mock find function
       // Turns mock database information into an array
    const mockToArray = jest.fn().mockResolvedValue([mockVehicle]);
    const mockFind = jest.fn().mockReturnValue({ toArray: mockToArray });

        // Mock database connection
        const mockDb = {
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({ find: mockFind }),
            }),
        };
        mongodb.getDatabase.mockReturnValue(mockDb);

        // Mock HTTP req and res
        const req = httpMocks.createRequest({
            params: { id: '00000001c2bdafe808c3b183' }, // ID in mockVehicle data
        });
        const res = httpMocks.createResponse();

        // Call the controller
        await vehiclesCont.getSingle(req, res);

        // Assertions
        expect(res.statusCode).toBe(200);
        expect(res.getHeader('Content-Type')).toBe('application/json');
        expect(res._getJSONData()).toEqual(mockVehicle);
        expect(mockDb.db().collection).toHaveBeenCalledWith('vehicle');
        expect(mockFind).toHaveBeenCalledWith({ _id: new ObjectId( '00000001c2bdafe808c3b183' ) }); 
        expect(mockFind).toHaveBeenCalledTimes(1);
        expect(mockToArray).toHaveBeenCalledTimes(1);
    });
});

/* **********************************
 * Test Script for GET getVehicleByAttribute
 * **********************************/
// Describe what the function is expected to do
describe('vehiclesCont.getVehicleByAttribute is expected to return a single vehicle or array of vehicles by attribute name with status 200', async () => {
    it('')
})



    


 