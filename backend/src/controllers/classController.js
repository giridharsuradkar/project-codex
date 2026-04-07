const asyncHandler = require("../utils/asyncHandler");
const classModel = require("../models/classModel");

const getClasses = asyncHandler(async (req, res) => {
  const classes = await classModel.getAllClasses();
  res.json(classes);
});

const addClass = asyncHandler(async (req, res) => {
  await classModel.createClass(req.body);
  res.status(201).json({ message: "Class created successfully." });
});

const editClass = asyncHandler(async (req, res) => {
  await classModel.updateClass(req.params.id, req.body);
  res.json({ message: "Class updated successfully." });
});

const removeClass = asyncHandler(async (req, res) => {
  await classModel.deleteClass(req.params.id);
  res.json({ message: "Class deleted successfully." });
});

module.exports = {
  getClasses,
  addClass,
  editClass,
  removeClass,
};
