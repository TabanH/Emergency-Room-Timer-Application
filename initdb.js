var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("Patient.db");

db.serialize(function() {

  // create Patient table
  db.run("DROP TABLE IF EXISTS Patients");
  db.run("CREATE TABLE Patients (firstname TEXT, lastname TEXT, ernumber TEXT, arrive TEXT, contact TEXT)");

  // insert records into the realtors table
  //db.run("INSERT INTO Patients VALUES (?,?,?,?,?)", ['Fred','L.','ER01','00:00','9057830001']);


});