const express = require("express");
const controller = require("../controllers/classroomController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, controller.getClassrooms);
router.get("/availability", protect, controller.getAvailability);
router.post("/", protect, authorize("admin"), controller.addClassroom);
router.put("/:id", protect, authorize("admin"), controller.editClassroom);
router.delete("/:id", protect, authorize("admin"), controller.removeClassroom);

module.exports = router;
