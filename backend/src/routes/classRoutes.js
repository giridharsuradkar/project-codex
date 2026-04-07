const express = require("express");
const controller = require("../controllers/classController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, controller.getClasses);
router.post("/", protect, authorize("admin"), controller.addClass);
router.put("/:id", protect, authorize("admin"), controller.editClass);
router.delete("/:id", protect, authorize("admin"), controller.removeClass);

module.exports = router;
