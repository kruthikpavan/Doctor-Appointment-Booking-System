async function checkName(name)
{
    if(!name) throw "Name is not present";
    if(typeof name !== 'string') throw "Name is invalid"
    if(name.trim().length == 0)throw " Name contains only spaces"
    var reg = /^[a-z]+$/i;
    if(reg.test(name) == false) throw "Name can contain only Alphabets"
}
async function checkPassword(password)
{
    var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;

}
async function checkEmail(email)
{
    
}
async function checkGender(gender)
{
    
}
async function checkAge(age)
{
    
}

async function checkUserDetails(firstName,lastName,userName,password,email,gender,city,state,age)
{
    return {
        firstName:checkName(firstName),
        lastName:checkName(lastName),
        userName:checkUserName(userName),
        password:checkPassword(password),
        email:checkEmail(email),
        gender:checkGender(gender),
        city:checkName(city),
        state:checkName(state),
        age:checkFirstName(age),
    }
}