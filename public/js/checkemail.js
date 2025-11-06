document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const emailStatus = document.getElementById("email-status");

  if (!emailInput || !emailStatus) return;

  emailInput.addEventListener("blur", async () => {
    const email = emailInput.value.trim();
    if (!email) {
      emailStatus.textContent = "";
      return;
    }

    try {
      const response = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.exists) {
        emailStatus.textContent = "Email already registered.";
        emailStatus.style.color = "red";
      } else {
        emailStatus.textContent = "Email available.";
        emailStatus.style.color = "green";
      }
    } catch (error) {
      console.error("Error checking email:", error);
      emailStatus.textContent = "Server error — please try again.";
      emailStatus.style.color = "#ffcc00";
    }
  });
});
