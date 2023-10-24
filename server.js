const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// include the mustache template engine for express
const mustacheExpress = require('mustache-express');

// include the model so the controller can use its functions 
const Model = require('./app.model.js')

// registers the mustache engine with express
app.engine("mustache", mustacheExpress());

// sets mustache to be the view engine
app.set('view engine', 'mustache');

// sets /views to be the /views folder
// files should have the extension filename.mustache
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/',function(req,res){

  function renderPage(patientArray) {
    res.render('index', { patients: patientArray});
  }

  function getPatients(){
        Model.getAllPatients(renderPage)
  }

  // 1. get all the patients, then render the page
    Model.addPatients(req.body, getPatients);
})


// default action: render the page with realtor data
app.get('/', function(req,res) {

  // 2. render the page with the realtor data
  function renderPage(patientArray) {
    res.render('index', { patients: patientArray});
  }

  // 1. get all the patients, then render the page
  Model.getAllPatients(renderPage);

});

// catch-all router case intended for static files
app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

app.listen(8081, function() { console.log("server listening..."); } );
