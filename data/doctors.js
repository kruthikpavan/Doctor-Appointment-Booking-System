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
      blockedSlots: blockedSlots
    };

    const insertDoc = await doctorCollection.insertOne(newUser);
  } catch (e) {
    console.log(e);
  }
}

async function getDoctorByID(id) {
  try {
    let checkID = helpers.checkID(id);
    if (checkID === false) throw "ID provided is invalid";
    const doctorCollection = await doctors();
    let docData = await doctorCollection.findOne({ _id: ObjectID(id) });
    if (docData == null) throw `No doctor with this ID - ${id}`;
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
  const notAvailable= await doctorCollection.findOne({name:doctor,'blockedSlots.date': date,'blockedSlots.time':parseFloat(time)})
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
  getAllDoctorDetails
};
