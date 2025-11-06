document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("usernameForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();

    if (!username) {
      alert("Please enter a username.");
      return;
    }

    try {
      const response = await fetch("/enterusername", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // ✅ Redirect to startquiz page (renamed)
        window.location.href = "/startquiz";
      } else {
        const msg = await response.text();
        alert(`Error: ${msg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred.");
    }
  });
});
