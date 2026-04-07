const pool = require("../config/db");

const getAllClasses = async () => {
  const [rows] = await pool.query(
    `SELECT classes.*,
            departments.name AS department_name,
            users.name AS faculty_name
     FROM classes
     JOIN departments ON classes.department_id = departments.id
     LEFT JOIN users ON classes.faculty_id = users.id
     ORDER BY classes.year_number, classes.division`
  );
  return rows;
};

const createClass = async (classData) => {
  const { department_id, name, year_number, division, faculty_id, student_count } = classData;
  const [result] = await pool.query(
    `INSERT INTO classes (department_id, name, year_number, division, faculty_id, student_count)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [department_id, name, year_number, division, faculty_id || null, student_count || 0]
  );
  return result;
};

const updateClass = async (id, classData) => {
  const { department_id, name, year_number, division, faculty_id, student_count } = classData;
  const [result] = await pool.query(
    `UPDATE classes
     SET department_id = ?, name = ?, year_number = ?, division = ?, faculty_id = ?, student_count = ?
     WHERE id = ?`,
    [department_id, name, year_number, division, faculty_id || null, student_count || 0, id]
  );
  return result;
};

const deleteClass = async (id) => {
  const [result] = await pool.query("DELETE FROM classes WHERE id = ?", [id]);
  return result;
};

const getFacultyClasses = async (facultyId) => {
  const [rows] = await pool.query(
    `SELECT classes.id, classes.name, classes.year_number, classes.division, departments.name AS department_name
     FROM classes
     JOIN departments ON classes.department_id = departments.id
     WHERE classes.faculty_id = ?`,
    [facultyId]
  );
  return rows;
};

module.exports = {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getFacultyClasses,
};
