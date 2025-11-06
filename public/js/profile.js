document.addEventListener("DOMContentLoaded", () => {
  const userButton = document.getElementById("userButton");
  const userDropdown = document.getElementById("userDropdown");

  if (userButton && userDropdown) {
    userButton.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add("hidden");
      }
    });
  }
});
