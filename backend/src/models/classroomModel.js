const pool = require("../config/db");

const getAllClassrooms = async () => {
  const [rows] = await pool.query("SELECT * FROM classrooms ORDER BY room_number");
  return rows;
};

const createClassroom = async (classroom) => {
  const {
    room_number,
    seating_capacity,
    has_projector,
    has_smart_board,
    building_name,
    floor_number,
  } = classroom;

  const [result] = await pool.query(
    `INSERT INTO classrooms
     (room_number, seating_capacity, has_projector, has_smart_board, building_name, floor_number)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [room_number, seating_capacity, has_projector, has_smart_board, building_name, floor_number || 0]
  );
  return result;
};

const updateClassroom = async (id, classroom) => {
  const {
    room_number,
    seating_capacity,
    has_projector,
    has_smart_board,
    building_name,
    floor_number,
  } = classroom;

  const [result] = await pool.query(
    `UPDATE classrooms
     SET room_number = ?, seating_capacity = ?, has_projector = ?, has_smart_board = ?, building_name = ?, floor_number = ?
     WHERE id = ?`,
    [room_number, seating_capacity, has_projector, has_smart_board, building_name, floor_number || 0, id]
  );
  return result;
};

const deleteClassroom = async (id) => {
  const [result] = await pool.query("DELETE FROM classrooms WHERE id = ?", [id]);
  return result;
};

const getAvailableClassrooms = async (dayOfWeek, startTime, endTime) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM classrooms
     WHERE id NOT IN (
       SELECT classroom_id
       FROM allocations
       WHERE day_of_week = ?
         AND start_time < ?
         AND end_time > ?
     )
     ORDER BY room_number`,
    [dayOfWeek, endTime, startTime]
  );
  return rows;
};

module.exports = {
  getAllClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getAvailableClassrooms,
};
