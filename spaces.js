// Sample Data
let files = [
  { id: 1, name: "Calculus Notes.pdf", type: "application/pdf", size: 2500000 },
  {
    id: 2,
    name: "Assignment 1.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1500000,
  },
  {
    id: 3,
    name: "Presentation.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 3200000,
  },
  { id: 4, name: "Formula Sheet.jpg", type: "image/jpeg", size: 800000 },
  { id: 5, name: "Study Guide.pdf", type: "application/pdf", size: 1800000 },
];

let notes = [
  {
    id: 1,
    title: "Derivatives Review",
    content:
      "Key concepts for derivatives:\n\n1. Power Rule\n2. Product Rule\n3. Chain Rule\n\nPractice problems on page 45-50.",
  },
  {
    id: 2,
    title: "Integration Techniques",
    content:
      "Methods for integration:\n- Substitution\n- Integration by parts\n- Partial fractions",
  },
  {
    id: 3,
    title: "Limits and Continuity",
    content: "Important limit rules and continuity definitions.",
  },
];

let links = [
  {
    id: 1,
    title: "Khan Academy - Calculus",
    url: "www.khanacademy.org/math/calculus",
    createdAt: "Jan 15, 2026",
  },
  {
    id: 2,
    title: "Wolfram Alpha",
    url: "www.wolframalpha.com",
    createdAt: "Jan 10, 2026",
  },
  {
    id: 3,
    title: "MIT OpenCourseWare",
    url: "ocw.mit.edu/mathematics",
    createdAt: "Jan 5, 2026",
  },
];

// Current item being edited/viewed
let currentItem = null;
let currentItemType = null;

// Space metadata (used to update UI based on selected space)
const spaceDirectory = {
  1: "Mathematics",
  2: "Physics",
  3: "Chemistry",
  4: "Computer Science",
  5: "English Literature",
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  applySelectedSpace();
  renderFiles();
  renderNotes();
  renderLinks();
  updateCounts();
  setupTabs();
  setupEventListeners();
});

function applySelectedSpace() {
  const params = new URLSearchParams(window.location.search);
  const spaceId = Number(params.get("spaceId"));
  const spaceName = spaceDirectory[spaceId] || "Workspace";

  const titleEl = document.getElementById("workspaceTitle");
  if (titleEl) {
    titleEl.textContent = spaceName;
  }

  const noteModalTitle = document.getElementById("noteModalTitle");
  if (noteModalTitle) {
    noteModalTitle.textContent = `Add Note to ${spaceName}`;
  }

  const linkModalTitle = document.getElementById("linkModalTitle");
  if (linkModalTitle) {
    linkModalTitle.textContent = `Add Link to ${spaceName}`;
  }
}

// Setup Tabs
function setupTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      // Remove active class from all tabs
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab
      btn.classList.add("active");
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // File upload
  document
    .getElementById("fileInput")
    .addEventListener("change", handleFileUpload);

  // Note form
  document
    .getElementById("noteForm")
    .addEventListener("submit", handleNoteSubmit);

  // Link form
  document
    .getElementById("linkForm")
    .addEventListener("submit", handleLinkSubmit);

  // Rename form
  document
    .getElementById("renameForm")
    .addEventListener("submit", handleRenameSubmit);

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeAllModals();
    }
  });
}

// Update Counts
function updateCounts() {
  document.getElementById("filesCount").textContent = files.length;
  document.getElementById("notesCount").textContent = notes.length;
  document.getElementById("linksCount").textContent = links.length;
}

// File Icon Helper
function getFileIcon(type) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("powerpoint") || type.includes("presentation")) return "📊";
  if (type.includes("image") || type.includes("jpeg") || type.includes("png"))
    return "🖼️";
  return "📎";
}

