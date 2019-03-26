const nodemailer = require("nodemailer");

async function sendEmail(email) {

    const {from, to, subject, text, html} = email
  // create reusable transporter object using the default SMTP transport
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

  const emailSent = {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info)
  }

  return emailSent
}
module.exports = sendEmail