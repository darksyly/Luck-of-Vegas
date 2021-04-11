var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

console.log("start");
var bc = require("./Blockchain");
const { Console } = require("console");

class Roulette {
  blockchain;
  seed;
  lastRoundIndex;
  blockchainSize;

  constructor(seed, lenghtOfChain) {
    this.blockchainSize = lenghtOfChain;
    this.seed = seed;
    this.lastRoundIndex = 0;
    this.blockchain = [];
    this.blockchain.push(new bc.BlockchainNode(seed, null, 0, 14, "Roulette"));
    for (var i = 0; i < lenghtOfChain - 1; i++) {
      this.blockchain.push(new bc.BlockchainNode(seed, this.blockchain[this.blockchain.length - 1].hash, 0, 14, "Roulette"));
    }
    console.log("Created new Roulette Block");
  }

  calculateValueFromHash() {
    var ret = parseInt(this.blockchain[this.lastRoundIndex].getHash(), 16) % 15;
    this.lastRoundIndex += 1;
    if (this.lastRoundIndex >= 500) {
      //add old seed to probably fair (database)
      this.seed = bc.BlockchainNode.randomSeed();
      this.lastRoundIndex = 0;
      this.blockchain = [];
      this.blockchain.push(new bc.BlockchainNode(this.seed, null, 0, 14, "Roulette"));
      for (var i = 0; i < this.blockchainSize - 1; i++) {
        this.blockchain.push(new bc.BlockchainNode(this.seed, this.blockchain[this.blockchain.length - 1].hash, 0, 14, "Roulette"));
      }
      console.log("Created new Roulette Block");
    }
    return ret;
  }
}

/*class Bets
{
    userId;
    betColor;
    betAmount;
}*/

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vegasdata",
});

const app = express();
//------------------------------------------------------------------------------------------------------------

app.use(session({
secret:'Keep it secret'
,name:'uniqueSessionID'
,saveUninitialized:false
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/home')
  }else{
    res.redirect('/login')
  }
});

app.get("/login", (req, res) => {
  res.sendFile("Client/Login/login.html", { root: "../" });
});

app.get("/login/handler.js", (req, res) => {
  res.sendFile("Client/Login/handler.js", { root: "../" });
});

app.get("/login/style.css", (req, res) => {
  res.sendFile("Client/Login/style.css", { root: "../" });
});

app.get("/login/HintergrundStart.jpg", (req, res) => {
  res.sendFile("Client/Login/HintergrundStart.jpg", { root: "../" });
});

app.get("/reg", (req, res) => {
  res.sendFile("Client/Login/register.html", { root: "../" });
});

app.get("/reg/handler.js", (req, res) => {
  res.sendFile("Client/Login/handler.js", { root: "../" });
});

app.get("/reg/style.css", (req, res) => {
  res.sendFile("Client/Login/style.css", { root: "../" });
});

app.get("/reg/HintergrundStart.jpg", (req, res) => {
  res.sendFile("Client/Login/HintergrundStart.jpg", { root: "../" });
});

app.get("/reg/HintergrundStart.jpg", (req, res) => {
  res.sendFile("Client/Login/HintergrundStart.jpg", { root: "../" });
});


app.post('/login' ,bodyParser.urlencoded() ,(req,res,next)=> {

connection.query("SELECT * FROM users WHERE username = ?", [req.body.username], function (error, results, fields) {
  if (results.length > 0 && (results[0].password.toString() == req.body.password)) {
    res.locals.username = req.body.username;
    next();
    }else{
      res.send('invalid');
    }
});
}
,(req,res)=>
{
req.session.loggedIn = true
req.session.username = res.locals.username
console.log(req.session)
res.redirect('/home')
})

/*
app.get('/loginVal' ,bodyParser.urlencoded() ,(req,res,next)=> {

  console.log(req.body.username);
  connection.query("SELECT * FROM users WHERE username = ?", [req.body.username], function (error, results, fields) {
    if (results.length > 0 && (results[0].password.toString() == req.body.password)) {
      res.locals.username = req.body.username;
      next();
      }else{
        console.log('INVALID');
        res.send('invalid');
        res.end();
      }
  });
  }
  ,(req,res)=>
  {
  req.session.loggedIn = true
  req.session.username = res.locals.username
  console.log(req.session)
  res.redirect(302, '/home');
  res.end();
  })
  */

