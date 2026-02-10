// Pages Data Storage
let pages = [
  {
    id: 1,
    title: "Introduction to Physics",
    content:
      "Physics is the natural science that studies matter, energy, and motion. It seeks to understand how the universe works at the most fundamental level.",
    icon: "📚",
    date: "2025-12-10",
    createdAt: new Date("2025-12-10").getTime(),
  },
  {
    id: 2,
    title: "Chemistry Lab Notes",
    content:
      "Today's lab experiment involved testing the pH levels of various solutions. We used litmus paper and pH meters to determine acidity and basicity.",
    icon: "🧪",
    date: "2025-12-08",
    createdAt: new Date("2025-12-08").getTime(),
  },
];

let editingPageId = null;

// DOM Elements
const createPageBtn = document.getElementById("createPageBtn");
const pagesList = document.getElementById("pagesList");
const pageEditorModal = document.getElementById("pageEditorModal");
const closePageBtn = document.getElementById("closePageBtn");
const savePageBtn = document.getElementById("savePageBtn");
const pageTitle = document.getElementById("pageTitle");
const pageContent = document.getElementById("pageContent");
const pageIcon = document.getElementById("pageIcon");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderPages();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  createPageBtn.addEventListener("click", createNewPage);
  closePageBtn.addEventListener("click", closePageEditor);
  savePageBtn.addEventListener("click", savePage);

  if (pagesList) {
    pagesList.addEventListener("click", handlePageCardClick);
  }

  // Close modal on outside click
  pageEditorModal.addEventListener("click", (e) => {
    if (e.target === pageEditorModal) {
      closePageEditor();
    }
  });

  // Logout button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("Logging out...");
    });
  }

  // Page icon emoji picker (click to change)
  pageIcon.addEventListener("click", changePageIcon);
}

function handlePageCardClick(event) {
  const actionButton = event.target.closest("button");
  if (actionButton) {
    return;
  }

  const pageCard = event.target.closest(".page-card");
  if (!pageCard) {
    return;
  }

  const pageId = Number(pageCard.dataset.pageId);
  if (!Number.isNaN(pageId)) {
    editPage(pageId);
  }
}

// Render all pages
function renderPages() {
  pagesList.innerHTML = "";

  if (pages.length === 0) {
    pagesList.innerHTML = `
            <div class="pages-empty" style="grid-column: 1 / -1;">
                <i class="fas fa-file-alt"></i>
                <p>No pages created yet</p>
                <p style="font-size: 14px;">Click "Create Page" to start writing</p>
            </div>
        `;
    return;
  }

  pages.forEach((page) => {
    const pageCard = document.createElement("div");
    pageCard.className = "page-card";
    pageCard.dataset.pageId = page.id;
    pageCard.innerHTML = `
            <div class="page-card-icon">${page.icon}</div>
            <div class="page-card-title">${page.title || "Untitled"}</div>
            <div class="page-card-date">${formatDate(page.date)}</div>
            <div class="page-card-preview">${stripHtml(page.content) || "No content yet"}</div>
            <div class="page-card-actions">
                <button onclick="editPage(${page.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete" onclick="deletePage(${page.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
    pagesList.appendChild(pageCard);
  });
}

// Create new page
function createNewPage() {
  editingPageId = null;
  pageTitle.textContent = "";
  pageContent.innerHTML = "";
  pageIcon.textContent = "📄";
  openPageEditor();
}

// Edit existing page
function editPage(pageId) {
  const page = pages.find((p) => p.id === pageId);
  if (page) {
    editingPageId = pageId;
    pageTitle.textContent = page.title;
    pageContent.innerHTML = page.content;
    pageIcon.textContent = page.icon;
    openPageEditor();
  }
}

// Open page editor
function openPageEditor() {
  pageEditorModal.classList.add("active");
  // Focus on title
  setTimeout(() => {
    pageTitle.focus();
  }, 100);
}

// Close page editor
function closePageEditor() {
  if (
    editingPageId === null &&
    (pageTitle.textContent.trim() !== "" || pageContent.innerHTML.trim() !== "")
  ) {
    if (confirm("You have unsaved changes. Do you want to discard them?")) {
      pageEditorModal.classList.remove("active");
      editingPageId = null;
    }
  } else {
    pageEditorModal.classList.remove("active");
    editingPageId = null;
  }
}

// Save page
function savePage() {
  const title = pageTitle.textContent.trim();
  const content = pageContent.innerHTML.trim();
  const icon = pageIcon.textContent;

  if (!title) {
    alert("Please enter a page title");
    pageTitle.focus();
    return;
  }

  const today = new Date();
  const dateStr = formatDateISO(today);

  const pageData = {
    id: editingPageId ?? Date.now(),
    title,
    content,
    icon: icon || "📄",
    date: dateStr,
    createdAt: editingPageId
      ? pages.find((p) => p.id === editingPageId)?.createdAt || today.getTime()
      : today.getTime(),
  };

  if (editingPageId) {
    // Update existing page
    pages = pages.map((p) => (p.id === editingPageId ? pageData : p));
  } else {
    // Create new page
    pages.push(pageData);
  }

  // Sort by most recent first
  pages.sort((a, b) => b.createdAt - a.createdAt);

  renderPages();
  closePageEditor();
}

// Delete page
function deletePage(pageId) {
  if (
    confirm(
      "Are you sure you want to delete this page? This action cannot be undone.",
    )
  ) {
    pages = pages.filter((p) => p.id !== pageId);
    renderPages();
  }
}

// Change page icon
function changePageIcon() {
  const emojis = [
    "📄",
    "📝",
    "📚",
    "🧪",
    "📊",
    "💡",
    "🎯",
    "📖",
    "✏️",
    "🎨",
    "🔬",
    "📋",
  ];
  let currentIndex = emojis.indexOf(pageIcon.textContent);
  currentIndex = (currentIndex + 1) % emojis.length;
  pageIcon.textContent = emojis[currentIndex];
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
