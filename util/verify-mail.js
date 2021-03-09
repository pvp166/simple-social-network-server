const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport");
const {API_KEY_SENDGRID, CLIENT_URL} = require("../config");
module.exports.mailVerify = (username = 'Phuc', token = 'abc', ) => {
  const output = `
    <p>Your username is: </p>
    <p>${username}</p>
    <p>Visit this link to verify your email address:</p>
    <p>${CLIENT_URL}/authentication/activate/${token}</p>
    <p>Thanks for using the site!</p>
`

let transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: API_KEY_SENDGRID
  }
}));
const mailOptions = {
  from: 'van-phuc.pham@mohawkcollege.ca',
  to: 'phuchp1997@gmail.com',
  subject: 'Invoices due',
  html: output
};
transporter.sendMail(mailOptions, function (err, data) {
  if (err) {
    console.log('Err', err);
  }else{
    console.log('Message sent!!!!');
  }
});
}
