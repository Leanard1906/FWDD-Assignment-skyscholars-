document.addEventListener("DOMContentLoaded", () => {
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.querySelector(".options");
  const nextBtn = document.getElementById("nextBtn");
  const finishBtn = document.getElementById("finishBtn");
  const resultContainer = document.querySelector(".result-container");
  const questionContainer = document.getElementById("question-container");

  let questions = [];
  let currentQuestion = 0;
  let score = 0;
  let answeredCount = 0;

  // ===== Load Questions from Database =====
  fetch("/api/questions")
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.length === 0) {
        questionText.textContent = "No questions available.";
        nextBtn.style.display = "none";
        finishBtn.style.display = "none";
        return;
      }

      questions = data.map((q) => ({
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correct: ["A", "B", "C", "D"].indexOf(q.correctAnswer),
        answered: false,
      }));

      loadQuestion();
    })
    .catch((err) => {
      console.error("❌ Error fetching questions:", err);
      questionText.textContent = "Failed to load questions.";
    });

  // ===== Display Question =====
  function loadQuestion() {
    const q = questions[currentQuestion];
    questionText.textContent = q.question;
    optionsContainer.innerHTML = "";

    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.classList.add("option-btn");
      btn.onclick = () => selectOption(index);
      optionsContainer.appendChild(btn);
    });

    nextBtn.style.display = "none";
    finishBtn.style.display = answeredCount > 0 ? "inline-block" : "none";
  }

  // ===== Option Selection =====
  function selectOption(index) {
    const q = questions[currentQuestion];
    if (q.answered) return; // prevent double counting
    q.answered = true;
    answeredCount++;

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add("correct");
      else if (i === index && i !== q.correct) btn.classList.add("wrong");
    });

    if (index === q.correct) score++;

    nextBtn.style.display =
      currentQuestion < questions.length - 1 ? "inline-block" : "none";
    finishBtn.style.display = "inline-block";
  }

  // ===== Next Question =====
  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  });

  // ===== Finish Quiz =====
  finishBtn.addEventListener("click", () => {
    finishBtn.disabled = true; // prevent multiple clicks
    showResult();
  });

  // ===== Show Result =====
  function showResult() {
    // Hide quiz section and show result section
    questionContainer.style.display = "none";
    resultContainer.style.display = "flex";
    resultContainer.style.flexDirection = "column";
    resultContainer.style.alignItems = "center";
    resultContainer.style.justifyContent = "center";

    document.getElementById("resultTitle").textContent = "🎉 Quiz Finished!";
    document.getElementById("resultMessage").textContent = `You scored ${score}/${answeredCount}!`;

    // Save score to database
    fetch("/api/save-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, totalAnswered: answeredCount }),
    })
      .then((res) => res.json())
      .then((data) => {
        const msg = document.createElement("p");
        msg.style.marginTop = "15px";
        msg.style.color = data.success ? "#00bfff" : "#ff5555";
        msg.style.fontWeight = "500";
        msg.textContent = data.success
          ? "✅ Score saved successfully!"
          : "❌ Failed to save score.";
        resultContainer.appendChild(msg);
      })
      .catch((err) => console.error("❌ Error saving score:", err));
  }
});
