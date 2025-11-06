// public/js/about.js

document.addEventListener("DOMContentLoaded", () => {
  const userMenu = document.querySelector(".user-menu");
  const usernameBtn = document.querySelector(".username");
  const dropdown = document.querySelector(".user-dropdown");

  if (!userMenu || !usernameBtn || !dropdown) return;

  // Toggle dropdown visibility
  usernameBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("visible");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      dropdown.classList.remove("visible");
    }
  });
});
