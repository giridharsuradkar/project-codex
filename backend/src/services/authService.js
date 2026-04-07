const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const loginUser = async (email, password) => {
  const [rows] = await pool.query(
    "SELECT id, name, role, email, password FROM users WHERE email = ?",
    [email]
  );

  const user = rows[0];

  if (!user) {
    throw { statusCode: 401, message: "Invalid email or password." };
  }

  const isPasswordHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$");
  const isPasswordValid = isPasswordHashed
    ? await bcrypt.compare(password, user.password)
    : password === user.password;

  if (!isPasswordValid) {
    throw { statusCode: 401, message: "Invalid email or password." };
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = { loginUser };
