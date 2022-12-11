const ObjectId=require('mongodb').ObjectId;
const validator=require("./validation") 

async function checkName(name)
{
    if(!name) throw "Name is not present";
    if(typeof name !== 'string') throw "Name is invalid";
    if(name.trim().length == 0)throw " Name contains only spaces";
    var reg = /^[a-zA-Z /']+$/i;
    if(reg.test(name) == false) throw "Name can contain only Alphabets";
    return true;
}
async function checkPassword(password)
{
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/; // one digit,One special character, more than 6 char
    if(typeof password != "string" ) throw 'Error: Password could not be read';
    if(password == null || password.trim().length === 0) throw 'Error: password is empty or contans only spaces';
    if(password.test(regularExpression) == false) throw "Invalid password Format. Must contain one digit,one special characters and between 6-16 characters";
    return true;

}
async function checkEmail(email)
{
    var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
    if(typeof email != "string" ) throw 'Error: Invalid Email';
    if(email == null || email.trim().length === 0) throw 'Error: Email is empty or contans only spaces';
    if(email.test(reg) == false) throw "Invalid Email Format";
    return true;
}
async function checkGender(gender)
{
    if(!gender) throw 'Error: Invalid gender';
    if(gender.toLowerCase() != 'male' || gender.toLowerCase() != 'female') throw 'Error: Gender can be Male,Female or Others';
    return true;
}
async function checkAge(age)
{
    if(!age) throw 'Error: Age is missing';
    let ageDetails = age.split(',');
    let years = ageDetails[0];
    let months = ageDetails[1]
    if(years==0)
    {
        if(months>1 && months<12)
        {
            return true;
        }
        else
        throw 'Age provided is invalid';
    }
    else if(years >0 && years <=100)
    {
        if(months>0 && months <=12)
        return true;
    }   
}

async function checkUserDetails(firstName,lastName,username,password,email,phoneNumber,dateOfBirth)
{
    if(!validator.validString(firstName)) throw 'Invalid FirstName'
    if(!validator.validString(lastName)) throw 'Invalid FirstName'
    if(!validator.validString(username)) throw 'Invalid FirstName'
    if(!validator.validPassword(password)) throw 'Invalid FirstName'
    if(!validator.validEmail(email)) throw 'Invalid FirstName'
    if(!validator.validPhoneNumber(phoneNumber)) throw 'Invalid FirstName'
    return true;
}

async function checkReviewDetails(reviewData,doctorID,userID,appointmentID,date,time)
{
    return{
        reviewData:checkData(reviewData),
        doctorID:checkID(doctorID),
        userID:checkID(userID),
        appointmentID:checkID(appointmentID),
        date:checkDate(date),
        time:checkTime(time)
    }
}
async function checkData(data)
{

}

async function checkID(id)
{
    return ObjectId.isValid(id)

}
async function checkDate(date)
{

}

async function checkTime(time)
{

}
module.exports = {
    checkUserDetails,
    checkID
}