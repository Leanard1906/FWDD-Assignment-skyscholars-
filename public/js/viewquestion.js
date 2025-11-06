document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#questionTable");
  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  const searchInput = document.getElementById("searchInput");
  let deleteId = null;

  // ===== SEARCH FILTER =====
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const filterValue = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll("#questionTable tbody tr");

      rows.forEach((row) => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filterValue) ? "" : "none";
      });
    });
  }

  // ===== SHOW CUSTOM DELETE MODAL =====
  function showDeleteModal(id) {
    deleteId = id;
    modal.style.display = "flex";
  }

  // ===== CLOSE MODAL =====
  function closeDeleteModal() {
    modal.style.display = "none";
    deleteId = null;
  }

  cancelBtn.addEventListener("click", closeDeleteModal);

  // ===== DELETE CONFIRMATION ACTION =====
  confirmBtn.addEventListener("click", async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/viewquestion/delete/${deleteId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        const row = document.querySelector(`tr[data-id="${deleteId}"]`);
        if (row) {
          row.classList.add("fade-out");
          setTimeout(() => row.remove(), 300);
        }
      } else {
        alert("❌ Failed to delete question.");
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("⚠️ Error deleting question.");
    }
    closeDeleteModal();
  });

  // ===== ATTACH DELETE BUTTON EVENT =====
  table?.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr");
      const id = row.dataset.id;
      if (id) showDeleteModal(id);
    }
  });

  // ===== CLOSE MODAL WHEN CLICK OUTSIDE =====
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeDeleteModal();
  });

  // ===== USER DROPDOWN MENU =====
  const dropdownBtn = document.getElementById("userDropdownBtn");
  const dropdownMenu = document.getElementById("userDropdown");

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== dropdownBtn) {
        dropdownMenu.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") dropdownMenu.classList.remove("show");
    });
  }
});
