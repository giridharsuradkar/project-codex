const express = require("express");
const controller = require("../controllers/studentController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/schedule", protect, authorize("student"), controller.getSchedule);

module.exports = router;
