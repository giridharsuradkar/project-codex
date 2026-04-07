const API_BASE_URL = "http://localhost:5000/api";

const state = {
  token: localStorage.getItem("ccm_token") || "",
  user: JSON.parse(localStorage.getItem("ccm_user") || "null"),
};

const elements = {
  loginSection: document.getElementById("loginSection"),
  dashboardSection: document.getElementById("dashboardSection"),
  loginForm: document.getElementById("loginForm"),
  logoutBtn: document.getElementById("logoutBtn"),
  welcomeTitle: document.getElementById("welcomeTitle"),
  messageBox: document.getElementById("messageBox"),
  statsGrid: document.getElementById("statsGrid"),
  allocationsTable: document.getElementById("allocationsTable"),
  departmentsTable: document.getElementById("departmentsTable"),
  classesTable: document.getElementById("classesTable"),
  classroomsTable: document.getElementById("classroomsTable"),
  facultyClassesTable: document.getElementById("facultyClassesTable"),
  facultyAllocationsTable: document.getElementById("facultyAllocationsTable"),
  availabilityTable: document.getElementById("availabilityTable"),
  requestsTable: document.getElementById("requestsTable"),
  studentScheduleTable: document.getElementById("studentScheduleTable"),
};

const actionButtons = (type, item) =>
  state.user.role === "admin"
    ? `
      <div class="action-group">
        <button type="button" class="inline-btn" data-type="${type}" data-action="edit" data-id="${item.id}">Edit</button>
        <button type="button" class="inline-btn danger" data-type="${type}" data-action="delete" data-id="${item.id}">Delete</button>
      </div>
    `
    : "-";

const showMessage = (message, isError = false) => {
  elements.messageBox.textContent = message;
  elements.messageBox.style.color = isError ? "#b91c1c" : "#15803d";
};

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

const setSession = (token, user) => {
  state.token = token;
  state.user = user;
  localStorage.setItem("ccm_token", token);
  localStorage.setItem("ccm_user", JSON.stringify(user));
};

const clearSession = () => {
  state.token = "";
  state.user = null;
  localStorage.removeItem("ccm_token");
  localStorage.removeItem("ccm_user");
};

const renderRows = (target, rows, colspan = 6) => {
  target.innerHTML = rows.length ? rows.join("") : `<tr><td colspan="${colspan}">No data available.</td></tr>`;
};

const renderStats = async () => {
  const [departments, classes, classrooms, allocations] = await Promise.all([
    apiRequest("/departments"),
    apiRequest("/classes"),
    apiRequest("/classrooms"),
    apiRequest("/allocations"),
  ]);

  const cards = [
    { title: "Departments", value: departments.length, note: "Academic groups configured" },
    { title: "Classes", value: classes.length, note: "Year and division combinations" },
    { title: "Classrooms", value: classrooms.length, note: "Rooms ready for allocation" },
    { title: "Allocations", value: allocations.length, note: "Scheduled classroom slots" },
  ];

  elements.statsGrid.innerHTML = cards
    .map(
      (card) => `
        <div class="stat-card">
          <h4>${card.title}</h4>
          <strong>${card.value}</strong>
          <p>${card.note}</p>
        </div>
      `
    )
    .join("");

  renderRows(
    elements.allocationsTable,
    allocations.map(
      (item) => `
        <tr>
          <td>${item.class_name}</td>
          <td>${item.department_name}</td>
          <td>${item.room_number}</td>
          <td>${item.day_of_week}</td>
          <td>${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}</td>
          <td>${item.status}</td>
          <td>${actionButtons("allocation", item)}</td>
        </tr>
      `
    ),
    7
  );

  if (state.user.role === "admin") {
    renderRows(
      elements.departmentsTable,
      departments.map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.code}</td>
            <td>${actionButtons("department", item)}</td>
          </tr>
        `
      ),
      3
    );

    renderRows(
      elements.classesTable,
      classes.map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.department_name}</td>
            <td>${item.faculty_name || "-"}</td>
            <td>${actionButtons("class", item)}</td>
          </tr>
        `
      ),
      4
    );

    renderRows(
      elements.classroomsTable,
      classrooms.map(
        (item) => `
          <tr>
            <td>${item.room_number}</td>
            <td>${item.seating_capacity}</td>
            <td>${item.has_projector ? "Projector " : ""}${item.has_smart_board ? "Smart board" : ""}</td>
            <td>${actionButtons("classroom", item)}</td>
          </tr>
        `
      ),
      4
    );
  }
};

