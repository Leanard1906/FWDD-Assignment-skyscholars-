// public/js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  // handle multiple dropdowns if present
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (!toggle || !menu) return;

    // Toggle function
    const open = () => {
      menu.classList.add("show");
      toggle.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      menu.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    };
    const toggleMenu = (e) => {
      e.stopPropagation();
      menu.classList.contains("show") ? close() : open();
    };

    // Click toggle
    toggle.addEventListener("click", toggleMenu);

    // Close when clicking an item inside the menu (links or buttons)
    menu.addEventListener("click", (ev) => {
      const target = ev.target;
      // close if clicked on a menu link or a button (like logout)
      if (target.matches("a, button")) {
        close();
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (ev) => {
      if (!dropdown.contains(ev.target)) {
        close();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") close();
    });
  });
});