app.post("/reg", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    connection.query("SELECT * FROM users WHERE username = ?", [username], function (error, results, fields) {
      if (results.length > 0) {
        response.send("Username Already exists");
      } else {
        var sql = "INSERT INTO users (username, password, coins) VALUES ?";
        var values = [[username, password, 1000]];
        response.redirect("http://localhost:34567/", 302);
        connection.query(sql, [values], function (err, result) {
          if (err) throw err;
        });
      }
      response.end();
    });
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.get("/home", function (request, response) {
  if(request.session.loggedIn){
    response.sendFile("Client/Startseite/index.html", { root: "../" });
  }else{
    response.redirect('/login');
  }
});

app.get("/getCoins", function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Content-Type', 'text/plain');

    username = request.session.username;

    connection.query("SELECT coins FROM users WHERE username = ?", [username], function (error, rows, fields) {
      response.send(rows[0].coins.toString());
      response.end();
    });
    
});

app.get("/getUsername", function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Content-Type', 'text/plain');
  response.send(request.session.username);
  response.end();
});

app.get("/getTopPlayers", function (request, res) {
  
  connection.query("SELECT * FROM `users` ORDER BY coins DESC", function (error, rows, fields) {
    console.log(rows);

    var r = [];
    for(var i = 0; i < rows.length; i++){
      r.push({'username': rows[i].username, 'coins':rows[i].coins} )
    }
    console.log(r);

    res.writeHead(200,{ "Content-Type": "application/json" });
    res.write(JSON.stringify(r));
    res.end();
  });
});

app.get('/logout',(req,res)=>
{
  req.session.destroy((err)=>{})
  res.redirect(302, '/login');
})

app.get("/home/style.css", (req, res) => {
  res.sendFile("Client/Startseite/style.css", { root: "../" });
});
app.get("/home/script.js", (req, res) => {
  res.sendFile("Client/Startseite/script.js", { root: "../" });
});

app.get("/home/Logo.png", (req, res) => {
  res.sendFile("Client/Startseite/Logo.png", { root: "../" });
});

app.get("/home/coins.png", (req, res) => {
  res.sendFile("Client/Startseite/coins.png", { root: "../" });
});

app.get("/home/freeCoins.jpg", (req, res) => {
  res.sendFile("Client/Startseite/freeCoins.jpg", { root: "../" });
});

app.get("/home/HintergrundStart.jpg", (req, res) => {
  res.sendFile("Client/Startseite/HintergrundStart.jpg", { root: "../" });
});

app.get("/home/roulette-bild.jpg", (req, res) => {
  res.sendFile("Client/Startseite/roulette-bild.jpg", { root: "../" });
});

app.get("/home/pokal.png", (req, res) => {
  res.sendFile("Client/Startseite/pokal.png", { root: "../" });
});

app.get("/home/comingsoon.jpg", (req, res) => {
  res.sendFile("Client/Startseite/comingsoon.jpg", { root: "../" });
});

app.get("/home/links.png", (req, res) => {
  res.sendFile("Client/Startseite/links.png", { root: "../" });
});

app.get("/home/rechts.png", (req, res) => {
  res.sendFile("Client/Startseite/rechts.png", { root: "../" });
});

app.get("/roulette", function (request, response) {
  if(request.session.loggedIn){
    response.sendFile("Client/Roulette/index.html", { root: "../" });
  }else{
    response.redirect('/login');
  }
});

app.get("/Roulette/style.css", (req, res) => {
  res.sendFile("Client/Roulette/style.css", { root: "../" });
});
app.get("/Roulette/script.js", (req, res) => {
  res.sendFile("Client/Roulette/script.js", { root: "../" });
});

app.get("/Roulette/Logo.png", (req, res) => {
  res.sendFile("Client/Roulette/Logo.png", { root: "../" });
});

app.get("/Roulette/coins.png", (req, res) => {
  res.sendFile("Client/Roulette/coins.png", { root: "../" });
});

app.get("/Roulette/freeCoins.jpg", (req, res) => {
  res.sendFile("Client/Roulette/freeCoins.jpg", { root: "../" });
});

