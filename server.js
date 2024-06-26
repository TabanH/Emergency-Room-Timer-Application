const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();


//Sending an SMS
//var TMClient = require('textmagic-rest-client');
//var c = new TMClient('username', 'C7XDKZOQZo6HvhJwtUw0MBcslfqwtp4');
//c.Messages.send({text: 'Test Messages, Fred!', phones:'9057830416'}, function(err, res){
//    console.log('Messages.send()', err, res);
//});

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

const predict_wait_time = (req, res, next) => {
    
    function output(result) {
        numOfPatients = result[0]['count'];
        //Set default value 17 mins for each patient in emergency 
        waitingTime = numOfPatients * 17;

        req.waitingTime = waitingTime;
        //console.log('Current Waiting Time: ' + waitingTime);
    }

    Model.getWaitingPatients(output);

    next();
};

app.use(predict_wait_time);

app.get('/update',function(req,res){
  function renderPage(patientArray) {
    res.render('index', { patients: patientArray});
  }

  function getPatients(){
    Model.getAllPatients(renderPage)
  }
  Model.updatePatientStatus(req.body, getPatients);
})

// default action: render the page with data
app.get('/', function(req,res) {

  // 2. render the page with the realtor data
  function renderPage(patientArray) {
    res.render('index', { patients: patientArray, estimate: req.waitingTime});
  }

  // 1. get all the patients, then render the page
  Model.getAllPatientsInWaitingList(renderPage);

});

app.use('/admin',require('./contollers/admin.js'))

// catch-all router case intended for static files
app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

app.listen(8081, function() { console.log("server listening..."); } );


