// Initial Data
let tasks = [
  {
    id: 1,
    name: "Finish Math Homework",
    dueDate: "2025-12-10",
    status: "pending",
    subject: "Math",
  },
  {
    id: 2,
    name: "Revise for IPT exam",
    dueDate: "2025-12-12",
    status: "done",
    subject: "IPT",
  },
  {
    id: 3,
    name: "SA101 Lab Report",
    dueDate: "2025-12-16",
    status: "pending",
    subject: "SA101",
  },
  {
    id: 4,
    name: "Submit English Essay",
    dueDate: "2025-12-18",
    status: "overdue",
    subject: "English",
  },
];

let notes = [
  {
    id: 1,
    title: "Lecture Note Title",
    url: "www.lecturelink.com",
    date: "2023-11-02",
  },
  {
    id: 2,
    title: "Chemistry Procedures",
    url: "www.chemistrylab.com",
    date: "2023-11-01",
  },
];

let resources = [
  {
    id: 1,
    title: "Laboratory Online",
    url: "www.labonline.com",
    date: "2023-11-02",
  },
  {
    id: 2,
    title: "Citation Guide",
    url: "www.citationguide.com",
    date: "2025-12-14",
  },
];

// Editing State
let editingTaskId = null;
let editingNoteId = null;
let editingResourceId = null;

// DOM Elements
const taskList = document.getElementById("taskList");
const notesList = document.getElementById("notesList");
const resourcesList = document.getElementById("resourcesList");
const pendingCount = document.getElementById("pendingCount");
const doneCount = document.getElementById("doneCount");
const overdueCount = document.getElementById("overdueCount");
const subjectFilter = document.getElementById("subjectFilter");

// Modal Elements
const taskModal = document.getElementById("taskModal");
const noteModal = document.getElementById("noteModal");
const resourceModal = document.getElementById("resourceModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const addNoteBtn = document.getElementById("addNoteBtn");
const addResourceBtn = document.getElementById("addResourceBtn");

const taskForm = document.getElementById("taskForm");
const noteForm = document.getElementById("noteForm");
const resourceForm = document.getElementById("resourceForm");

const taskModalTitle = taskModal.querySelector("h2");
const noteModalTitle = noteModal.querySelector("h2");
const resourceModalTitle = resourceModal.querySelector("h2");

const taskSubmitBtn = taskForm.querySelector('button[type="submit"]');
const noteSubmitBtn = noteForm.querySelector('button[type="submit"]');
const resourceSubmitBtn = resourceForm.querySelector('button[type="submit"]');

// Close Buttons
const closeBtns = document.querySelectorAll(".close-btn");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  renderNotes();
  renderResources();
  updateSubjectFilter();
  updateTaskCounts();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Tab switching
  const navTabs = document.querySelectorAll(".nav-tab");
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // Add buttons
  addTaskBtn.addEventListener("click", () => {
    resetTaskFormState();
    taskModal.classList.add("active");
  });

  addNoteBtn.addEventListener("click", () => {
    resetNoteFormState();
    noteModal.classList.add("active");
  });

  addResourceBtn.addEventListener("click", () => {
    resetResourceFormState();
    resourceModal.classList.add("active");
  });

  // Close modals
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeAllModals();
    }
  });

  // Form submissions
  taskForm.addEventListener("submit", handleAddTask);
  noteForm.addEventListener("submit", handleAddNote);
  resourceForm.addEventListener("submit", handleAddResource);

  // Subject filter
  if (subjectFilter) {
    subjectFilter.addEventListener("change", renderTasks);
  }

  // Logout button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("Logging out...");
    });
  }
}

// Modal Helpers
function setTaskModalMode(mode) {
  if (mode === "edit") {
    taskModalTitle.textContent = "Edit Task";
    taskSubmitBtn.textContent = "Save Task";
    return;
  }

  taskModalTitle.textContent = "Add New Task";
  taskSubmitBtn.textContent = "Add Task";
}

function setNoteModalMode(mode) {
  if (mode === "edit") {
    noteModalTitle.textContent = "Edit Note";
    noteSubmitBtn.textContent = "Save Note";
    return;
  }

  noteModalTitle.textContent = "Add New Note";
  noteSubmitBtn.textContent = "Add Note";
}

