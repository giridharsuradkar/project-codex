const pool = require("../config/db");

const getAllAllocations = async () => {
  const [rows] = await pool.query(
    `SELECT allocations.*,
            classes.name AS class_name,
            departments.name AS department_name,
            classrooms.room_number,
            classrooms.building_name
     FROM allocations
     JOIN classes ON allocations.class_id = classes.id
     JOIN departments ON classes.department_id = departments.id
     JOIN classrooms ON allocations.classroom_id = classrooms.id
     ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
              start_time`
  );
  return rows;
};

const createAllocation = async (allocation) => {
  const { class_id, classroom_id, day_of_week, start_time, end_time, semester_label, status } = allocation;
  const [result] = await pool.query(
    `INSERT INTO allocations
     (class_id, classroom_id, day_of_week, start_time, end_time, semester_label, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [class_id, classroom_id, day_of_week, start_time, end_time, semester_label, status || "scheduled"]
  );
  return result;
};

const updateAllocation = async (id, allocation) => {
  const { class_id, classroom_id, day_of_week, start_time, end_time, semester_label, status } = allocation;
  const [result] = await pool.query(
    `UPDATE allocations
     SET class_id = ?, classroom_id = ?, day_of_week = ?, start_time = ?, end_time = ?, semester_label = ?, status = ?
     WHERE id = ?`,
    [class_id, classroom_id, day_of_week, start_time, end_time, semester_label, status || "scheduled", id]
  );
  return result;
};

const deleteAllocation = async (id) => {
  const [result] = await pool.query("DELETE FROM allocations WHERE id = ?", [id]);
  return result;
};

const getStudentSchedule = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT class_schedules.subject_name,
            class_schedules.day_of_week,
            class_schedules.start_time,
            class_schedules.end_time,
            class_schedules.semester_label,
            classes.name AS class_name,
            classrooms.room_number,
            departments.name AS department_name
     FROM class_schedules
     JOIN classes ON class_schedules.class_id = classes.id
     JOIN users ON users.class_id = classes.id
     LEFT JOIN allocations
       ON allocations.class_id = class_schedules.class_id
      AND allocations.day_of_week = class_schedules.day_of_week
      AND allocations.start_time = class_schedules.start_time
      AND allocations.end_time = class_schedules.end_time
     LEFT JOIN classrooms ON allocations.classroom_id = classrooms.id
     JOIN departments ON classes.department_id = departments.id
     WHERE users.id = ?
     ORDER BY FIELD(class_schedules.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
              class_schedules.start_time`
    ,
    [studentId]
  );
  return rows;
};

const getFacultyAllocationView = async (facultyId) => {
  const [rows] = await pool.query(
    `SELECT allocations.id,
            allocations.day_of_week,
            allocations.start_time,
            allocations.end_time,
            allocations.semester_label,
            allocations.status,
            classes.name AS class_name,
            classrooms.room_number,
            classrooms.seating_capacity,
            classrooms.has_projector,
            classrooms.has_smart_board
     FROM allocations
     JOIN classes ON allocations.class_id = classes.id
     JOIN classrooms ON allocations.classroom_id = classrooms.id
     WHERE classes.faculty_id = ?
     ORDER BY FIELD(allocations.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
              allocations.start_time`,
    [facultyId]
  );
  return rows;
};

const createClassroomRequest = async (requestData) => {
  const { faculty_id, class_id, requested_classroom_id, request_reason } = requestData;
  const [result] = await pool.query(
    `INSERT INTO classroom_requests
     (faculty_id, class_id, requested_classroom_id, request_reason)
     VALUES (?, ?, ?, ?)`,
    [faculty_id, class_id, requested_classroom_id, request_reason]
  );
  return result;
};

const getFacultyRequests = async (facultyId) => {
  const [rows] = await pool.query(
    `SELECT classroom_requests.*,
            classes.name AS class_name,
            classrooms.room_number
     FROM classroom_requests
     JOIN classes ON classroom_requests.class_id = classes.id
     JOIN classrooms ON classroom_requests.requested_classroom_id = classrooms.id
     WHERE classroom_requests.faculty_id = ?
     ORDER BY classroom_requests.created_at DESC`,
    [facultyId]
  );
  return rows;
};

module.exports = {
  getAllAllocations,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getStudentSchedule,
  getFacultyAllocationView,
  createClassroomRequest,
  getFacultyRequests,
};
