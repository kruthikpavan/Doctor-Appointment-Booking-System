const mongoCollections = require("../config/mongoCollections");
const doctors = mongoCollections.doctors;
const helpers = require("../helpers");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const { ObjectID } = require("bson");

async function getAllDoctorDetails(){
  const doctorCollection = await doctors();
  docDetails =  await doctorCollection.find({}).toArray();
  return docDetails
}
async function addRescheduleRequest(doctor,date,pastTime,timeslot,user){
  const doctorCollection = await doctors();
  const doctorData= await doctorCollection.findOne({name:doctor})
  let reschedulerequests= doctorData.rescheduleRequests
  let updatedRequests= reschedulerequests
  //send request only if it's not already sent
  let alreadyPresent= false
  if(reschedulerequests.length>0){

    reschedulerequests.forEach(req=>{
      if(req.user==user){
        alreadyPresent=true
      }
    })
  }
 
  if(!alreadyPresent){
    updatedRequests.push({date:date,time:timeslot,pastTime:pastTime,user:user})
    const updatedRequest=await  doctorCollection.update({'name': doctor}, {"$set": {"rescheduleRequests": updatedRequests}})
    return true
  }
  return false
 
 

}
async function updateDoctor(doctor,date,time,presentTime,user)
{
  const doctorCollection = await doctors();
  const doctorData= await doctorCollection.findOne({name:doctor})
  let updatedBlockedSlots=[]
  let newBlock={date:date,time:presentTime}
  updatedBlockedSlots.push(newBlock)
  if(doctorData.blockedSlots.length>0){
      for(const key of doctorData.blockedSlots){
        if(key.date===date && key.time===time){
          continue
        }
        if(key.date===date && key.time===time){
          continue
        }
        else {
          updatedBlockedSlots.push(key)
  
        }
      }
    }
    const restoreSlot=await  doctorCollection.update({'name': doctor}, {"$set": {"blockedSlots": updatedBlockedSlots}})


  
}



async function createDoctor(
  docName,
  category,
  qualification,
  hospital_id,
  dob,
  gender,
  email,
  phoneNumber,
  password
) {
  try {
    //Add validation
    const doctorCollection = await doctors();
    email= email.toLowerCase();

    let userData = await doctorCollection.findOne({
      email: email,
    });
    if (userData != null || userData != undefined)
      throw "This E-mail has already been used to register";
    let hashed = await bcrypt.hash(password, saltRounds);
    let blockedSlots=[]
    let reviews=[]

    let newUser = {
      name: docName,
      category: category,
      qualification: qualification,
      hospital_id: hospital_id,
      dob: dob,
      gender: gender,
      email: email.toLowerCase(),
      phoneNumber: phoneNumber,
      password: hashed,
      blockedSlots: blockedSlots,
      reviews:reviews,
      rescheduleRequests:[]
    };

    const insertDoc = await doctorCollection.insertOne(newUser);
  } catch (e) {
    console.log(e);
  }
}

async function getDoctorByID(uname) {
  try {
    // let checkID = helpers.checkID(uname);
    // if (checkID === false) throw "ID provided is invalid";
    const doctorCollection = await doctors();
    let docData = await doctorCollection.findOne({ name: uname });
    if (docData == null) throw `No doctor with this ID - ${uname}`;
    docData["_id"] = docData["_id"].toString();
    return docData;
  } catch (e) {
    console.log("Could not fetch user by id" + e);
  }
}

async function removeDoctor(id) {
  try {
    let checkID = helpers.checkID(id);
    if (checkID === false) throw "ID provided is invalid";
    const doctorCollection = await doctors();
    let docData = await doctorCollection.deleteOne({ _id: ObjectID(id) });
    if (docData == null)
      throw `No doctor with this ID - ${id} and cannot delete`;
    docData["_id"] = docData["_id"].toString();
    return `Doctor with this ID - ${id} has been deleted`;
  } catch (e) {
    console.log("Could not fetch user by id" + e);
  }
}
const checkDoctor = async (username, password) => {
  const doctorCollection = await doctors();
  username= username.toLowerCase()
  let passwordFound= await doctorCollection.findOne({email: username.toLowerCase(),})
  if(passwordFound){
    let match= bcrypt.compareSync(password,passwordFound.password)
     if(match){
      passwordFound._id=passwordFound._id.toString();
      return passwordFound;
     }else{
      return null
     }
    }

    return null
  
 };

 async function blockAppointment(name,date,time){
  const doctorCollection = await doctors();
  // await doctorCollection.update({'name': name}, {"$set": {"blockedSlots": []}})
 
  const appointmentBlock= doctorCollection.update({name:name},{
    $push: {
      blockedSlots: {date,time}
  }
  })
  return 

 }

 async function checkSlot(doctor,date,time){
  //check if this time is blocked
  const doctorCollection = await doctors();
  const notAvailable= await doctorCollection.findOne({name:doctor,'blockedSlots.date': date,'blockedSlots.time':parseFloat(time).toFixed(2)})
  if(notAvailable) return false
  return true
 }

async function updateProfile(
  id,
  docName,
  category,
  qualification,
  hospital_id,
  dob,
  gender,
  email,
  phoneNumber
) {
  try {
    email= email.toLowerCase();
    const doctorCollection = await doctors();
    let userData = await doctorCollection.findOne({
      email: email,
    });
    if (
      (userData != null || userData != undefined) &&
      userData._id.toString() != id
    )
      throw "This E-mail has already exist";
    let updateUser = {
      name: docName,
      category: category,
      qualification: qualification,
      hospital_id: hospital_id,
      dob: dob,
      gender: gender,
      email: email,
      phoneNumber: phoneNumber,
    };
    const updatedInfo = await doctorCollection.updateOne(
      { _id: ObjectID(id) },
      { $set: updateUser }
    );
    if (updatedInfo.modifiedCount === 0) return null;
    return await this.getDoctorByID(id);
  } catch (e) {
    console.log(e);   
    throw e;
  }
}
module.exports = {
  createDoctor,
  getDoctorByID,
  removeDoctor,
  updateProfile,
  checkDoctor,
  checkSlot,
  blockAppointment,
  getAllDoctorDetails,
  updateDoctor,
  addRescheduleRequest
};
