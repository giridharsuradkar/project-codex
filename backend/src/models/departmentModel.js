const pool = require("../config/db");

const getAllDepartments = async () => {
  const [rows] = await pool.query("SELECT * FROM departments ORDER BY name");
  return rows;
};

const createDepartment = async (department) => {
  const { name, code, description } = department;
  const [result] = await pool.query(
    "INSERT INTO departments (name, code, description) VALUES (?, ?, ?)",
    [name, code, description]
  );
  return result;
};

const updateDepartment = async (id, department) => {
  const { name, code, description } = department;
  const [result] = await pool.query(
    "UPDATE departments SET name = ?, code = ?, description = ? WHERE id = ?",
    [name, code, description, id]
  );
  return result;
};

const deleteDepartment = async (id) => {
  const [result] = await pool.query("DELETE FROM departments WHERE id = ?", [id]);
  return result;
};

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
