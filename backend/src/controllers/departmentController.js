const asyncHandler = require("../utils/asyncHandler");
const departmentModel = require("../models/departmentModel");

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentModel.getAllDepartments();
  res.json(departments);
});

const addDepartment = asyncHandler(async (req, res) => {
  await departmentModel.createDepartment(req.body);
  res.status(201).json({ message: "Department created successfully." });
});

const editDepartment = asyncHandler(async (req, res) => {
  await departmentModel.updateDepartment(req.params.id, req.body);
  res.json({ message: "Department updated successfully." });
});

const removeDepartment = asyncHandler(async (req, res) => {
  await departmentModel.deleteDepartment(req.params.id);
  res.json({ message: "Department deleted successfully." });
});

module.exports = {
  getDepartments,
  addDepartment,
  editDepartment,
  removeDepartment,
};
