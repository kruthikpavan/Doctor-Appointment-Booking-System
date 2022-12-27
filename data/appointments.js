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

async function checkActiveAppointment(user){
  const appointmentsCollection=await  appointments()
    const found=  await appointmentsCollection.findOne({userID: user,fulfilled: false})
    if(found) return true
    else return false
}



async function createAppointment(userID,doctorId,timeSlot,date){
    const fulfilled= false
    const requestReschedule= false
    const reviewGiven= false
    const rescheduleDone= 'pending'
    const newAppointment=  {    
        userID,
        doctorId,
        timeSlot,
        date,
        fulfilled,
        requestReschedule,
        reviewGiven,
        rescheduleDone
    }
    const appointmentsCollection=await  appointments()
    const createdAppointment = await appointmentsCollection.insertOne(newAppointment);
    return {appointmentInserted: true}
}


async function rejectStatus(user){
  const appointmentsCollection=await appointments()
  const appointment = await appointmentsCollection.updateOne({userID:user} ,{"$set": {rescheduleDone: 'rejected',
  requestReschedule:false}})
  return 


}

async function rescheduleAppointment(user,newTime,oldTime){

  const appointmentsCollection=await appointments()
  const appointment = await appointmentsCollection.updateOne({userID:user,timeSlot:oldTime} ,{"$set": {rescheduleDone: 'approved',timeSlot:newTime, 
  requestReschedule:false}})
  return true


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

async function getAppointmentByDoctorID(id){
  if(!id) throw 'Appointment ID is invalid';
  const appointmentsCollection=await appointments()
  const appointment = await appointmentsCollection.find({doctorId:id}).toArray()
  if(appointment){
      return appointment
  }
  return null
}

async function removeAppointment(id){
    const appointmentsCollection=await appointments()
    const appointmentInfo = await appointmentsCollection.findOne({userID:id,fulfilled:false})
    const appointment = await appointmentsCollection.deleteMany({userID:id,fulfilled:false})
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
    const appointment = await appointmentsCollection.findOne({userID:id,fulfilled:false})
    if(appointment) return true
    return false
}

async function updateFulfilled(name,date,time){
  const appointmentsCollection=await appointments()
 const appointment = await appointmentsCollection.updateOne({userID:name,date:date,timeSlot:time} ,{"$set": {fulfilled:true}})
 return

}


async function updateAppointment(name,doctor){
  const appointmentsCollection=await appointments()
  const appointment = await appointmentsCollection.updateOne({userID:name,doctorId:doctor,reviewGiven:false} ,{"$set": {"reviewGiven": true}})
 return
}

async function reqrescheduleAppointment(userId,doctorId)
{
  const appointmentsCollection=await appointments()

  try {
    // appointmentIDcheck = validator.validId(appointmentID);
    // doctorIDcheck = validator.validId(doctorID);
    // userID = validator.validId(userID);

    const updateKey=await  appointmentsCollection.update({'userID': userId,'doctorId':doctorId}, {"$set": {"requestReschedule": true}})
return

    
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
    updateAppointment,
    rescheduleAppointment,
    rejectStatus,
    getAppointmentByDoctorID,
    updateFulfilled,
    checkActiveAppointment
}