var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

console.log("start");
var bc = require("./Blockchain");

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

app.get("/home/comingsoon.jpg", (req, res) => {
  res.sendFile("Client/Startseite/comingsoon.jpg", { root: "../" });
});

app.get("/roulette", function (request, response) {
  response.sendFile("Client/Roulette/index.html", { root: "../" });
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
 
  /*if(!req.session.loggedIn)
  {
    res.redirect("http://localhost:34567/", 302);
  }*/

  var erg = r.calculateValueFromHash();
  //console.log(req.body.bet.color)
  var color = req.body.bet.color;
  var amount = req.body.bet.money;

  //username = req.session.username;
  var username = 'sepp';
  var userMoney = await sqlGetMoney(username);
  
  console.log(userMoney);
  userMoney = userMoney;
  if(userMoney < amount)
  {

    var erg2 = {
      error: "not enough money!!"
    };

    res.writeHead(422, { "Content-Type": "application/json" });
    res.write(JSON.stringify(erg2));
    res.end();
  }
  else if(amount< 10)
  {
    var erg2 = {
      error: "minimum amount to bet is 10 coins!!"
    };
    res.writeHead(422, { "Content-Type": "application/json" });
    res.write(JSON.stringify(erg2));
    res.end();
  }
  var endMoney = 0;
  if(erg == 0 && color == "Green")
  {
    endMoney = parseInt(userMoney) + parseInt(amount) * 13;
  }
  else if((erg > 0 && erg < 8 && color == "Red") || (erg > 7 && erg < 15 && color == "Black"))
  {
    endMoney = parseInt(userMoney) + parseInt(amount);
  }
  else{
    endMoney = parseInt(userMoney) - parseInt(amount);
  }
  var sql = "UPDATE users SET coins = '" + endMoney + "' WHERE users.username = ?";
  connection.query(sql, [username], function (err, result) {});

  var erg2 = {
    erg: {
      money: endMoney, //geld aus datenbank nehemen
      rouletteResult: erg,
    },
  };
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(erg2));
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

app.listen(34567, () => console.log("working..."));
