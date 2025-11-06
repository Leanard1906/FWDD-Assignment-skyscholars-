document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".join-form");
  const input = document.getElementById("joinCode");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const joinCode = input.value.trim();
    errorMsg.textContent = "";

    if (!joinCode) {
      errorMsg.textContent = "⚠️ Please enter a join code.";
      errorMsg.style.color = "#ff6b6b";
      return;
    }

    try {
      const res = await fetch("/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Redirect to quiz page
        window.location.href = data.redirect;
      } else {
        errorMsg.textContent = data.message || "❌ Invalid join code.";
        errorMsg.style.color = "#ff6b6b";
      }
    } catch (err) {
      console.error("Join code error:", err);
      errorMsg.textContent = "⚠️ Something went wrong. Try again later.";
      errorMsg.style.color = "#ff6b6b";
    }
  });
});
