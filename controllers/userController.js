const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;
  const { error } = validate(req.body);

  if (error) {
    if (error.message === `"Email" must be a valid email`)
      return res
        .status(400)
        .send({ message: "This Email Address doesn't exist." });
    return res.status(400).send({ message: error.details[0].message });
  }

  if (!email || !password)
    return res
      .status(400)
      .send({ message: "Email and Password are required." });

  const duplicateEmail = await User.findOne({ email: email });

  if (duplicateEmail)
    return res
      .status(409)
      .send({ message: "User with given Email already exist!" });

  const duplicateUsername = await User.findOne({ username: username });

  if (duplicateUsername)
    return res
      .status(409)
      .send({ message: "User with given Username already exist!" });

  try {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPwd = await bcrypt.hash(password, salt);
    const result = await User.create({
      ...req.body,
      password: hashedPwd,
    });
    console.log(result);
    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password are required." });

  const foundUser = await User.findOne({ username });

  if (!foundUser)
    return res.status(401).send({ message: "Invalid Username or Password" });

  const validPassword = await bcrypt.compare(password, foundUser.password);

  if (validPassword) {
    const token = jwt.sign(
      {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        phone: foundUser.phone,
      },
      process.env.ACCESS_TOKEN_SECRET || "TOKEN_SECRET",
      { expiresIn: "1d" }
    );

    const result = await foundUser.save();
    console.log(result);

    return res.send({
      token,
    });
  } else {
    return res.status(401).send({ message: "Invalid Username or Password" });
  }
};

const handleGetUser = async (req, res) => {
  try {
    foundUser = await User.findOne({ _id: req.params.id });
    if (!foundUser) return res.status(404).send({ message: "User not found." });
    res.status(200).send({
      _id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      phone: foundUser.phone,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const duplicateEmail = await User.findOne({ email: req.body.email, _id: {$ne : req.params.id} });

    if (duplicateEmail)
      return res
        .status(409)
        .send({ message: "User with given Email already exist!" });
  
    const duplicateUsername = await User.findOne({ username: req.body.username, _id: {$ne : req.params.id} });
  
    if (duplicateUsername)
      return res
        .status(409)
        .send({ message: "User with given Username already exist!" });

    foundUser = await User.findOne({ _id: req.params.id });

    if (!foundUser) return res.status(404).send({ message: "User not found." });

    await foundUser.updateOne(req.body, { runValidators: true });
    await foundUser.save();

    const token = jwt.sign(
      {
        _id: foundUser._id,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
      },
      process.env.ACCESS_TOKEN_SECRET || "TOKEN_SECRET",
      { expiresIn: "1d" }
    );
    return res.send({
      token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log(err);
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(204).send({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleUpdateUser,
  handleGetUser,
  handleDeleteUser,
};
