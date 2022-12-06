const mongoCollections = require("../config/mongoCollections");
const doctors = mongoCollections.doctors;

async function createDoctor(
    doctor_id,
    docName,
    category,
    qualification,
    hospital_id,
    dob,
    gender,
    email,
    phoneNumber,
    password){
    try {
        
        let dataCheck  = helpers.checkUserDetails(doctor_id,docName,category,qualification,hospital_id,dob,
                                    gender,email,phoneNumber,password);
        const doctorCollection  = await doctors();
        let docData = doctorCollection.findOne({doctor_id: doctor_id});
        if(docData != null || docData != undefined) throw 'This E-mail has already been used to register';
        let hashed = await bcrypt.hash(password, saltRounds);

        let newUser = {
            doctor_id: doctor_id,
            name: docName,
            category: category,
            qualification:qualification,
            hospital_id: hospital_id,
            dob: dob,
            gender: gender,
            email: email,
            phoneNumber: phoneNumber,
            password: hashed,
        }
        
        const insertDoc = await doctorCollection.insertOne(newUser);
        if(!insertDoc.acknowledged || !insertDoc.insertedId)
        docData = await doctorCollection.findOne(newUser);
        docData['_id'] = docData['_id'].toString();

        return userData;
        } catch (e) {
            console.log(e);
        }
}

async function getDoctorByID(id){
    try {
        let checkID = helpers.checkID(id);
        if(checkID === false) throw 'ID provided is invalid';
        const doctorCollection  = await doctors();
        let docData = await doctorCollection.findOne({_id: ObjectID(id)});
        if(docData == null) throw `No doctor with this ID - ${id}`
        docData['_id'] = docData['_id'].toString();
        return docData;
    } catch (e) {
        console.log('Could not fetch user by id' + e);
    }

}

async function removeDoctor(id){
    try {
        let checkID = helpers.checkID(id);
        if(checkID === false) throw 'ID provided is invalid';
        const doctorCollection  = await doctors();
        let docData = await doctorCollection.deleteOne({_id: ObjectID(id)});
        if(docData == null) throw `No doctor with this ID - ${id} and cannot delete`
        docData['_id'] = docData['_id'].toString();
        return `Doctor with this ID - ${id} has been deleted`;
    } catch (e) {
        console.log('Could not fetch user by id' + e);
    }
}


module.exports = {
    createDoctor,
    getDoctorByID,
    removeDoctor,
}