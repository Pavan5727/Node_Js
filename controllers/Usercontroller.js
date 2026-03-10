const User = require('../models/User');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = "mysecretkey";

const generateUserId = () => {
  return 'USER' + Date.now();
};

exports.signIn = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
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
      { expiresIn: "24h" }
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

exports.userInfo = async (req, res) => {
  try {

    const userId = req.user.userId; // from JWT token

    const user = await User.findOne({ userId }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.createRole = async (req, res) => {
  try {

    const { roleName, emails, permissions } = req.body;

    if (!roleName) {
      return res.status(400).json({
        message: "Role name is required"
      });
    }

    const existingRole = await Role.findOne({ roleName });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists"
      });
    }

    const role = new Role({
      roleName,
      permissions,
      users: emails.map(email => ({ email }))
    });

    await role.save();

    await User.updateMany(
      { email: { $in: emails } },
      { $set: { role: roleName } }
    );

    res.status(201).json({
      message: "Role created successfully",
      role
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getUserAccess = async (req, res) => {
  try {
    const email = req.params.email;

    const role = await Role.findOne({
      "users.email": email
    });

    if (!role) {
      return res.status(404).json({
        message: "User has no role assigned"
      });
    }

    res.status(200).json({
      email: email,
      role: role.roleName,
      permissions: role.permissions
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching access",
      error: error.message
    });
  }
};