const asyncHandler = require("../utils/asyncHandler");
const allocationModel = require("../models/allocationModel");

const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await allocationModel.getStudentSchedule(req.user.id);
  res.json(schedule);
});

module.exports = {
  getSchedule,
};
