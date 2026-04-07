const asyncHandler = require("../utils/asyncHandler");
const classroomModel = require("../models/classroomModel");

const getClassrooms = asyncHandler(async (req, res) => {
  const classrooms = await classroomModel.getAllClassrooms();
  res.json(classrooms);
});

const addClassroom = asyncHandler(async (req, res) => {
  await classroomModel.createClassroom(req.body);
  res.status(201).json({ message: "Classroom created successfully." });
});

const editClassroom = asyncHandler(async (req, res) => {
  await classroomModel.updateClassroom(req.params.id, req.body);
  res.json({ message: "Classroom updated successfully." });
});

const removeClassroom = asyncHandler(async (req, res) => {
  await classroomModel.deleteClassroom(req.params.id);
  res.json({ message: "Classroom deleted successfully." });
});

const getAvailability = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.query;

  if (!dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({ message: "dayOfWeek, startTime and endTime are required." });
  }

  const classrooms = await classroomModel.getAvailableClassrooms(dayOfWeek, startTime, endTime);
  res.json(classrooms);
});

module.exports = {
  getClassrooms,
  addClassroom,
  editClassroom,
  removeClassroom,
  getAvailability,
};
