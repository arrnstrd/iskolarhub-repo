// Sample Data
let spaces = [
  { id: 1, name: "Mathematics", createdAt: "Jan 15, 2026" },
  { id: 2, name: "Physics", createdAt: "Jan 10, 2026" },
  { id: 3, name: "Chemistry", createdAt: "Jan 8, 2026" },
  { id: 4, name: "Computer Science", createdAt: "Jan 5, 2026" },
  { id: 5, name: "English Literature", createdAt: "Jan 3, 2026" },
];

// Color gradients for spaces
const gradientColors = [
  "gradient-blue",
  "gradient-purple",
  "gradient-green",
  "gradient-orange",
  "gradient-pink",
  "gradient-indigo",
];

// Current space being edited/deleted
let currentSpace = null;
let spaceToDelete = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderSpaces();
  updateTotalCount();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  // Add form
  document.getElementById("addForm").addEventListener("submit", handleAddSpace);

  // Rename form
  document
    .getElementById("renameForm")
    .addEventListener("submit", handleRenameSpace);

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeAllModals();
    }
  });
}

// Update Total Count
function updateTotalCount() {
  document.getElementById("totalSpaces").textContent = spaces.length;
}

// Render Spaces
function renderSpaces() {
  const spacesGrid = document.getElementById("spacesGrid");
  const emptyState = document.getElementById("emptyState");

  if (spaces.length === 0) {
    spacesGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  spacesGrid.innerHTML = spaces
    .map(
      (space, index) => `
        <div class="space-card">
            <div class="space-header ${gradientColors[index % gradientColors.length]}">
                <i class="fas fa-folder-open"></i>
            </div>
            <div class="space-body">
                <h3 class="space-name">${space.name}</h3>
                <p class="space-date">Created ${space.createdAt}</p>
                <div class="space-actions">
                    <button class="btn btn-open" onclick="openSpace(${space.id})">
                        Open
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                <div class="space-secondary-actions">
                    <button class="btn btn-edit" onclick="openRenameModal(${space.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="openDeleteDialog(${space.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  // Add animation
  const cards = document.querySelectorAll(".space-card");
  cards.forEach((card, index) => {
    card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
  });
}

// Add Space
function handleAddSpace(e) {
  e.preventDefault();

  const spaceName = document.getElementById("spaceName").value.trim();

  if (!spaceName) {
    showToast("Please enter a space name", "error");
    return;
  }

  const newSpace = {
    id: Date.now(),
    name: spaceName,
    createdAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  spaces.push(newSpace);
  renderSpaces();
  updateTotalCount();
  closeAddModal();
  showToast("Space created successfully!");
}

// Open Rename Modal
function openRenameModal(id) {
  const space = spaces.find((s) => s.id === id);
  if (!space) return;

  currentSpace = space;
  document.getElementById("renameSpaceName").value = space.name;
  document.getElementById("renameModal").classList.add("active");
}

// Rename Space
function handleRenameSpace(e) {
  e.preventDefault();

  if (!currentSpace) return;

  const newName = document.getElementById("renameSpaceName").value.trim();

  if (!newName) {
    showToast("Please enter a space name", "error");
    return;
  }

  const spaceIndex = spaces.findIndex((s) => s.id === currentSpace.id);
  if (spaceIndex !== -1) {
    spaces[spaceIndex].name = newName;
    renderSpaces();
    showToast("Space renamed successfully!");
  }

  closeRenameModal();
  currentSpace = null;
}

// Delete Dialog
function openDeleteDialog(id) {
  spaceToDelete = id;
  document.getElementById("deleteDialog").classList.add("active");
}

function confirmDelete() {
  if (!spaceToDelete) return;

  spaces = spaces.filter((s) => s.id !== spaceToDelete);
  renderSpaces();
  updateTotalCount();
  closeDeleteDialog();
  showToast("Space deleted successfully!");
  spaceToDelete = null;
}

// Open Space
function openSpace(id) {
  // Navigate to workspace page
  window.location.href = `spaces.html?spaceId=${id}`;
}

// Modal Functions
function openAddModal() {
  document.getElementById("spaceName").value = "";
  document.getElementById("addModal").classList.add("active");
}

function closeAddModal() {
  document.getElementById("addModal").classList.remove("active");
  document.getElementById("addForm").reset();
}

function closeRenameModal() {
  document.getElementById("renameModal").classList.remove("active");
  document.getElementById("renameForm").reset();
  currentSpace = null;
}

function closeDeleteDialog() {
  document.getElementById("deleteDialog").classList.remove("active");
  spaceToDelete = null;
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
  });
  currentSpace = null;
  spaceToDelete = null;
}

// Toast Notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const icon = type === "success" ? "✓" : "✕";
  const bgColor = type === "success" ? "#16a34a" : "#dc2626";

  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

  const iconSpan = document.createElement("span");
  iconSpan.textContent = icon;
  iconSpan.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        font-weight: bold;
    `;

  toast.insertBefore(iconSpan, toast.firstChild);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add animations to CSS dynamically
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
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);
