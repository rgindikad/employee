const express = require('express')
const bodyParser = require('body-parser');
var fs = require('fs');
const path = require('path')
const {body, checkSchema, validationResult} = require('express-validator');
const { stringify } = require('querystring');
const basicAuth = require('express-basic-auth')
const jwt = require("jsonwebtoken");
require("dotenv").config();
//const jwt = require('njwt')

//define schema for data validation
const employeeSchema = {
  name: {
    notEmpty: true,
    type: stringify,
    errorMessage: "user field should be alid string"
  },
  salary: {
    notEmpty: true,
    type: Number,
    errorMessage: "salary field should be valid number"    
  },
  currency: {
    notEmpty: true,
    type: stringify,
    errorMessage: "currency field should be alid string"
  },
  department: {
    notEmpty: true,
    type: stringify,
    errorMessage: "department field should be alid string"    
  },
  sub_department: {
    notEmpty: true,
    type: stringify,
    errorMessage: "sub-department field should be alid string"  
  }
}

  //const claims = { iss: 'test123', sub: 'test' }
  const token = jwt.sign(
    { user_id: 'test' },
    'Secret_key',
    {
      expiresIn: "2h",
    }
  );
  console.log(token);

const app = express();
app.use(basicAuth({
  users: { 'test': 'test123' },
  unauthorizedResponse: getUnauthorizedResponse
}))

//unauthorized response
function getUnauthorizedResponse(req) {
  return req.auth
      ? ('Invalid credentials. Please provide valid credentials.')
      : 'No credentials provided'
}


const port = 3000;

var employees;

//read json file
fs.readFile("dataset.json", function(err, data) {
      
  // Check for errors
  if (err) throw err;
 
  // Converting to JSON
  employees = JSON.parse(data);
    
  console.log(employees); // Print employees 
});

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validate = validations => {
  return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
          return next();
      }

      res.status(400).json({
          errors: errors.array()
      });
  };
};

//Add new employee
app.post('/employee/add', isAuthorized, validate(checkSchema(employeeSchema)), (req, res) => {
  var newEmp = {...req.body}
  employees = [ ...employees, newEmp]
  console.log(employees);
  
  fs.writeFile("dataset.json", JSON.stringify(employees, null, 2), (err, result) => {
    if (err) {
        return console.error(err);
    } else {
        console.log("Success");
    }

  });
  res.status(200).json({
    success: true,
    message: 'employee is added to the database',    
  });
});

//delete employee
app.delete('/employee/delete/:name', isAuthorized, function(req, res) {  
  const name = req.params.name;
  const deletedEmp = employees.find(p => p.name === name);
  if (deletedEmp == null) {
    res.send("employee is not found");

  } else {
    employees = employees.filter(p => p.name !== name);
    console.log(deletedEmp);
    res.send("employee is deleted");
    fs.writeFile("dataset.json", JSON.stringify(employees, null, 2), (err, result) => {
    if (err) {
        return console.error(err);
    } else {
        console.log("delete Success");
    }
  });
  }  
});

function calculateStats(employeeData) {
  let totalSalary = 0;
  let min = 0;
  let max = 0;
  for(var i = 0; i < employeeData.length; i++) {

    if (min === 0 || min > Number(employeeData[i].salary)) {
      min = employeeData[i].salary;
    }

    if (max < Number(employeeData[i].salary)) {
      max = employeeData[i].salary;
    }
    console.log(min);
    console.log(employeeData[i].salary);
    
    totalSalary = totalSalary + Number(employeeData[i].salary);    
  }
  const avg = totalSalary/employeeData.length;
  var stats = [
    {      
      avg: avg,
      min: min,    
      max: max
    }
  ]

  return stats;
}

app.get('/', (req, res) => {
  //console.log(req.token);
  
  res.json(token);
});

function isAuthorized(req, res, next) {
  const inputtoken = req.headers["x-access-token"];
  const decoded = jwt.verify(inputtoken, 'Secret_key');
  console.log(decoded);
  if (decoded.user_id === 'test') {
    next();
  } else {
    res.status(401);
    res.send('Not permitted. Please provide valid token.');
  }
}

//calculate stats for all dataset
app.get('/employee/SS', isAuthorized, (req, res) => {
  
  const stats = calculateStats(employees)
  console.log("Calculated salary paramerters");
  res.json(stats);
});

//calculate stats for employees on contract
app.get('/employee/SS-oncontract', (req, res) => {
  const empOnContract = employees.filter(p => p.on_contract === 'true');
  console.log(empOnContract);
  const stats = calculateStats(empOnContract)
  console.log(stats);
  console.log("Calculated salary paramerters");
  res.json(stats);
});

//calculate stats for department
app.get('/employee/SS-dep', isAuthorized, (req, res) => {
  var groupByDept = {};

  for (var val in employees) {
    var dept = employees[val].department;
    if (!groupByDept[dept]) {
      groupByDept[dept] = [];
    }
    groupByDept[dept].push(employees[val]);
  }

  const deptStats = {};
  for (var pos in groupByDept) {
    const stats = calculateStats(groupByDept[pos]);
    console.log(pos);
    console.log(groupByDept[pos]);
    deptStats[pos] = stats;
  }

  
  console.log("Calculated salary paramerters");
  res.json(deptStats);

});

//calculate stats for sub-department
app.get('/employee/SS-subdep', isAuthorized, (req, res) => {
  var groupByDept = {};

  for (var val in employees) {
    var dept = employees[val].department;
    var subDept = employees[val].sub_department;
    if (!groupByDept[dept]) {
      groupByDept[dept] = [];
    }
    if (!groupByDept[dept][subDept]) {
      groupByDept[dept][subDept] = [];
    }
    groupByDept[dept][subDept].push(employees[val]);
  }

  const deptStats = {};
  for (var pos in groupByDept) {
    for (var depPos in groupByDept[pos]) {
      const stats = calculateStats(groupByDept[pos][depPos]);
      if (!deptStats[pos]) {
        deptStats[pos] = [];
      }
      var department = {
        subDepartment: depPos,
        department: pos
      }
      stats.push(department);

      deptStats[pos].push(stats);
    }
  }
  console.log("Calculated salary paramerters");
  res.json(deptStats);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

