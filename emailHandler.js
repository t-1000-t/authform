const sgMail = require('@sendgrid/mail')

require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.emailHandler = function ({ to, from, subject, text, html }) {
  const msg = {
    to: to,
    from: from, // Use the email address or domain you verified above
    subject: subject,
    text: text,
    html: html,
  }
  //ES6
  return sgMail.send(msg)
}