function setResourceModalMode(mode) {
  if (mode === "edit") {
    resourceModalTitle.textContent = "Edit Resource";
    resourceSubmitBtn.textContent = "Save Resource";
    return;
  }

  resourceModalTitle.textContent = "Add New Resource";
  resourceSubmitBtn.textContent = "Add Resource";
}

function resetTaskFormState() {
  editingTaskId = null;
  setTaskModalMode("add");
  taskForm.reset();
}

function resetNoteFormState() {
  editingNoteId = null;
  setNoteModalMode("add");
  noteForm.reset();
}

function resetResourceFormState() {
  editingResourceId = null;
  setResourceModalMode("add");
  resourceForm.reset();
}

// Close all modals
function closeAllModals() {
  taskModal.classList.remove("active");
  noteModal.classList.remove("active");
  resourceModal.classList.remove("active");

  resetTaskFormState();
  resetNoteFormState();
  resetResourceFormState();
}

// Render Tasks
function renderTasks() {
  tasks.forEach(normalizeTaskStatus);

  const filter = subjectFilter ? subjectFilter.value : "all";
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.subject === filter);

  taskList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = `task-item ${task.status}`;
    taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.status === "done" ? "checked" : ""} onchange="toggleTaskStatus(${task.id})">
            <div class="task-content">
                <div class="task-name">${task.name}</div>
                <div class="task-due">${getDueDateText(task.dueDate, task.status)}</div>
            </div>
            <div class="task-actions">
                <i class="fas fa-edit" onclick="editTask(${task.id})"></i>
                <i class="fas fa-trash" onclick="deleteTask(${task.id})"></i>
            </div>
        `;
    taskList.appendChild(taskElement);
  });

  updateTaskCounts();
}

// Get due date text
function getDueDateText(dueDate, status) {
  if (status === "done") {
    return "Done";
  }

  const today = getStartOfToday();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue ${formatDate(dueDate)}`;
  }

  if (diffDays === 0) {
    return "Due today";
  }

  if (diffDays === 1) {
    return "Due tomorrow";
  }

  return `Due ${formatDate(dueDate)}`;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function getStartOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function normalizeTaskStatus(task) {
  if (task.status === "done") {
    return;
  }

  const due = new Date(task.dueDate);
  task.status = due < getStartOfToday() ? "overdue" : "pending";
}

function normalizeUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) {
    return "#";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

// Toggle task status
function toggleTaskStatus(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    if (task.status === "done") {
      task.status = "pending";
      normalizeTaskStatus(task);
    } else {
      task.status = "done";
    }

    renderTasks();
  }
}

// Add or Update Task
function handleAddTask(e) {
  e.preventDefault();
  const name = document.getElementById("taskName").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const subject = document.getElementById("taskSubject").value.trim();

  if (!name || !dueDate) {
    return;
  }

  const existingTask = editingTaskId
    ? tasks.find((t) => t.id === editingTaskId)
    : null;
  const due = new Date(dueDate);
  const status =
    existingTask?.status === "done"
      ? "done"
      : due < getStartOfToday()
        ? "overdue"
        : "pending";

  const taskData = {
    id: editingTaskId ?? Date.now(),
    name,
    dueDate,
    status,
    subject: subject || "General",
  };

  if (editingTaskId) {
    tasks = tasks.map((t) => (t.id === editingTaskId ? taskData : t));
  } else {
    tasks.push(taskData);
  }

  renderTasks();
  updateSubjectFilter();
  closeAllModals();
}

// Edit Task
function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    editingTaskId = taskId;
    document.getElementById("taskName").value = task.name;
    document.getElementById("taskDueDate").value = task.dueDate;
    document.getElementById("taskSubject").value = task.subject;
    setTaskModalMode("edit");
    taskModal.classList.add("active");
  }
}

// Delete Task
function deleteTask(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((t) => t.id !== taskId);
    renderTasks();
    updateSubjectFilter();
  }
}

// Update Task Counts
function updateTaskCounts() {
  const pending = tasks.filter((t) => t.status === "pending").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;

  pendingCount.textContent = pending;
  doneCount.textContent = done;
  overdueCount.textContent = overdue;
}

