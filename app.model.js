var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("Patient.db");

// select all the patients, call the callback with them as a parameter
function getAllPatients(callback)
{
  db.all("SELECT rowid, * FROM Patients",
         function(err,results) { callback(results); });
}
// delete a realtor with a given id
function deletePatient(id,callback)
{
  db.run("DELETE FROM Patients WHERE rowid=?", id,
         function(err) { callback(); });
}
// insert an patient into the table
function addPatient(patient,callback)
{
  db.run("INSERT INTO Patients VALUES (?,?,?,?)",
         [patient.fname, patient.lname, patient.ernumber, patient.contact],
         function(err) {callback()});
}

function addPatients(patient,callback)
{

  db.run("INSERT INTO Patients VALUES (?,?,?,?)",
         [patient.fname, patient.lname, patient.ernumber, patient.contact],
         function(err) {callback()});
}
// export the functions we have defined
module.exports = {getAllPatients, deletePatient, addPatient,addPatients};