var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'vegasdata'
});

const app = express();

app.use(session({
	secret: 'supermegasecret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.sendFile("Client/Login/login.html", {root:"../"})
})

app.get('/register.html', (req, res)=>{
    res.sendFile("Client/Login/register.html", {root:"../"})
})

app.get('/style.css', (req, res)=>{
    res.sendFile("Client/Login/style.css", {root:"../"})
})

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/reg', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) {
			if (results.length > 0) {
				response.send('Username Already exists');
			} else {
                connection.query("INSERT INTO users (name, password) VALUES ?", [[username, password]], function (err, result) {
                    if (err) throw err;
                    console.log("new user created");
                });
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        app.get('/index.html', (req, res)=>{
            response.sendFile("Client/Startseite/index.html", {root:"../"})
        })
        app.get('/style.css', (req, res)=>{
            res.sendFile("Client/Startseite/style.css", {root:"../"})
        })
        app.get('/script.js', (req, res)=>{
            res.sendFile("Client/Startseite/script.js", {root:"../"})
        })
        
        app.get('/Logo.png', (req, res)=>{
            res.sendFile("Client/Startseite/Logo.png", {root:"../"})
        })
        
        app.get('/login', (req, res)=>{
            res.sendFile("Client/Startseite/index.html", {root:"../"})
        })
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});


app.listen(34567, () => console.log("working..."));