const User = require('../models/User');
const generateUserId = ()=>{
  return 'USER' + Date.now();
}
exports.createUser = async (req, res) => {
 try {
    const user = new User({
      ...req.body,
      userId: generateUserId()
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: user.userId
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};