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

beforeEach(() => {
    jest.clearAllMocks();
})

/* ********************************
 * Test Script for getAll vehicles
 * ********************************/
// describe what the function vehiclesCont.getAll is expected to do
describe('vehiclesCont.getAll', () => {
    it('vehiclesCont.getAll is expected to return a list of vehicles and respond with status 200', async () => {
        //Mock response for the database
    const mockVehicles = [
        {
            _id: '00000001c2bdafe808c3b184', 
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
            _id: '00000001c2bdafe808c3b185',
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
// describe what the function is expected to do
describe('vehiclesCont.getVehicleByAttribute', () => {
    // Test for single attribute query
    it('vehiclesCont.getVehicleByAttribute is expected to return a vehicle or an array of vehicles by their attributes with status 200', async () =>  {
    //Mock response for the database
    const mockVehicles = [
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
        },
        {
            _id: '00000001c2bdafe808c3b184', 
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
            _id: '00000001c2bdafe808c3b185',
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
    // Mock database methods
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
        const req = httpMocks.createRequest({
            query: { manufacturer: 'Kuat' },
        });
        const res = httpMocks.createResponse();

        // Call the function
        await vehiclesCont.getVehicleByAttribute(req, res);

        // Assertions
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockVehicles);
        expect(mockDb.db().collection).toHaveBeenCalledWith('vehicle');
        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({ manufacturer: { $regex: 'Kuat', $options: 'i' } })
        );
        expect(mockFind).toHaveBeenCalledTimes(1);
        expect(mockToArray).toHaveBeenCalledTimes(1);
    });

    /* **********************************
     * Test for multiple attribute query
     * **********************************/
    it('vehiclesCont.getVehicleByAttribute is expected to return a vehicle or an array of vehicles by their attributes with status 200', async () =>  {
        //Mock response for the database
        const mockVehicles = [
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
            },
            {
                _id: '00000001c2bdafe808c3b184', 
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
                _id: '00000001c2bdafe808c3b185',
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
        // Mock database methods
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
            const req = httpMocks.createRequest({
                query: { name: 'AT-RT', vehicle_class: 'walker' },
            });
            const res = httpMocks.createResponse();
    
            // Call the function
            await vehiclesCont.getVehicleByAttribute(req, res);
    
            // Assertions
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(mockVehicles);
            expect(mockDb.db().collection).toHaveBeenCalledWith('vehicle');
            expect(mockFind).toHaveBeenCalledWith(
                expect.objectContaining({ 
                    name: { $regex: 'AT-RT', $options: 'i' }, 
                    vehicle_class: { $regex: 'walker', $options: 'i'},
                }),
            );
            expect(mockFind).toHaveBeenCalledTimes(1);
            expect(mockToArray).toHaveBeenCalledTimes(1);
        });

    /* **********************************
     * Test for empty query
     * **********************************/
    it('vehiclesCont.getVehicleByAttribute is expected to return an array of all vehicles in the database with status 200', async () =>  {
        //Mock response for the database
        const mockVehicles = [
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
            },
            {
                _id: '00000001c2bdafe808c3b184', 
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
                _id: '00000001c2bdafe808c3b185',
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

        // Mock database methods
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
            const req = httpMocks.createRequest({ query: {} });
            const res = httpMocks.createResponse();
    
            // Call the function
            await vehiclesCont.getVehicleByAttribute(req, res);
    
            // Assertions
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(mockVehicles);
            expect(mockDb.db().collection).toHaveBeenCalledWith('vehicle');
            expect(mockFind).toHaveBeenCalledWith({});
            expect(mockFind).toHaveBeenCalledTimes(1);
            expect(mockToArray).toHaveBeenCalledTimes(1);
        });
    
    /* **********************************
     * Test for Error handling
     * **********************************/
    it('vehiclesCont.getVehicleByAttribute should return a 500 error when the database throws an error', async () => {
        // Mock the database throwing an error
        const mockToArray = jest.fn().mockRejectedValue(new Error('Database error'));
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
            method: 'GET',
            url: '/vehicles',
            query: {
                name: 'AT-RT',
            }
        });

        const res = httpMocks.createResponse();

        // Call the function
        await vehiclesCont.getVehicleByAttribute(req, res);

        // Assertions
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            error: 'An error occurred while fetching vehicles',
            details: 'Database error',
        });
        expect(mockFind).toHaveBeenCalledWith({ name: { $regex: 'AT-RT', $options: 'i' } });
        expect(mockToArray).toHaveBeenCalledTimes(1)
    });

    /* **********************************
     * Test for PUT route
     * **********************************/
    it('should update a vehicle in the database by ID with status 204', async () => {
        // Mock PUT request
        const req = httpMocks.createRequest({
            params: { id: '00000001c2bdafe808c3b183' }, // ID in mockVehicle data
            body: {
                name: 'AT-RT',
                model: 'All Terrain Recon Transport',
                manufacturer: 'Kuat Drive Yards',
                cost_in_credits: '40000',
                length: '3.2',
                max_atmosphering_speed: "90",
                crew: '1',
                cargo_capacity: '20',
                vehicle_class: 'walker',          
            },
        });
        const res = httpMocks.createResponse();

        // Mock database connection
        const mockReplaceOne = jest.fn().mockResolvedValue({ acknowledged: true });
        const mockDb = {
                    collection: jest.fn().mockReturnValue({
                        replaceOne: mockReplaceOne,
                    }),
                 };
                    
    mongodb.getDatabase.mockReturnValue({
        db: jest.fn().mockReturnValue(mockDb),
    });

        // Call Function
        await vehiclesCont.updateVehicle(req, res);

        // Assertions
        expect(mongodb.getDatabase).toHaveBeenCalledTimes(1);
        expect(mockDb.collection).toHaveBeenCalledWith('vehicle');
        expect(mockReplaceOne).toHaveBeenCalledWith(
            { _id: expect.any(Object) },
            req.body
        );
        expect(res.statusCode).toBe(204);
        expect(res._getData()).toBe('');
    });

     /* **********************************
     * Test for PUT route error handling
     * **********************************/
    it('should return a 500 status code and error message on failure', async () => {
        const req = httpMocks.createRequest({
            params: { id: '00000001c2bdafe808c3b183' }, // ID in mockVehicle data
            body: {
                name: 'AT-RT',
                model: 'All Terrain Recon Transport',
                manufacturer: 'Kuat Drive Yards',
                cost_in_credits: '40000',
                length: '3.2',
                max_atmosphering_speed: "90",
                crew: '1',
                cargo_capacity: '20',
                vehicle_class: 'walker',          
            },
        });

        const res = httpMocks.createResponse();
        
        // Mock database replaceOne to simulate an error
        const mockReplaceOne = jest.fn().mockResolvedValue(null);
        const mockDb = {
            collection: jest.fn().mockReturnValue({
                replaceOne: mockReplaceOne,
            }),
         };
            
        mongodb.getDatabase.mockReturnValue({
            db: jest.fn().mockReturnValue(mockDb),
        });

        // Call function
        await vehiclesCont.updateVehicle(req, res);

        // Assertions
        expect(mongodb.getDatabase).toHaveBeenCalledTimes(1);
        expect(mockDb.collection).toHaveBeenCalledWith('vehicle');
        expect(mockReplaceOne).toHaveBeenCalledWith(
            { _id: expect.any(Object) },
            req.body
        );
        expect(res.statusCode).toBe(500);
        expect(res._getData()).toBe(
            JSON.stringify('An error occurred while updating the vehicle.')
        );
    });

    /* **********************************
     * Test for POST route 
     * **********************************/
    it('should return an empty body when a new vehicle is Posted to the database with a 204 status code', async ()=> {
        const req = httpMocks.createRequest({
            body: {
                name: 'AT-RT',
                model: 'All Terrain Recon Transport',
                manufacturer: 'Kuat Drive Yards',
                cost_in_credits: '40000',
                length: '3.2',
                max_atmosphering_speed: "90",
                crew: '1',
                cargo_capacity: '20',
                vehicle_class: 'walker',          
            },
        });

        const res = httpMocks.createResponse();

         // Mock database connection
         const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true });
         const mockDb = {
                     collection: jest.fn().mockReturnValue({
                         insertOne: mockInsertOne,
                     }),
                  };
                     
     mongodb.getDatabase.mockReturnValue({
         db: jest.fn().mockReturnValue(mockDb),
     });

     // Call Function
     await vehiclesCont.createNewVehicle(req, res);

     //Assertions
     expect(mongodb.getDatabase).toHaveBeenCalledTimes(1);
     expect(mockDb.collection).toHaveBeenCalledWith('vehicle');
     expect(mockInsertOne).toHaveBeenCalledWith(req.body);
     expect(res.statusCode).toBe(204);
     expect(res._getData()).toBe('');
    });

    /* **********************************
     * Test for POST route error handling
     * **********************************/
    it('should return a 500 status code and error message on failure', async () => {
        const req = httpMocks.createRequest({
            body: {
                name: 'AT-RT',
                model: 'All Terrain Recon Transport',
                manufacturer: 'Kuat Drive Yards',
                cost_in_credits: '40000',
                length: '3.2',
                max_atmosphering_speed: "90",
                crew: '1',
                cargo_capacity: '20',
                vehicle_class: 'walker',          
            },
        });

        const res = httpMocks.createResponse();

         // Mock database replaceOne to simulate an error
         const mockInsertOne = jest.fn().mockResolvedValue(null);
         const mockDb = {
             collection: jest.fn().mockReturnValue({
                 insertOne: mockInsertOne,
             }),
          };
             
         mongodb.getDatabase.mockReturnValue({
             db: jest.fn().mockReturnValue(mockDb),
         });

         // Call function
         await vehiclesCont.createNewVehicle(req, res);

         // Assertions
        expect(mongodb.getDatabase).toHaveBeenCalledTimes(1);
        expect(mockDb.collection).toHaveBeenCalledWith('vehicle');
        expect(mockInsertOne).toHaveBeenCalledWith(req.body);
        expect(res.statusCode).toBe(500);
        expect(res._getData()).toBe(
            JSON.stringify('An error occurred while creating a vehicle')
        );
    });

    /* **********************************
     * Test for DELETE route 
     * **********************************/
    


});