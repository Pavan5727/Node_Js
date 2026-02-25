const fs = require('fs');
const path = require('path');

exports.getOtpTemplate = (otp) => {
  const filePath = path.join(__dirname, '../templates/mailtemplate.html');
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace('{{OTP}}', otp);
  return html;
};