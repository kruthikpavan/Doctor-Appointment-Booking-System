const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const helpers = require("../helpers");
const bcrypt = require("bcryptjs");
const saltRounds = 16;

async function createUser(
      firstName,
      lastName,
      username,
      password,
      email,
      phoneNumber,
      dateOfBirth
    ){

        try {
        
        let dataCheck  = await helpers.checkUserDetails(firstName,lastName,username,password,email,phoneNumber,dateOfBirth);
        const userCollection  = await users();
        let userData = await userCollection.findOne({email: email.toLowerCase()});
        if(userData != null || userData != undefined) throw 'This E-mail has already been used to register';
        let hashed = await bcrypt.hash(password, saltRounds);

        let newUser = {
            firstName:firstName,
            lastName:lastName,
            username:username,
            password:password,
            email:email,
            phoneNumber:phoneNumber,
            dateOfBirth:dateOfBirth,
            appointments: []
        }
        
        const insertUser = await userCollection.insertOne(newUser);
    
        } catch (e) {
            console.log(e);
            throw e;
        }
        
}

async function getUserByID(id){
    try {
        let checkID = helpers.checkID(id);
        if(checkID === false) throw 'ID provided is invalid';
        const userCollection = await users();
        let userData = await userCollection.findOne({_id: ObjectID(id)});
        if(userData == null) throw `No user with this ID - ${id}`
        userData['_id'] = userData['_id'].toString();
        return userData;
    } catch (e) {
        console.log('Could not fetch user by id' + e);
    }
}

async function removeUser(id){
try {
    let checkID = helpers.checkID(id);
    if(checkID === false) throw 'ID provided is invalid';
    const userCollection = await users();
    let userData = await userCollection.findOne({_id: ObjectID(id)});
    if(userData == null || userData == undefined) throw 'No User with this ID';
    let deletedUser = await userCollection.deleteOne({_id: ObjectID(id)});
    if(deletedUser.acknowledged == true)
        return `${id} with user name ${userData.firstName} has been successfully deleted!`;
    else
        return `${id} could not be deleted!`;
} catch (e) {
    console.log('Could not be deleted' + e );
    }
}

async function getAllUsers(){
    try {
        const userCollection = await users();
        let allUser = await userCollection.find({}).toArray();
        if(allUser == null || allUser == undefined) throw 'Error: Could not fetch all users';
        for(let i in allUser.length){
            allUser[i]['_id'] = allUser[i]['_id'].toString();
        }
        return allUser;
    } catch (e) {
        console.log('Error: Could not fetch all UserDetails');
    }
}

module.exports = {
    createUser,
    getUserByID,
    removeUser,
    getAllUsers
}