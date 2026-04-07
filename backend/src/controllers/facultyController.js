const asyncHandler = require("../utils/asyncHandler");
const classModel = require("../models/classModel");
const classroomModel = require("../models/classroomModel");
const allocationModel = require("../models/allocationModel");

const getFacultyClasses = asyncHandler(async (req, res) => {
  const classes = await classModel.getFacultyClasses(req.user.id);
  res.json(classes);
});

const getFacultyAllocations = asyncHandler(async (req, res) => {
  const allocations = await allocationModel.getFacultyAllocationView(req.user.id);
  res.json(allocations);
});

const getAvailableClassrooms = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.query;
  const classrooms = await classroomModel.getAvailableClassrooms(dayOfWeek, startTime, endTime);
  res.json(classrooms);
});

const createRequest = asyncHandler(async (req, res) => {
  const requestPayload = {
    faculty_id: req.user.id,
    class_id: req.body.class_id,
    requested_classroom_id: req.body.requested_classroom_id,
    request_reason: req.body.request_reason,
  };

  await allocationModel.createClassroomRequest(requestPayload);
  res.status(201).json({ message: "Classroom change request submitted successfully." });
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await allocationModel.getFacultyRequests(req.user.id);
  res.json(requests);
});

module.exports = {
  getFacultyClasses,
  getFacultyAllocations,
  getAvailableClassrooms,
  createRequest,
  getRequests,
};
