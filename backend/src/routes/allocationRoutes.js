const express = require("express");
const controller = require("../controllers/allocationController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, controller.getAllocations);
router.post("/", protect, authorize("admin"), controller.addAllocation);
router.put("/:id", protect, authorize("admin"), controller.editAllocation);
router.delete("/:id", protect, authorize("admin"), controller.removeAllocation);

module.exports = router;
