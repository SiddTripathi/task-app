/*This file contains all of the code related to sending emails from user*/
const sgMail = require('@sendgrid/mail')

//send grid API key which is used by us to send email.
 //-->this is commented as we declared api key seperately in 
//dev.env for security purpose. API keys should not be hardcoded in JS

sgMail.setApiKey(process.env.SEND_GRID_APIKEY)

//welcome email when users create an account.
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'siddhart.tripathi@gmail.com',
        subject: 'Welcome to Task-App',
        text: `Welcome to the app, ${name}. Let us know how you get along with the app`
    })
}

//email when account is deleted
const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'siddhart.tripathi@gmail.com',
        subject: 'Cancellaction successful',
        text: `Hello ${name}, Thanks for using our applicaiton. We would like to take a moment of yours to know the reason you are leaving,Thanks`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}