// Render Notes
function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note-item";
    noteElement.innerHTML = `
            <div class="note-header">
                <div class="note-title">${note.title}</div>
                <div class="note-actions">
                    <i class="fas fa-edit" onclick="editNote(${note.id})"></i>
                    <i class="fas fa-trash" onclick="deleteNote(${note.id})"></i>
                </div>
            </div>
            <div class="note-date">${formatDate(note.date)}</div>
            <a href="${normalizeUrl(note.url)}" target="_blank" rel="noopener" class="note-url">${note.url}</a>
        `;
    notesList.appendChild(noteElement);
  });
}

// Add or Update Note
function handleAddNote(e) {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value.trim();
  const url = document.getElementById("noteUrl").value.trim();
  const date = document.getElementById("noteDate").value;

  if (!title || !url || !date) {
    return;
  }

  const noteData = {
    id: editingNoteId ?? Date.now(),
    title,
    url,
    date,
  };

  if (editingNoteId) {
    notes = notes.map((n) => (n.id === editingNoteId ? noteData : n));
  } else {
    notes.push(noteData);
  }

  renderNotes();
  closeAllModals();
}

// Edit Note
function editNote(noteId) {
  const note = notes.find((n) => n.id === noteId);
  if (note) {
    editingNoteId = noteId;
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteUrl").value = note.url;
    document.getElementById("noteDate").value = note.date;
    setNoteModalMode("edit");
    noteModal.classList.add("active");
  }
}

// Delete Note
function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes = notes.filter((n) => n.id !== noteId);
    renderNotes();
  }
}

// Render Resources
function renderResources() {
  resourcesList.innerHTML = "";
  resources.forEach((resource) => {
    const resourceElement = document.createElement("div");
    resourceElement.className = "resource-item";
    resourceElement.innerHTML = `
            <div class="resource-content">
                <div class="resource-title">${resource.title}</div>
                <div class="resource-date">${formatDate(resource.date)}</div>
            </div>
            <div class="resource-actions">
                <a href="${normalizeUrl(resource.url)}" target="_blank" rel="noopener"><i class="fas fa-link"></i></a>
                <i class="fas fa-edit" onclick="editResource(${resource.id})"></i>
                <i class="fas fa-trash" onclick="deleteResource(${resource.id})"></i>
            </div>
        `;
    resourcesList.appendChild(resourceElement);
  });
}

// Add or Update Resource
function handleAddResource(e) {
  e.preventDefault();
  const title = document.getElementById("resourceTitle").value.trim();
  const url = document.getElementById("resourceUrl").value.trim();
  const date = document.getElementById("resourceDate").value;

  if (!title || !url || !date) {
    return;
  }

  const resourceData = {
    id: editingResourceId ?? Date.now(),
    title,
    url,
    date,
  };

  if (editingResourceId) {
    resources = resources.map((r) =>
      r.id === editingResourceId ? resourceData : r,
    );
  } else {
    resources.push(resourceData);
  }

  renderResources();
  closeAllModals();
}

// Edit Resource
function editResource(resourceId) {
  const resource = resources.find((r) => r.id === resourceId);
  if (resource) {
    editingResourceId = resourceId;
    document.getElementById("resourceTitle").value = resource.title;
    document.getElementById("resourceUrl").value = resource.url;
    document.getElementById("resourceDate").value = resource.date;
    setResourceModalMode("edit");
    resourceModal.classList.add("active");
  }
}

// Delete Resource
function deleteResource(resourceId) {
  if (confirm("Are you sure you want to delete this resource?")) {
    resources = resources.filter((r) => r.id !== resourceId);
    renderResources();
  }
}

// Update Subject Filter
function updateSubjectFilter() {
  if (!subjectFilter) {
    return;
  }

  const subjects = [...new Set(tasks.map((t) => t.subject))];
  const currentValue = subjectFilter.value || "all";

  subjectFilter.innerHTML = '<option value="all">All Subjects</option>';
  subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectFilter.appendChild(option);
  });

  if (subjects.includes(currentValue) || currentValue === "all") {
    subjectFilter.value = currentValue;
  }
}
