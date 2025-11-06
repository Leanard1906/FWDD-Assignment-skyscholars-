document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const cancelBtn = document.getElementById("cancelBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Backend now should return JSON like { message: "Registration successful!" }
        const data = await response.json();
        alert(`${data.message} Redirecting to login...`);
        window.location.href = "/login";
      } else {
        const msg = await response.text();
        alert(`Error: ${msg}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  });

  cancelBtn.addEventListener("click", () => {
    window.history.back();
  });
});
