document.addEventListener("DOMContentLoaded", () => {

  // ================= USER DROPDOWN =================
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

  // ================= PROFILE UPDATE =================
  const updateForm = document.getElementById("updateForm");
  const updateStatus = document.getElementById("updateStatus");

  if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(updateForm);

      const res = await fetch("/profile/update", {
        method: "POST",
        body: new URLSearchParams(formData)
      });

      const data = await res.json();
      updateStatus.textContent = data.message;
      updateStatus.style.color = data.success ? "green" : "red";
    });
  }

  // ================= PASSWORD CHANGE =================
  const passwordForm = document.getElementById("passwordForm");
  const passwordStatus = document.getElementById("passwordStatus");

  if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(passwordForm);

      const res = await fetch("/profile/change-password", {
        method: "POST",
        body: new URLSearchParams(formData)
      });

      const data = await res.json();
      passwordStatus.textContent = data.message;
      passwordStatus.style.color = data.success ? "green" : "red";

      if (data.success) {
        passwordForm.reset();
      }
    });
  }

});
