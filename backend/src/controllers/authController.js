const asyncHandler = require("../utils/asyncHandler");
const { loginUser } = require("../services/authService");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const result = await loginUser(email, password);
  res.json(result);
});

const profile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  login,
  profile,
};
