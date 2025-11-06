document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".search-box");
  const rows = document.querySelectorAll("tbody tr");

  const modal = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  const deleteForm = document.getElementById("deleteForm");
  let deleteId = null;

  // ===== Search Filter =====
  searchBox.addEventListener("input", () => {
    const value = searchBox.value.toLowerCase();
    rows.forEach((row) => {
      const username = row.dataset.username;
      row.style.display = username.includes(value) ? "" : "none";
    });
  });

  // ===== Open Delete Modal =====
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      deleteId = e.target.dataset.id;
      modal.style.display = "flex";
    }
  });

  // ===== Cancel Delete =====
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // ===== Confirm Delete (Submit Form) =====
  confirmBtn.addEventListener("click", () => {
    if (!deleteId) return;

    // Set form action to the correct delete route
    deleteForm.setAttribute("action", `/viewuser/delete/${deleteId}`);
    deleteForm.setAttribute("method", "POST");

    deleteForm.submit();
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});
