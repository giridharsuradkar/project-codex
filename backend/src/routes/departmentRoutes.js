const express = require("express");
const controller = require("../controllers/departmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, controller.getDepartments);
router.post("/", protect, authorize("admin"), controller.addDepartment);
router.put("/:id", protect, authorize("admin"), controller.editDepartment);
router.delete("/:id", protect, authorize("admin"), controller.removeDepartment);

module.exports = router;