const renderFacultyPanel = async () => {
  if (state.user.role !== "faculty") {
    return;
  }

  const [classes, allocations, requests] = await Promise.all([
    apiRequest("/faculty/classes"),
    apiRequest("/faculty/allocations"),
    apiRequest("/faculty/requests"),
  ]);

  renderRows(
    elements.facultyClassesTable,
    classes.map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.department_name}</td>
          <td>${item.year_number}</td>
        </tr>
      `
    ),
    3
  );

  renderRows(
    elements.facultyAllocationsTable,
    allocations.map(
      (item) => `
        <tr>
          <td>${item.class_name}</td>
          <td>${item.room_number}</td>
          <td>${item.day_of_week}, ${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}</td>
        </tr>
      `
    ),
    3
  );

  renderRows(
    elements.requestsTable,
    requests.map(
      (item) => `
        <tr>
          <td>${item.class_name}</td>
          <td>${item.room_number}</td>
          <td>${item.request_reason}</td>
          <td>${item.status}</td>
        </tr>
      `
    ),
    4
  );
};

const renderStudentPanel = async () => {
  if (state.user.role !== "student") {
    return;
  }

  const schedule = await apiRequest("/student/schedule");
  renderRows(
    elements.studentScheduleTable,
    schedule.map(
      (item) => `
        <tr>
          <td>${item.subject_name}</td>
          <td>${item.class_name}</td>
          <td>${item.department_name}</td>
          <td>${item.day_of_week}</td>
          <td>${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}</td>
          <td>${item.room_number || "Not assigned"}</td>
        </tr>
      `
    )
  );
};

const updateVisibilityByRole = () => {
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.toggle("hidden", state.user.role !== "admin"));
  document.querySelectorAll(".faculty-only").forEach((el) => el.classList.toggle("hidden", state.user.role !== "faculty"));
  document.querySelectorAll(".student-only").forEach((el) => el.classList.toggle("hidden", state.user.role !== "student"));
};

const loadDashboard = async () => {
  if (!state.token || !state.user) {
    elements.loginSection.classList.remove("hidden");
    elements.dashboardSection.classList.add("hidden");
    return;
  }

  elements.welcomeTitle.textContent = `Welcome, ${state.user.name} (${state.user.role})`;
  elements.loginSection.classList.add("hidden");
  elements.dashboardSection.classList.remove("hidden");
  updateVisibilityByRole();

  await renderStats();
  await renderFacultyPanel();
  await renderStudentPanel();
};

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    });

    setSession(data.token, data.user);
    showMessage("Login successful.");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
});

elements.logoutBtn.addEventListener("click", () => {
  clearSession();
  showMessage("You have been logged out.");
  loadDashboard();
});

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

document.getElementById("departmentForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/departments", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("departmentName").value,
        code: document.getElementById("departmentCode").value,
        description: document.getElementById("departmentDescription").value,
      }),
    });
    event.target.reset();
    showMessage("Department added successfully.");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.getElementById("classForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/classes", {
      method: "POST",
      body: JSON.stringify({
        department_id: Number(document.getElementById("classDepartmentId").value),
        name: document.getElementById("className").value,
        year_number: Number(document.getElementById("classYear").value),
        division: document.getElementById("classDivision").value,
        faculty_id: document.getElementById("classFacultyId").value ? Number(document.getElementById("classFacultyId").value) : null,
        student_count: Number(document.getElementById("classStrength").value || 0),
      }),
    });
    event.target.reset();
    showMessage("Class added successfully.");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.getElementById("classroomForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/classrooms", {
      method: "POST",
      body: JSON.stringify({
        room_number: document.getElementById("roomNumber").value,
        seating_capacity: Number(document.getElementById("seatingCapacity").value),
        building_name: document.getElementById("buildingName").value,
        floor_number: Number(document.getElementById("floorNumber").value || 0),
        has_projector: document.getElementById("hasProjector").checked,
        has_smart_board: document.getElementById("hasSmartBoard").checked,
      }),
    });
    event.target.reset();
    showMessage("Classroom added successfully.");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.getElementById("allocationForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/allocations", {
      method: "POST",
      body: JSON.stringify({
        class_id: Number(document.getElementById("allocationClassId").value),
        classroom_id: Number(document.getElementById("allocationRoomId").value),
        day_of_week: document.getElementById("allocationDay").value,
        start_time: document.getElementById("allocationStartTime").value,
        end_time: document.getElementById("allocationEndTime").value,
        semester_label: document.getElementById("allocationSemester").value,
        status: document.getElementById("allocationStatus").value,
      }),
    });
    event.target.reset();
    showMessage("Classroom allocation created successfully.");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.getElementById("availabilityForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const query = new URLSearchParams({
      dayOfWeek: document.getElementById("availabilityDay").value,
      startTime: document.getElementById("availabilityStart").value,
      endTime: document.getElementById("availabilityEnd").value,
    });

    const rooms = await apiRequest(`/faculty/classrooms/availability?${query.toString()}`);

    renderRows(
      elements.availabilityTable,
      rooms.map(
        (room) => `
          <tr>
            <td>${room.room_number}</td>
            <td>${room.seating_capacity}</td>
            <td>${room.has_projector ? "Projector " : ""}${room.has_smart_board ? "Smart board" : ""}</td>
          </tr>
        `
      ),
      3
    );
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.getElementById("requestForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await apiRequest("/faculty/requests", {
      method: "POST",
      body: JSON.stringify({
        class_id: Number(document.getElementById("requestClassId").value),
        requested_classroom_id: Number(document.getElementById("requestClassroomId").value),
        request_reason: document.getElementById("requestReason").value,
      }),
    });
    event.target.reset();
    showMessage("Classroom change request submitted.");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, true);
  }
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");

  if (!button || state.user?.role !== "admin") {
    return;
  }

  const { type, action, id } = button.dataset;

  try {
    if (action === "delete") {
      const confirmed = window.confirm(`Delete this ${type}?`);
      if (!confirmed) {
        return;
      }

      const endpointMap = {
        department: "/departments",
        class: "/classes",
        classroom: "/classrooms",
        allocation: "/allocations",
      };

      await apiRequest(`${endpointMap[type]}/${id}`, { method: "DELETE" });
      showMessage(`${type} deleted successfully.`);
      await loadDashboard();
      return;
    }

    if (action === "edit") {
      await handleEdit(type, id);
    }
  } catch (error) {
    showMessage(error.message, true);
  }
});

const handleEdit = async (type, id) => {
  const endpointMap = {
    department: "/departments",
    class: "/classes",
    classroom: "/classrooms",
    allocation: "/allocations",
  };

  const collection = await apiRequest(endpointMap[type]);
  const item = collection.find((entry) => String(entry.id) === String(id));

  if (!item) {
    throw new Error(`Unable to find ${type} data.`);
  }

  let payload = null;

  if (type === "department") {
    payload = {
      name: prompt("Department name", item.name) || item.name,
      code: prompt("Department code", item.code) || item.code,
      description: prompt("Department description", item.description || "") || item.description || "",
    };
  }

  if (type === "class") {
    payload = {
      department_id: Number(prompt("Department ID", item.department_id) || item.department_id),
      name: prompt("Class name", item.name) || item.name,
      year_number: Number(prompt("Year number", item.year_number) || item.year_number),
      division: prompt("Division", item.division) || item.division,
      faculty_id: Number(prompt("Faculty ID", item.faculty_id || 0) || item.faculty_id || 0) || null,
      student_count: Number(prompt("Student count", item.student_count || 0) || item.student_count || 0),
    };
  }

  if (type === "classroom") {
    payload = {
      room_number: prompt("Room number", item.room_number) || item.room_number,
      seating_capacity: Number(prompt("Seating capacity", item.seating_capacity) || item.seating_capacity),
      building_name: prompt("Building name", item.building_name || "") || item.building_name || "",
      floor_number: Number(prompt("Floor number", item.floor_number || 0) || item.floor_number || 0),
      has_projector: window.confirm("Should this classroom have a projector? Click OK for Yes, Cancel for No."),
      has_smart_board: window.confirm("Should this classroom have a smart board? Click OK for Yes, Cancel for No."),
    };
  }

  if (type === "allocation") {
    payload = {
      class_id: Number(prompt("Class ID", item.class_id) || item.class_id),
      classroom_id: Number(prompt("Classroom ID", item.classroom_id) || item.classroom_id),
      day_of_week: prompt("Day of week", item.day_of_week) || item.day_of_week,
      start_time: prompt("Start time (HH:MM:SS)", item.start_time) || item.start_time,
      end_time: prompt("End time (HH:MM:SS)", item.end_time) || item.end_time,
      semester_label: prompt("Semester label", item.semester_label) || item.semester_label,
      status: prompt("Status", item.status) || item.status,
    };
  }

  await apiRequest(`${endpointMap[type]}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  showMessage(`${type} updated successfully.`);
  await loadDashboard();
};

loadDashboard().catch((error) => {
  showMessage(error.message, true);
});
