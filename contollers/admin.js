const express = require('express');
var app = express.Router();
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");
const Model = require('../app.model');


//Pls create an .env file annd save the follow info
// TWILIO_ACCOUNT_SID='ACbbb6da52f5d056d18c8d7b401dbeed67'
// TWILIO_AUTH_TOKEN='125d00916a85829758437843232f931a'
// TWILIO_NUMBER='+16627341557'

var config = require('../config');
var client = require('twilio')(config.accountSid, config.authToken);


/*
const notification = (req, res, next) => {
    phone = '+1' + req.body.contact
    client.messages
        .create({
            body: 'This is a Hospital Emergency Department. Your have successfully checked-in, and we put you in a waiting list now. Please be patient and visit this 192.168.2.168 to see the detailed list. ',
            from: config.phoneNumber,
            to: phone  // here should feed in client phone number
        })
        .then(message => console.log(`Message sent with SID: ${message.sid}`))
        .catch(error => console.error(error));

        next();
};


app.use(notification);

*/
function sendNotification(contact, redirectPath, res){
  const phone = '+1' + contact;
  const messageBody = 'This is a Hospital Emergency Department. You have successfully checked in, and we put you in a waiting list now. Please be patient and visit http://192.168.2.168:8081 to see the detailed list.';

  client.messages
    .create({
      body: messageBody,
      from: config.phoneNumber,
      to: phone,
    })
    .then(message => console.log(`Message sent with SID: ${message.sid}`))
    .catch(error => console.error(error));
}

app.get('/', function(req,res) {

    // 2. render the page with the realtor data
    function renderPage(patientArray) {
      res.render('admin', { patients: patientArray});
    }
  
    // 1. get all the patients, then render the page
    Model.getAllPatients(renderPage);
  
});

app.post('/',function(req,res){

  function renderPage(patientArray) {
    res.render('admin', { patients: patientArray});
  }

  function getPatients(){
    Model.getAllPatients(renderPage)
  }

  
  if (req.body.fname != null) {
    req.body.fname = req.body.fname.charAt(0).toUpperCase() + req.body.fname.slice(1).toLowerCase();
  }

  if (req.body.lname != null) {
    req.body.lname = req.body.lname.charAt(0).toUpperCase() + '.'; // Keep the initial and add a period
  }

  Model.addPatient(req.body, getPatients);
  //uncommnet next line will triger auto-notification service 
  sendNotification(req.body.contact, "/admin", res);
})


app.get("/update/:ernumber", function (req, res) {

    function redirectFunc(){
        res.redirect("/admin");
    }

    Model.updatePatientStatus(req.params,redirectFunc);

    
});

module.exports = app;