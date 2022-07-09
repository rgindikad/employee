# employee

#run command "docker-compose up"

#craete token
#command : http://localhost:3000/
#add to header
#header : x-access-token 

#basic authentication
#user : test
#password : test123

#add employee
#POST : http://localhost:3000/employee/add
#provide name, salary, currency, department, sub_department

#delete employee
#DELETE : http://localhost:3000/employee/delete/<emp_name>

#calculate stats for all employees
#GET : http://localhost:3000/employee/SS

#claculate stats for employees on contract
#GET : http://localhost:3000/employee/SS-oncontract

#calculate employee stats based on department
#GET : http://localhost:3000/employee/SS-dep

#calcilate employee stats for sub department
#http://localhost:3000/employee/SS-subdep

