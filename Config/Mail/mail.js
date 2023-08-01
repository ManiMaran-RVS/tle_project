const client = require("@sendgrid/mail");

client.setApiKey(process.env.SENDGRID_API_KEY);
const sendMail = (template_id, from, to, templateData) => {
  let mailContent = {
    personalizations: [
      {
        to: to,
        dynamic_template_data: templateData,
      },
    ],
    from: from,
    template_id: template_id,
    subject: "Student Attendance Forgot Password Link",
    // html: <a href="resetPasswordLink">Click on the following link to reset your password</a>
  };
  var response=client.send(mailContent)
  return response
};

module.exports = sendMail;
