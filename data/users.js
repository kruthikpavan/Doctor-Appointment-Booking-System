const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const helpers = require("../helpers");
const bcrypt = require("bcryptjs");
const saltRounds = 16;

async function createUser(
    firstName,
    lastName,
    userName,
    password,
    email,
    gender,
    city,
    state,
    age,
    dob
    ){

        try {
            let dataCheck  = helpers.checkUserDetails(firstName,lastName,userName,password,email,gender,city,state,age,dob);

        const userCollection  = await users();
        let userData = userCollection.findOne({email: email.toLowerCase()});
        if(userData != null || userData != undefined) throw 'This E-mail has already been used to register';

        let hashed = await bcrypt.hash(password, saltRounds);

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: hashed,
            email: email,
            gender: gender,
            city: city,
            state: state,
            age: age,
            dob: dob,
            appointments: []
        }
        
        const insertUser = await userCollection.insertOne(newUser);
        if(!insertUser.acknowledged || !insertUser.insertedId)
        userData = await userCollection.findOne(newUser);
        userData['_id'] = userData['_id'].toString();

        return userData;
        } catch (e) {
            console.log(e);
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