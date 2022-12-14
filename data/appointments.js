const mongoCollections = require("../config/mongoCollections");
const appointments = mongoCollections.appointments;
const doctors = mongoCollections.doctors;
const validator = require('../validation');
//schema
// { 
//     "_id":"1b6789b3-c0d4-4f8c-b20a-6a1d4b5b1234", 
//       "User_id":"rocky24@gmail.com", 
//       "doctor_id":"Manuel1902", 
//       "time":"08:30", 
//       "date":"02/02/2022", 
//         "status": 'pending'
//     } 

async function createAppointment(userID,doctorId,timeSlot,date){
    const status= 'pending'
    const newAppointment=  {    
        userID,
        doctorId,
        timeSlot,
        date,
        status
    }
    const appointmentsCollection=await  appointments()
    const createdAppointment = await appointmentsCollection.insertOne(newAppointment);
    return {appointmentInserted: true}
}
async function getAppointmentByID(id){
    if(!id) throw 'Appointment ID is invalid';
    const appointmentsCollection=await appointments()
    const appointment = await appointmentsCollection.find({userID:id}).toArray()
    if(appointment){
        return appointment
    }
    return null
}
async function removeAppointment(id){
    const appointmentsCollection=await appointments()
    const appointmentInfo = await appointmentsCollection.findOne({userID:id,status:'pending'})
    const appointment = await appointmentsCollection.deleteMany({userID:id,status:'pending'})
    const date= appointmentInfo.date
    const time= appointmentInfo.timeSlot
    const doctorCollection = await doctors();
    const doctor= await doctorCollection.findOne({name:appointmentInfo.doctorId})
    let updatedBlockedSlots=[]
    if(doctor.blockedSlots.length>0){
      for(const key of doctor.blockedSlots){
        if(key.date===date && key.time===time){
          continue
        }
        else {
          updatedBlockedSlots.push(key)
  
        }
      }
    }
  
  // await doctorCollection.update({'name': name}, {"$set": {"blockedSlots": []}})

    const restoreSlot=await  doctorCollection.update({'name': appointmentInfo.doctorId}, {"$set": {"blockedSlots": updatedBlockedSlots}})
    //send success status
}

async function getAppointmentByUser(){

    
}

async function checkStatus(id){
    const appointmentsCollection=await appointments()
    const appointment = await appointmentsCollection.findOne({userID:id,status:'pending'})
    if(appointment) return true
    return false
}

async function updateAppointment(){

}

async function reqrescheduleAppointment(appointmentID,doctorID,userID,newTime)
{
  const appointmentsCollection=await appointments()

  try {
    appointmentIDcheck = validator.validId(appointmentID);
    doctorIDcheck = validator.validId(doctorID);
    userID = validator.validId(userID);

    appointmentDeets = appointmentsCollection.getAppointmentByID(appointmentID);



    
  } catch (e) {
    return e;
  }
}


module.exports = {
    createAppointment,
    getAppointmentByID,
    removeAppointment,
    removeAppointment,
    getAppointmentByUser,
    checkStatus,
    reqrescheduleAppointment,
    updateAppointment
}