const User = require("../models/User");
const catchError = require("../utils/catchError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.status(200).json(results);
});

const create = catchError(async (req, res) => {
  const result = await User.create(req.body);
  return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.destroy({ where: { id } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;

  const secretCredentials = ["password", "email"];
  secretCredentials.forEach((credential) => delete req.body[credential]);

  const result = await User.update(req.body, {
    where: { id },
    returning: true,
  });
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.sendStatus(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.sendStatus(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json({ user, token });
});

module.exports = {
  getAll,
  create,
  remove,
  update,
  login,
};
