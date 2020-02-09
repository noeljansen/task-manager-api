
const sgMail = require('@sendgrid/mail')

//const sendgripAPI = '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'   //this is now saved as an environemtn varialbe in dev.env

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'noel.jansen@gmail.com',
        subject: ' Thanks for joining our site',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`     //Injecting the variable into the string with ES6: Need to use ` sign instead of quotes
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'noel.jansen@gmail.com',
        subject: 'sorry to see you go!',
        text: `Hi ${name}, we are sorry to see you leave our site. Come back soon!`
    })
}

//Example mail send
// sgMail.send({
//     to: 'noel.jansen@gmail.com',
//     from: ' noel.jansen@gmail.com',
//     subject: 'Test email',
//     text: 'I hope you get this email!'
// })

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail

}