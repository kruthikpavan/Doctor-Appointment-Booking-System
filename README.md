# Doctor-Appointment-Booking-System
 + A forum for patients and doctors to interact regarding appointment scheduling and to eliminate pre-    appointment protocols. We have also introduced a review system for subsequent patients.
  + Built using HTML,CSS,Bootstrap,Express,Node.js and MongoDB.
## How to Setup
 ### Running it Locally
1. Run `npm i` in the terminal to install node dependencies.
2. Run `npm run seed` to seed the database.
3. Run `npm start` to start the website.
### View Ready Made Accounts
There are two login forms for our website, one is for the user and the other is for the doctor.Here are some pre-made account logins:
1. For user
+ user1 | Test@123
+ bahu1 | Kattapa@123
2. For Doctor
+ user@gmail.com | Test@123
+ Samule@yahoo.com | onbusns!23U
Note: For more sample data refer seed.js file.
## How the Application Works
Upon loading the website, you will see our landing page with a little bit of information about our website and an option to login or signup.However, to view additional content, you must sign up or log into an account.
1. ### user
#### Home Page
+ ** View Profile ** : you can view your details and will be able to edit your details as well.
+ **  View appointments ** : you can view your upcoming and your previous appointments as well.
+ ** search bar ** : You will be able to search doctors by their name or by their specialization
+ ** doctors info ** : See the available doctors name, their specialization, reviews, book appointment. 
+ ** Logout ** : An option to logout
#### Book Appointment:
+ In this page you will be able to select the date for booking the appointment and after selecting the Available slots button you will be redirected to select slot page.
#### Select-Slot
+ Here you can see the all the time slots for the day which you selected in Book-Appointments, you can select one slot and click on Book this slot to cnf the appointment.
#### Reviews
+ Here we can see all the reviews provided for that particular doctor, it includes what the review says along with the corresponding sentiment analysis emoji, and the date on which the review is posted
#### My appointments
+ Here the user can see all his apointments  and perform 3 actions - Book,Cancel and Reschedule Appointments. Note, User cannot cancel an already completed Appointment, user cannot book another appointment if he has an existing appointment, user cannot rescedule or book another appointment if he already requested foir a reschedule. He will be allowed to send review once his appointment is fulfilled.Ex IF Appointment is booked at 2pm, user can review it only after 2 pm.
#### My profile
+ Here the user can see his details and also can update his profile
#### Post-Review
+ Here the user will be able to post a review for a particular doctor after his appointment with that doctor is completed.
2. ### Doctor
#### Doctors-Homepage:
+ As soon as a doctor logs in he/she will be redirected to doctors homepage where they will be having options to either go to their profile, see their reschedule requests, or see their upcoming appointments.
#### Doctors-Profile
+ If the doctors selects my profile in his homepage he will be redirected to this page where he/she can see their details and can also edit their details as well.
#### Reschedule-Request
+ All the reschedule requests can be seen in this page and the doctor can either accept or reject the request
#### Appointments
+ All the appointments corresponding to this particular doctor can be seen in this page
