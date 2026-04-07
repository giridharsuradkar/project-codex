const express = require("express");
const controller = require("../controllers/facultyController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/classes", protect, authorize("faculty"), controller.getFacultyClasses);
router.get("/allocations", protect, authorize("faculty"), controller.getFacultyAllocations);
router.get("/classrooms/availability", protect, authorize("faculty"), controller.getAvailableClassrooms);
router.post("/requests", protect, authorize("faculty"), controller.createRequest);
router.get("/requests", protect, authorize("faculty"), controller.getRequests);

module.exports = router;
