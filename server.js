var express = require('express');
var mysql = require('mysql');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8887');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/listUsers',function(req,res){


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_service_bdd"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
    con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.end(JSON.stringify(result));
  });
});

})

app.get('/getUser/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id]; 
      console.log( user );
      res.end( JSON.stringify(user));
   });
})


app.post('/addUser',function(req,res){

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web_service_bdd"
});

console.log(req.body);


var name = req.body.name;
var firstname = req.body.firstname;
var city = req.body.city;
var password = req.body.password;

con.connect(function(err) {
  if (err) throw err;
  var sql = "INSERT INTO users (name,firstname,city,password,token) VALUES ('"+name+"','"+firstname+"','"+city+"','"+password+"','')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.end("L'utilisateur a bien été créé");
  });
});

})


app.delete('/deleteUser/:id', function (req, res) {

   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + req.params.id];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})