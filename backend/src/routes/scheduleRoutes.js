const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Add timetable
router.post("/", protect, authorize("faculty"), async (req, res) => {
  try {
    const { class_id, day_of_week, start_time, end_time, subject, classroom_id } = req.body;

    await db.query(
      `INSERT INTO class_schedules 
       (class_id, day_of_week, start_time, end_time, subject, classroom_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [class_id, day_of_week, start_time, end_time, subject, classroom_id]
    );

    res.json({ message: "Schedule added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding schedule" });
  }
});

// Get timetable
router.get("/:class_id", protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM class_schedules WHERE class_id = ?",
      [req.params.class_id]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule" });
  }
});

module.exports = router;