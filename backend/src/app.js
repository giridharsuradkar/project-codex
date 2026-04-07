const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const classRoutes = require("./routes/classRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "College Classroom Management API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

app.use(errorHandler);

module.exports = app;
