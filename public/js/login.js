document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const backBtn = document.getElementById("backBtn");
  const statusMessage = document.getElementById("statusMessage"); // 🟦 add this element in your login.pug

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // 🟨 Reset message each submit
    statusMessage.textContent = "";

    if (!email || !password) {
      statusMessage.textContent = "Please fill in both fields.";
      statusMessage.style.color = "red";
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        statusMessage.textContent = data.message;
        statusMessage.style.color = "#00bfff";

        // Redirect after short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        statusMessage.textContent = data.message || "Login failed.";
        statusMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Login error:", error);
      statusMessage.textContent = "An unexpected error occurred.";
      statusMessage.style.color = "red";
    }
  });

  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.back();
    });
  }
});
