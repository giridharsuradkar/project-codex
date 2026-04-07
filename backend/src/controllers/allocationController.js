const asyncHandler = require("../utils/asyncHandler");
const allocationModel = require("../models/allocationModel");

const getAllocations = asyncHandler(async (req, res) => {
  const allocations = await allocationModel.getAllAllocations();
  res.json(allocations);
});

const addAllocation = asyncHandler(async (req, res) => {
  await allocationModel.createAllocation(req.body);
  res.status(201).json({ message: "Allocation created successfully." });
});

const editAllocation = asyncHandler(async (req, res) => {
  await allocationModel.updateAllocation(req.params.id, req.body);
  res.json({ message: "Allocation updated successfully." });
});

const removeAllocation = asyncHandler(async (req, res) => {
  await allocationModel.deleteAllocation(req.params.id);
  res.json({ message: "Allocation deleted successfully." });
});

module.exports = {
  getAllocations,
  addAllocation,
  editAllocation,
  removeAllocation,
};
