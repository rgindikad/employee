const server = require('./index.js');
const supertest = require('supertest');

var token;

//generate token
beforeAll(async () => {
    const res = await supertest(server)
        .get('/')
        .auth('test', 'test123')        
    token = res.body.token;    
  });

describe('token generation success Endpoints', () => {

    it('GET / should create a token', async () => {
        const res = await supertest(server)
        .get('/')
        .auth('test', 'test123')        
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('token')        
    });  
  });

describe('token generation failed Endpoints : invalid credentials', () => {

    it('GET / should not create a token', async () => {
        const res = await supertest(server)
        .get('/')
        .auth('', 'test123')        
        expect(res.status).toEqual(401);
        expect(res.type).toEqual(expect.stringContaining('text'));
        expect(res.text).toEqual('Invalid credentials. Please provide valid credentials.')        
    });  
  });

describe('token generation failed Endpoints : credentials not provided', () => {

    it('GET / should not create a token', async () => {
        const res = await supertest(server)
        .get('/')
        expect(res.status).toEqual(401);
        expect(res.type).toEqual(expect.stringContaining('text'));
        expect(res.text).toEqual('No credentials provided')        
    });  
  });

describe('delete employee failed Endpoints', () => {

    it('DELETE /employee/delete should not delete employee', async () => {
        const res = await supertest(server)
        .delete('/employee/delete/test')
        .auth('test', 'test123')
        .set('x-access-token', token);
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('text'));
        expect(res.text).toEqual('employee is not found')        
    });  
  });

describe('add employee failed Endpoints', () => {

    it('POST /employee/add should not add employee', async () => {
        const res = await supertest(server)
        .post('/employee/add')
        .auth('test', 'test123')
        .set('x-access-token', token)
        .send({
            name: 'Ishak',
            salary: '90000',
            currency: 'USD',
            department: '',
            on_contract: 'true',
            sub_department: 'solution'
          });  
          expect(res.status).toEqual(400);
          expect(res.type).toEqual(expect.stringContaining('json'));
          expect(res.body).toEqual({
            errors: [{
                location: 'body', 
                msg: 'department field should be valid string', 
                param: 'department', 
                value: ''
            }]
        }) 
    });  
  });  

describe('add employee failed Endpoints', () => {

    it('POST /employee/add should not add employee', async () => {
        const res = await supertest(server)
        .post('/employee/add')
        .auth('test', 'test123')
        .set('x-access-token', token)
        .send({
            name: '',
            salary: '90000',
            currency: 'USD',
            department: 'Engineering',
            on_contract: 'true',
            sub_department: 'solution'
          });  
          expect(res.status).toEqual(400);
          expect(res.type).toEqual(expect.stringContaining('json'));
          expect(res.body).toEqual({
            errors: [{
                location: 'body', 
                msg: 'name field should be valid string', 
                param: 'name', 
                value: ''
            }]
        }) 
    });  
  });  

describe('add employee failed Endpoints', () => {

    it('POST /employee/add should not add employee', async () => {
        const res = await supertest(server)
        .post('/employee/add')
        .auth('test', 'test123')
        .set('x-access-token', token)
        .send({
            name: 'Isahak',
            salary: '',
            currency: 'USD',
            department: 'Engineering',
            on_contract: 'true',
            sub_department: 'solution'
          });  
          expect(res.status).toEqual(400);
          expect(res.type).toEqual(expect.stringContaining('json'));
          expect(res.body).toEqual({
            errors: [{
                location: 'body', 
                msg: 'salary field should be valid number', 
                param: 'salary', 
                value: ''
            }]
        }) 
    });  
  }); 

describe('add employee success Endpoints', () => {

    it('POST /employee/add should add employee', async () => {
        const res = await supertest(server)
        .post('/employee/add')
        .auth('test', 'test123')
        .set('x-access-token', token)
        .send({
            name: 'Ishak',
            salary: '90000',
            currency: 'USD',
            department: 'Engineering',
            on_contract: 'true',
            sub_department: 'Solution'
          });  
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('success')        
    });  
  });

describe('delete employee success Endpoints', () => {

    it('DELETE /employee/delete should delete employee', async () => {
        const res = await supertest(server)
        .delete('/employee/delete/Ishak')
        .auth('test', 'test123')
        .set('x-access-token', token);
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('text'));
        expect(res.text).toEqual('employee is deleted')        
    });  
  });

describe('get employee stat Endpoints', () => {

    it('GET /employee/SS should show employee stats', async () => {
        const res = await supertest(server)
        .get('/employee/SS')
        .auth('test', 'test123')
        .set('x-access-token', token);
        expect(res.status).toEqual(200);    
        expect(res.type).toEqual(expect.stringContaining('json')); 
        expect(res.body).toEqual([{
            
                avg: expect.any(Number),
                min: expect.any(Number),
                max: expect.any(Number)
        
        }]) 
    });  
  });

describe('get employee stat for departments Endpoints', () => {

    it('GET /employee/SS-dep should show employee stats', async () => {
        const res = await supertest(server)
        .get('/employee/SS-dep')
        .auth('test', 'test123')
        .set('x-access-token', token);
        expect(res.status).toEqual(200);    
        expect(res.type).toEqual(expect.stringContaining('json')); 
        expect(res.body).toEqual(expect.any(Object)) 
    });  
  });

describe('get employee stat for sub-departments Endpoints', () => {

    it('GET /employee/SS-subdep should show employee stats', async () => {
        const res = await supertest(server)
        .get('/employee/SS-subdep')
        .auth('test', 'test123')
        .set('x-access-token', token);
        expect(res.status).toEqual(200);    
        expect(res.type).toEqual(expect.stringContaining('json')); 
    });  
  });

describe('get employee stat for sub-departments Endpoints', () => {

    it('GET /employee/SS-oncontract should show employee stats', async () => {
        const res = await supertest(server)
        .get('/employee/SS-oncontract')
        .auth('test', 'test123')
        .set('x-access-token', token);
        expect(res.status).toEqual(200);    
        expect(res.type).toEqual(expect.stringContaining('json')); 
    });  
  });

describe('invalid token Endpoints', () => {

    it('GET /employee/SS-oncontract should show employee stats', async () => {
        const res = await supertest(server)
        .get('/employee/SS-oncontract')
        .auth('test', 'test123')
        expect(res.status).toEqual(200);    
        expect(res.type).toEqual(expect.stringContaining('json')); 
    });  
  });

