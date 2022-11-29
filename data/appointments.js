const mongoCollections = require("../config/mongoCollections");
const appointments = mongoCollections.appointments;

async function createAppointment(){

}

async function getAppointmentByID(id){
    if(!id) throw 'Appointment ID is invalid';
    

}

async function removeAppointment(){

}

async function getAppointmentByUser(){
    
}

module.exports = {
    createAppointment,
    getAppointmentByID,
    removeAppointment,
    removeAppointment,
    getAppointmentByUser
}