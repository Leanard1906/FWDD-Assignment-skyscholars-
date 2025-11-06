// Navbar scroll shadow effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ---------- USER MENU DROPDOWN ----------
document.addEventListener("click", (e) => {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.querySelector(".user-dropdown");

  if (!userMenu || !dropdown) return;

  const isButton = e.target.closest(".username");
  const isDropdown = e.target.closest(".user-dropdown");

  // Toggle dropdown when username clicked
  if (isButton) {
    dropdown.classList.toggle("visible");
    return;
  }

  // Close dropdown if clicked outside
  if (!isDropdown) {
    dropdown.classList.remove("visible");
  }
});
