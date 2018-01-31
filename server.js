const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + "/views/partials"); // register partials before view engine delcaration
hbs.registerHelper("getCurrentYear", ()=>{
    return new Date().getFullYear();
});
hbs.registerHelper("screamIt", (text)=>{
    return text.toUpperCase();
});
app.set('view engine', 'hbs');
app.use((req, res, next)=>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(`${now}: ${req.method} ${req.url}`);
    fs.appendFile("server.log", log + "\n", (err)=>{
        if(err){
            console.log("Unable to log file");
        }
    })
    next();
});
// express maintenance middleware - use for when site is under maintenance
app.use((req, res, next)=>{
    res.render("maintenance.hbs")
})

app.use(express.static(__dirname + "/public")); // create a static directory

// get req for home page
app.get("/", (req, res) =>{
    res.render("home.hbs", {
        pageTitle: "Home Page",
        message: "Welcome to the place of intrigue"
    })
});

app.get("/about", (req, res) =>{
    res.render("about.hbs", {
        pageTitle: "About Page",
    });
});

app.get("/bad", (req, res) =>{
    res.send({
        status: 404,
        errorMessage:"Resource not found"
    })
});

app.listen(3001, () => {
    console.log("Server is up on port 3000");
});