app.get("/Roulette/HintergrundStart.jpg", (req, res) => {
  res.sendFile("Client/Roulette/HintergrundStart.jpg", { root: "../" });
});

app.get("/Roulette/rouletteField.png", (req, res) => {
  res.sendFile("Client/Roulette/rouletteField.png", { root: "../" });
});

var r = new Roulette(bc.BlockchainNode.randomSeed(), 500);

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

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

async function sqlGetMoney(username)
{
  return new Promise(resolve => {
    setTimeout(() => {
      connection.query("SELECT coins FROM users WHERE username = ?", [username] , function (error, rows, fields) {
        userMoney = rows[0].coins;
        resolve(userMoney);
      }, 2000);
    });
  });
}


app.post("/RouletteBet", async function (req, res) {
  console.log(req.session.username)
  if(!req.session.loggedIn)
  {
    res.writeHead(401 , { "Content-Type": "application/json" });
    res.end();
  }

  console.log(req.session.username)
  console.log(req.body)
  var erg = r.calculateValueFromHash();
  var username = req.session.username;
  var userMoney = await sqlGetMoney(username);
  var userData = req.body;
  var betAmount = 0;
  var ret; //data to send back to user
  for(var i=0; i<userData.length; i++){
    betAmount += userData[i].amount;
  }
  if(userMoney < betAmount){
    ret = {
      error: "not enouth balance"
    }
    res.writeHead(422,{ "Content-Type": "application/json" });
    res.write(JSON.stringify(ret));
    res.end();
    return;
  }
  else if(10 > betAmount){
    ret = {
      error: "minimum bet is 10"
    }
    res.writeHead(422,{ "Content-Type": "application/json" });
    res.write(JSON.stringify(ret));
    res.end();
    return;
  }
  console.log("erg: " + erg)
  console.log("startMoney: " + userMoney);
  for(var i=0; i<userData.length; i++){
    if((userData[i].color == "Red" && erg > 0 && erg < 8) || (userData[i].color == "Black" && erg > 8 && erg < 15)){
      userMoney += userData[i].amount;
    }
    else if((userData[i].color == "Green" && erg == 0) || (parseInt(userData[i].color) == erg)){
      userMoney += userData[i].amount * 13;
    }
    else{
      userMoney -= userData[i].amount;
    }
  }
  console.log("usermoney: " + userMoney);
  var sql = "UPDATE users SET coins = '" + userMoney + "' WHERE users.username = ?";
  connection.query(sql, [username], function (err, result) {});

  ret = {
    result: erg,
    money: userMoney
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(ret));
  res.end();
});



/*app.post("/RouletteBet", function (req, res) {
 
  var erg = r.calculateValueFromHash();
  var erg2 = {
    erg: {
      money: 0, //geld aus datenbank nehemen
      rouletteResult: erg,
    },
  };
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(erg2));
  res.end();
});*/

app.get("/Statistics", (req, res) => {
  if(req.session.loggedIn){
    res.sendFile("Client/Statistics/index.html", { root: "../" });
  }else{
    res.redirect('/login');
  }
});

app.get("/Statistics/bildwolken.jpg", (req, res) => {
  res.sendFile("Client/Statistics/bildwolken.jpg", { root: "../" });
});

app.get("/Statistics/coins.png", (req, res) => {
  res.sendFile("Client/Statistics/coins.png", { root: "../" });
});

app.get("/Statistics/Logo.png", (req, res) => {
  res.sendFile("Client/Statistics/Logo.png", { root: "../" });
});

app.get("/Statistics/erster.png", (req, res) => {
  res.sendFile("Client/Statistics/erster.png", { root: "../" });
});

app.get("/Statistics/zweiter.png", (req, res) => {
  res.sendFile("Client/Statistics/zweiter.png", { root: "../" });
});

app.get("/Statistics/dritter.png", (req, res) => {
  res.sendFile("Client/Statistics/dritter.png", { root: "../" });
});

app.get("/Statistics/style.css", (req, res) => {
  res.sendFile("Client/Statistics/Style.css", { root: "../" });
});

app.get("/Statistics/controller.js", (req, res) => {
  res.sendFile("Client/Statistics/controller.js", { root: "../" });
});

app.listen(34567, () => console.log("working..."));
