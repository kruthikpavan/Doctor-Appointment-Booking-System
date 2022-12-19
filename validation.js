const emailValidator = require('email-validator');
const { ObjectId } = require('mongodb')
function validString(string) {
    if(typeof string !== 'string' || !string) return false;
    if(string.trim().length < 1) return false;
    return true;
}

function validEmail(email) {
    return emailValidator.validate(email);
}

function validDate(date) {
    validString(date);
    let splitDate = date.split('/')

    if (splitDate[0].length > 2 || splitDate[0].length < 1) return false;
    if (splitDate[1].length > 2 || splitDate[0].length < 1) return false;
    if (splitDate[2].length !== 4) return false;

    let dateObj = new Date(date);
    if (!dateObj) return false

    return true;
}
function IsvalidDate(dateString)
{
    let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;      
          
    // Match the date format through regular expression      
    if(dateformat.test(dateString)){      
        let operator = dateString.split('/');      
        // Extract the string into month, date and year      
        let datepart = [];      
        if (operator.length>1){      
            datepart = dateString.split('/');      
        }
        if(datepart[0].length<2)
        return false;
        if(datepart[1].length<2)
        return false;
        
        let month= parseInt(datepart[0]);      
        let day = parseInt(datepart[1]);      
        let year = parseInt(datepart[2]);      
        let today=new Date();
        let idate=new Date(dateString);
        let diff=idate-today;
    		if(year<1900 ||diff>0)
        return false;
        // Create list of days of a month      
        let ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];      
        if (month==1 || month>2){      
            if (day>ListofDays[month-1]){      
                ///This check is for Confirming that the date is not out of its range      
                return false;      
            }      
        }else if (month==2){      
            let leapYear = false;      
            if ( (!(year % 4) && year % 100) || !(year % 400)) {      
                leapYear = true;      
            }      
            if ((leapYear == false) && (day>=29)){      
                return false;      
            }else      
            if ((leapYear==true) && (day>29)){      
                return false;      
            }      
        }      
    }else{      
        return false;      
    }      
    return true; 
}
function validAge(date) {
    let today = new Date();
    let dob = new Date(date);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate < dob.getDate())) {
        age -= 1;
    }

    if (age < 21) return false;
    return true;
}

function validId(id) {
    if (!ObjectId(id) || !validString(id)) return false;
    return true;
}

function validPassword(password) {
    if(!validString(password)) return false;
    if (password.length < 8) return false;
    if (password === password.toLowerCase()) return false;

    let pwSplit = password.split('');
    let count = 0;
    for(let char of pwSplit) {
        let numCheck = parseInt(char);
        if(typeof numCheck === 'number') count += 1
    }

    if (count < 1 ) return false;
    return true
}

function validPhoneNumber(phone)
{
    regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    if(!phone) return false;
    if(phone.trim() == "") return false;
    return regex.test(phone);
}
function IsSpecialchar(val)
{
    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return format.test(val);
}
function IsNumber(val)
{
    return /\d/.test(val);
}
// function validString(data){
//     if(!string) return false;
//     if(data.trim().length === 0) return false;
//     if(typeof data != 'string') return false;
//     if(data instanceof String) return false;
//     return true;
// }
module.exports = {
    validString,
    validEmail,
    validDate,
    validId,
    validAge,
    validPassword,
    validPhoneNumber,
    IsNumber,
    IsSpecialchar,
    IsvalidDate
}