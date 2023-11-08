const express = require('express');
var router = express.Router();
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");
const Model = require('../app.model')


//Pls create an .env file annd save the follow info
// TWILIO_ACCOUNT_SID='ACbbb6da52f5d056d18c8d7b401dbeed67'
// TWILIO_AUTH_TOKEN='125d00916a85829758437843232f931a'
// TWILIO_NUMBER='+16627341557'

var config = require('../config');
var client = require('twilio')(config.accountSid, config.authToken);

router.get('/', function(req,res) {

    // 2. render the page with the realtor data
    function renderPage(patientArray) {
      res.render('admin', { patients: patientArray});
    }
  
    // 1. get all the patients, then render the page
    Model.getAllPatients(renderPage);
  
});

router.get("/sendNotify", function (req, res) {
    client.messages
        .create({
            body: 'Hello, this is a test message!',
            from: config.phoneNumber,
            to: '+19058080718'
        })
        .then(message => console.log(`Message sent with SID: ${message.sid}`))
        .catch(error => console.error(error));

        res.redirect("/admin");
});


module.exports = router;