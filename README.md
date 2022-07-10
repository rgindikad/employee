# Employee

Used postman as API test tool.

extract the zip file

run 
command "docker-compose up".

create token.
GET : http://localhost:3000/.

add to header.
"x-access-token".

basic authentication - 
user : test
password : test123

add employee.
POST : http://localhost:3000/employee/add.
provide name, salary, currency, department, sub_department.

delete employee.
DELETE : http://localhost:3000/employee/delete/<emp_name>.

calculate stats for all employees.
GET : http://localhost:3000/employee/SS.

claculate stats for employees on contract.
GET : http://localhost:3000/employee/SS-oncontract.

calculate employee stats based on department.
GET : http://localhost:3000/employee/SS-dep.

calculate employee stats for sub department.
GET : http://localhost:3000/employee/SS-subdep.


Unit Test

install jest and supertest. "npm install --save-dev jest supertest".
run command "npm test".

Spetial Note:
I learnt following technologies to implement this.
node.js, express.js, json, jest, supertest, web services
