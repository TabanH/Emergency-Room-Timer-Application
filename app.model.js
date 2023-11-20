var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("Patient.db");

// select all the patients
function getAllPatients(callback)
{
  db.all("SELECT rowid, * FROM Patients",
         function(err,results) { callback(results); });
}
// select all the patients in waiting list
function getAllPatientsInWaitingList(callback)
{
  db.all("SELECT rowid, * FROM Patients WHERE status = 'Waiting'",
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
  db.run("INSERT INTO Patients VALUES (?,?,'ER'||(SELECT COALESCE(max(rowid),0)+1 FROM Patients),?,?,?)",
         [patient.fname, patient.lname, patient.arrive, patient.contact,"Waiting"],
         function(err) {callback()});
}
// update an patient status by ernumber
function updatePatientStatus(patient,callback)
{
  db.run("UPDATE Patients SET status = ? WHERE ernumber = ?",
         [patient.status, patient.ernumber],
         function(err) {callback()});
}
// select status and counts the waiting number
function getWaitingPatients(patient,callback)
{
  db.run("UPDATE Patients SET status = ? WHERE ernumber = ?",
         [patient.status, patient.ernumber],
         function(err) {callback()});
}

function getEstimatetime(callback)
{
    db.all("SELECT COUNT(*) AS count FROM Patients WHERE status = 'Waiting'",
             function(err,results) {callback(results); });
}
// export the functions we have defined
module.exports = {getAllPatients, getAllPatientsInWaitingList, deletePatient, addPatient, updatePatientStatus, getEstimatetime};