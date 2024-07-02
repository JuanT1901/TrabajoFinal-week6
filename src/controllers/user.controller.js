const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(passwor, 10);

  const body = { ...req.body, password: hashedPassword };
  const result = await User.create(req.body);

  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.destroy({ where: { id } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;

  delete req.body.email;
  delete req.body.password;

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

  return res.json(user)
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
};