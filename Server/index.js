const express = require('express');
const app=express();

const ip="192.168.178.38";
const port=34567;

app.get('/', (req, res)=>{
    res.sendFile("Client/Startseite/index.html", {root:"../"})
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

app.listen(34567, () => console.log("sepp"));