const transporter = require('../config/email');
const { generateOTP } = require('../utilities/otp');
const {getOtpTemplate } = require('../utilities/Emailtemplate')
const otpStore = {};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = generateOTP();

  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: getOtpTemplate(otp)
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ message: 'OTP verified successfully' });
  }

  res.status(400).json({ message: 'Invalid OTP' });
};