// Format File Size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Render Files
function renderFiles() {
  const filesList = document.getElementById("filesList");
  const filesEmpty = document.getElementById("filesEmpty");

  if (files.length === 0) {
    filesList.innerHTML = "";
    filesEmpty.style.display = "block";
    return;
  }

  filesEmpty.style.display = "none";
  filesList.innerHTML = files
    .map(
      (file) => `
        <div class="file-card">
            <div class="file-icon">${getFileIcon(file.type)}</div>
            <p class="file-name">${file.name}</p>
            <p class="file-size">${formatFileSize(file.size)}</p>
            <div class="file-actions">
                <button class="btn btn-outline btn-icon" onclick="previewFile(${file.id})" title="Preview">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline btn-icon" onclick="downloadFile(${file.id})" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-outline btn-icon" onclick="renameFile(${file.id})" title="Rename">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline btn-icon btn-danger" onclick="deleteItem('file', ${file.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Render Notes
function renderNotes() {
  const notesList = document.getElementById("notesList");
  const notesEmpty = document.getElementById("notesEmpty");

  if (notes.length === 0) {
    notesList.innerHTML = "";
    notesEmpty.style.display = "block";
    return;
  }

  notesEmpty.style.display = "none";
  notesList.innerHTML = notes
    .map(
      (note) => `
        <div class="note-card">
            <div class="note-card-header">
                <h4 class="note-title">${note.title}</h4>
            </div>
            <div class="note-card-body">
                <p class="note-preview">${note.content}</p>
                <div class="note-actions">
                    <button class="btn btn-outline" style="flex: 1;" onclick="viewNote(${note.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-outline btn-icon" onclick="editNote(${note.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline btn-icon btn-danger" onclick="deleteItem('note', ${note.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Render Links
function renderLinks() {
  const linksList = document.getElementById("linksList");
  const linksEmpty = document.getElementById("linksEmpty");

  if (links.length === 0) {
    linksList.innerHTML = "";
    linksEmpty.style.display = "block";
    return;
  }

  linksEmpty.style.display = "none";
  linksList.innerHTML = links
    .map(
      (link) => `
        <div class="link-card">
            <div class="link-content">
                <div class="link-info">
                    <h4 class="link-title">${link.title}</h4>
                    <a href="https://${link.url}" target="_blank" class="link-url">${link.url}</a>
                    <p class="link-date">${link.createdAt}</p>
                </div>
                <div class="link-actions">
                    <button class="btn btn-outline" onclick="editLink(${link.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline btn-danger" onclick="deleteItem('link', ${link.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// File Upload Handler
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const newFile = {
    id: Date.now(),
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
  };

  files.push(newFile);
  renderFiles();
  updateCounts();
  closeUploadModal();
  showToast("File uploaded successfully!");
}

// Note Handlers
function handleNoteSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (currentItem && currentItemType === "note") {
    // Update existing note
    const noteIndex = notes.findIndex((n) => n.id === currentItem.id);
    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], title, content };
      showToast("Note updated successfully!");
    }
  } else {
    // Add new note
    const newNote = {
      id: Date.now(),
      title,
      content,
    };
    notes.push(newNote);
    showToast("Note created successfully!");
  }

  renderNotes();
  updateCounts();
  closeNoteModal();
  currentItem = null;
  currentItemType = null;
}

function viewNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  currentItem = note;
  currentItemType = "note";

  document.getElementById("viewNoteTitle").textContent = note.title;
  document.getElementById("viewNoteContent").textContent = note.content;
  document.getElementById("viewNoteModal").classList.add("active");
}

function editNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  currentItem = note;
  currentItemType = "note";

  document.getElementById("noteTitle").value = note.title;
  document.getElementById("noteContent").value = note.content;
  document.getElementById("noteModalTitle").textContent = "Edit Note";
  document.getElementById("noteModal").classList.add("active");
}

function editCurrentNote() {
  if (!currentItem) return;
  closeViewNoteModal();
  editNote(currentItem.id);
}

// Link Handlers
function handleLinkSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("linkTitle").value;
  const url = document.getElementById("linkUrl").value;

  if (currentItem && currentItemType === "link") {
    // Update existing link
    const linkIndex = links.findIndex((l) => l.id === currentItem.id);
    if (linkIndex !== -1) {
      links[linkIndex] = { ...links[linkIndex], title, url };
      showToast("Link updated successfully!");
    }
  } else {
    // Add new link
    const newLink = {
      id: Date.now(),
      title,
      url,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    links.push(newLink);
    showToast("Link added successfully!");
  }

  renderLinks();
  updateCounts();
  closeLinkModal();
  currentItem = null;
  currentItemType = null;
}

function editLink(id) {
  const link = links.find((l) => l.id === id);
  if (!link) return;

  currentItem = link;
  currentItemType = "link";

  document.getElementById("linkTitle").value = link.title;
  document.getElementById("linkUrl").value = link.url;
  document.getElementById("linkModalTitle").textContent = "Edit Link";
  document.getElementById("linkModal").classList.add("active");
}

// File Handlers
function previewFile(id) {
  const file = files.find((f) => f.id === id);
  if (!file) return;

  currentItem = file;
  currentItemType = "file";

  document.getElementById("previewFileName").textContent = file.name;
  document.getElementById("previewIcon").textContent = getFileIcon(file.type);
  document.getElementById("previewType").textContent = `Type: ${file.type}`;
  document.getElementById("previewSize").textContent =
    `Size: ${formatFileSize(file.size)}`;
  document.getElementById("previewModal").classList.add("active");
}

function downloadFile(id) {
  const file = files.find((f) => f.id === id);
  if (!file) return;
  showToast(`Downloading ${file.name}...`);
}

function downloadCurrentFile() {
  if (!currentItem) return;
  downloadFile(currentItem.id);
}

function renameFile(id) {
  const file = files.find((f) => f.id === id);
  if (!file) return;

  currentItem = file;
  currentItemType = "file";

  document.getElementById("fileName").value = file.name;
  document.getElementById("renameModal").classList.add("active");
}

function handleRenameSubmit(e) {
  e.preventDefault();

  if (!currentItem) return;

  const newName = document.getElementById("fileName").value;
  const fileIndex = files.findIndex((f) => f.id === currentItem.id);

  if (fileIndex !== -1) {
    files[fileIndex].name = newName;
    renderFiles();
    showToast("File renamed successfully!");
  }

  closeRenameModal();
  currentItem = null;
  currentItemType = null;
}

// Delete Handler
function deleteItem(type, id) {
  currentItemType = type;
  currentItem = { id };

  document.getElementById("deleteType").textContent = type;
  document.getElementById("deleteDialog").classList.add("active");
}

function confirmDelete() {
  if (!currentItem) return;

  switch (currentItemType) {
    case "file":
      files = files.filter((f) => f.id !== currentItem.id);
      renderFiles();
      showToast("File deleted successfully!");
      break;
    case "note":
      notes = notes.filter((n) => n.id !== currentItem.id);
      renderNotes();
      showToast("Note deleted successfully!");
      break;
    case "link":
      links = links.filter((l) => l.id !== currentItem.id);
      renderLinks();
      showToast("Link deleted successfully!");
      break;
  }

  updateCounts();
  closeDeleteDialog();
  currentItem = null;
  currentItemType = null;
}

// Modal Functions
function openUploadModal() {
  document.getElementById("uploadModal").classList.add("active");
}

function closeUploadModal() {
  document.getElementById("uploadModal").classList.remove("active");
  document.getElementById("fileInput").value = "";
}

function openNoteModal() {
  currentItem = null;
  currentItemType = null;
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
  const spaceName =
    document.getElementById("workspaceTitle")?.textContent || "Workspace";
  document.getElementById("noteModalTitle").textContent =
    `Add Note to ${spaceName}`;
  document.getElementById("noteModal").classList.add("active");
}

function closeNoteModal() {
  document.getElementById("noteModal").classList.remove("active");
  document.getElementById("noteForm").reset();
}

function closeViewNoteModal() {
  document.getElementById("viewNoteModal").classList.remove("active");
  currentItem = null;
  currentItemType = null;
}

function openLinkModal() {
  currentItem = null;
  currentItemType = null;
  document.getElementById("linkTitle").value = "";
  document.getElementById("linkUrl").value = "";
  const spaceName =
    document.getElementById("workspaceTitle")?.textContent || "Workspace";
  document.getElementById("linkModalTitle").textContent =
    `Add Link to ${spaceName}`;
  document.getElementById("linkModal").classList.add("active");
}

function closeLinkModal() {
  document.getElementById("linkModal").classList.remove("active");
  document.getElementById("linkForm").reset();
}

function closeRenameModal() {
  document.getElementById("renameModal").classList.remove("active");
  document.getElementById("renameForm").reset();
}

function closePreviewModal() {
  document.getElementById("previewModal").classList.remove("active");
  currentItem = null;
  currentItemType = null;
}

function closeDeleteDialog() {
  document.getElementById("deleteDialog").classList.remove("active");
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
  });
  currentItem = null;
  currentItemType = null;
}

// Navigation
function goBack() {
  window.location.href = "spaces-overview.html";
}

// Toast Notification
function showToast(message) {
  // Simple alert for now - can be replaced with a custom toast component
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #323130;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add toast animations to CSS dynamically
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
