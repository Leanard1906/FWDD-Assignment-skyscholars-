document.addEventListener("DOMContentLoaded", () => {
  // ===== USER DROPDOWN =====
  const usernameBtn = document.querySelector(".username");
  const userDropdown = document.querySelector(".user-dropdown");

  if (usernameBtn && userDropdown) {
    usernameBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      userDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target) && e.target !== usernameBtn) {
        userDropdown.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") userDropdown.classList.remove("show");
    });
  }

  // ===== GENERATE ROOM CODE =====
  const generateBtn = document.getElementById("generateCodeBtn");
  const roomInput = document.getElementById("roomCode");

  if (generateBtn && roomInput) {
    generateBtn.addEventListener("click", () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      roomInput.value = code;
    });
  }

  // ===== ADD QUESTION LOGIC =====
  const addBtn = document.getElementById("addQuestionBtn");
  const form = document.getElementById("addQuestionForm");
  const container = document.getElementById("questionsContainer");
  const msg = document.getElementById("message");

  const createQuestionBlock = () => {
    const block = document.createElement("div");
    block.classList.add("question-block");
    block.innerHTML = `
      <button type="button" class="delete-btn">Delete</button>
      <label>Question:</label>
      <input type="text" name="question" placeholder="Enter your question" required>
      <label>Options:</label>
      <input type="text" name="A" placeholder="Option A" required>
      <input type="text" name="B" placeholder="Option B" required>
      <input type="text" name="C" placeholder="Option C" required>
      <input type="text" name="D" placeholder="Option D" required>
      <label>Correct Answer:</label>
      <select name="correctAnswer" required>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
    `;

    // Delete button event
    const deleteBtn = block.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      block.remove();
    });

    container.appendChild(block);
  };

  if (addBtn && container) {
    addBtn.addEventListener("click", createQuestionBlock);
  }

  if (container && container.children.length === 0) {
    createQuestionBlock();
  }

  // ===== SAVE QUESTIONS =====
  if (form && container) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const topic = document.getElementById("topic").value.trim();
      const roomCode = document.getElementById("roomCode").value.trim();
      const blocks = container.querySelectorAll(".question-block");
      const questions = [];

      blocks.forEach((b) => {
        const q = {
          question: (b.querySelector('input[name="question"]')?.value || "").trim(),
          options: {
            A: (b.querySelector('input[name="A"]')?.value || "").trim(),
            B: (b.querySelector('input[name="B"]')?.value || "").trim(),
            C: (b.querySelector('input[name="C"]')?.value || "").trim(),
            D: (b.querySelector('input[name="D"]')?.value || "").trim(),
          },
          correctAnswer: b.querySelector('select[name="correctAnswer"]')?.value || ""
        };
        questions.push(q);
      });

      try {
        const res = await fetch("/addquestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, roomCode, questions }),
        });

        const data = await res.json();
        msg.textContent = data.message || (data.success ? "Saved!" : "Error");
        msg.style.color = data.success ? "#00ff88" : "#ff6b6b";

        // ===== ADD REDIRECT AFTER SUCCESS =====
        if (data.success) {
          msg.textContent = data.message + " Redirecting to view questions...";
          msg.style.color = "#00ff88";

          form.reset();
          container.innerHTML = "";
          createQuestionBlock();

          // Wait 3 seconds then redirect
          setTimeout(() => {
            window.location.href = "/viewquestion";
          }, 3000);
        }

      } catch (err) {
        console.error("Error saving questions:", err);
        msg.textContent = "Server error. Try again.";
        msg.style.color = "#ff6b6b";
      }
    });
  }
});
