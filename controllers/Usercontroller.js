const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = "mysecretkey";

const generateUserId = () => {
  return 'USER' + Date.now();
};

exports.createUser = async (req, res) => {
  try {

    const { name, email, mobile, password, address } = req.body;

    // check password
    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      address,
      password: hashedPassword,
      userId: generateUserId()
    });

    await user.save();

    // generate token
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      userId: user.userId,
      token: token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getUsers = async (req, res) => {
  try {

    const users = await User.find();

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};