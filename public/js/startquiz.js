document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch username from server session
    const response = await fetch("/api/get-username");
    const data = await response.json();

    if (data.username) {
      document.getElementById("usernameDisplay").textContent = data.username;
    } else {
      // Redirect if no username
      window.location.href = "/enterusername";
      return;
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Error loading user info.");
    window.location.href = "/enterusername";
    return;
  }

  // ✅ When Start Quiz button clicked → go to quiz page
  document.getElementById("startQuizBtn").addEventListener("click", () => {
    window.location.href = "/quiz";
  });
});
