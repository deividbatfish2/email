const nodemailer = require("nodemailer");

async function sendEmail(email) {

    const {from, to, subject, text, html} = email
  // create reusable transporter object using the default SMTP transport
  console.log(`host: ${process.env.SMTP_HOST}, SMTP_PORT: ${process.env.SMTP_PORT}, SMTP_ACCOUNT_USER: ${process.env.SMTP_ACCOUNT_USER}, SMTP_ACCOUNT_PASSWORD: ${process.env.SMTP_ACCOUNT_PASSWORD}, host: ${process.env.SMTP_HOST}`)
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_ACCOUNT_USER,
      pass: process.env.SMTP_ACCOUNT_PASSWORD
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from,
    to,
    subject,
    text,
    html,
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  const emailSent = {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info)
  }

  return emailSent
}
module.exports = sendEmail