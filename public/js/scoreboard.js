// public/js/main.js
console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready — attaching dropdown handlers");

  // Handle dropdowns (delegated)
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".dropdown-toggle");
    const dropdown = event.target.closest(".dropdown");

    // If clicked on a toggle button
    if (toggle && dropdown) {
      event.stopPropagation();

      const menu = dropdown.querySelector(".dropdown-menu");
      if (!menu) return;

      // Close all other open dropdowns
      document.querySelectorAll(".dropdown-menu.show").forEach((m) => {
        if (m !== menu) m.classList.remove("show");
      });

      // Toggle current menu
      menu.classList.toggle("show");
      return;
    }

    // Clicked outside dropdowns -> close all
    if (!dropdown) {
      document.querySelectorAll(".dropdown-menu.show").forEach((m) => {
        m.classList.remove("show");
      });
    }
  });

  // Close dropdown when pressing ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".dropdown-menu.show").forEach((m) => {
        m.classList.remove("show");
      });
    }
  });

  console.log("Dropdown handlers attached successfully");
});
