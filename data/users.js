const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const helpers = require("../helpers");

async function createUser(
    firstName,
    lastName,
    userName,
    password,
    email,
    gender,
    city,
    state,
    age
    ){
        let dataCheck  = helpers.checkUserDetails(firstName,lastName,userName,password,email,gender,city,state,age);


}

async function getUserByID(){

}

async function removeUser(){

}

async function getAllUsers(){

}

module.exports = {
    createUser,
    getUserByID,
    removeUser,
    getAllUsers
}