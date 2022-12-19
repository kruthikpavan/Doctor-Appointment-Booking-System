const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const helpers = require("../helpers");
const bcrypt = require("bcryptjs");
const { ObjectID } = require("bson");
const saltRounds = 10;

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
        username= username.toLowerCase();
        email= email.toLowerCase();
        let dataCheck  = await helpers.checkUserDetails(firstName,lastName,username,password,email,phoneNumber,dateOfBirth);
        const userCollection  = await users();
        let userData = await userCollection.findOne({email: email});
        if(userData != null || userData != undefined) throw 'This E-mail has already been used to register';
        userData = await userCollection.findOne({username: username});
        if(userData != null || userData != undefined) throw 'This username has already been used to register';
        let hashed = await bcrypt.hash(password, saltRounds);
        
        let newUser = {
            firstName:firstName,
            lastName:lastName,
            username:username,
            password:hashed,
            email:email,
            phoneNumber:phoneNumber,
            dateOfBirth:dateOfBirth,
            appointments: []
        }
        
        const insertUser = await userCollection.insertOne(newUser);
        if (!insertUser.acknowledged || !insertUser.insertedId) throw "Could not add user";
            newUser = await userCollection.findOne(newUser);
            return newUser;
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

async function getUserByUn(id){
    try {
        // let checkID = helpers.checkID(id);
        // if(checkID === false) throw 'ID provided is invalid';
        const userCollection = await users();
        let userData = await userCollection.findOne({username: id});
        if(userData == null) throw `No user with this username - ${id}`
        userData['_id'] = userData['_id'].toString();
        return userData;
    } catch (e) {
        console.log('Could not fetch user by username' + e);
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
const checkUser = async (username, password) => {
    const userCollection = await users();
    username= username.toLowerCase();
    let passwordFound= await userCollection.findOne({username})
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
   async function updateProfile(
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            dateOfBirth
  ){

      try {
      username= username.toLowerCase();
      email= email.toLowerCase();
      const userCollection  = await users();
      let multiEmailCheck = await userCollection.find({email: email})
      let emailCheck = await userCollection.findOne({email: email})
      let userData = await userCollection.findOne({username: username});
      if(multiEmailCheck > 1){
        throw 'There exist another user with this email, you can login with that details or edit the email above.'
      }else if(!emailCheck){
        if((userData != null || userData != undefined))
      {
        let updateUser = {
            firstName:firstName,
            lastName:lastName,
            username:username,
            email:email,
            phoneNumber:phoneNumber,
            dateOfBirth:dateOfBirth,
        }
        const updatedInfo = await userCollection.updateOne({ _id: ObjectID(userData._id) }, { $set: updateUser });
        if (updatedInfo.modifiedCount === 0) return null;
        return await this.getUserByUn(username);
      }
      else{
        throw 'Please try again';
      } 

      }else if(emailCheck.username != username){
        throw 'There exist another user with this email, you can login with that details or edit the email above.'

      }else{
        if((userData != null || userData != undefined))
      {
        let updateUser = {
            firstName:firstName,
            lastName:lastName,
            username:username,
            email:email,
            phoneNumber:phoneNumber,
            dateOfBirth:dateOfBirth,
        }
        const updatedInfo = await userCollection.updateOne({ _id: ObjectID(userData._id) }, { $set: updateUser });
        if (updatedInfo.modifiedCount === 0) return null;
        return await this.getUserByUn(username);
      }
      else{
        throw 'Please try again';
      } 
      }
     
      

      } catch (e) {
          console.log(e);
          throw e;
      }
      
}

     

module.exports = {
    createUser,
    getUserByID,
    removeUser,
    getAllUsers,
    checkUser,
    updateProfile,
    getUserByUn
}