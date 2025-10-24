const { useState, useEffect } = React;

// =============== TIMER COMPONENT ===============
function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="timer">
      ⏱ Time Remaining: {String(mins).padStart(2, "0")}:
      {String(secs).padStart(2, "0")}
    </div>
  );
}

// =============== QUIZ DATA =====================
const quizData = {
  Reading: Array.from({ length: 20 }, (_, i) => ({
    q: `Reading Question ${i + 1}: What is the correct answer?`,
    options: ["Option A", "Option B", "Option C"],
    correct: "Option A",
  })),
  Listening: Array.from({ length: 10 }, (_, i) => ({
    q: `Listening Question ${i + 1}: Choose the correct answer.`,
    options: ["Option 1", "Option 2", "Option 3"],
    correct: "Option 1",
  })),
};

// =============== INITIAL ANSWERS ===============
function initAnswers() {
  const initial = {};
  Object.keys(quizData).forEach((part) => {
    initial[part] = Array(quizData[part].length).fill(null);
  });
  return initial;
}

// =============== MAIN APP ======================
function App() {
  const [currentPart, setCurrentPart] = useState("Reading");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(initAnswers());
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 phút = 3600 giây
  const [readingLocked, setReadingLocked] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (submitted || readingLocked) return;
    if (timeLeft <= 0) {
      alert("Time's up! Reading section locked.");
      lockReading();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, readingLocked]);

  const handleSelectPart = (part) => {
    if (part === "Reading" && readingLocked) {
      alert("Reading section is locked. Please continue with Listening.");
      return;
    }
    setCurrentPart(part);
    setCurrentQuestionIndex(0);
  };

  const handleSelectAnswer = (choice) => {
    const newAnswers = { ...answers };
    newAnswers[currentPart][currentQuestionIndex] = choice;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData[currentPart].length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const lockReading = () => {
    setReadingLocked(true);
    alert("Reading section has been submitted and locked.");
    setCurrentPart("Listening");
    setTimeLeft(40 * 60); // 40 phút cho Listening
  };

  const handleSubmit = () => {
    if (currentPart === "Reading" && !readingLocked) {
      if (confirm("Submit Reading section and move to Listening?")) {
        lockReading();
      }
      return;
    }
    if (currentPart === "Listening") {
      if (confirm("Submit full test?")) {
        setSubmitted(true);
      }
    }
  };

  if (submitted) {
    // Calculate total
    let totalScore = 0;
    let totalQuestions = 0;

    Object.keys(quizData).forEach((part) => {
      quizData[part].forEach((q, i) => {
        totalQuestions++;
        if (answers[part][i] === q.correct) totalScore++;
      });
    });

    return (
      <div className="app result">
        <h2>✅ Test Completed!</h2>
        <p>Total Score: {totalScore} / {totalQuestions}</p>
        <p>Reading: {
          quizData.Reading.reduce(
            (acc, q, i) => acc + (answers.Reading[i] === q.correct ? 1 : 0),
            0
          )
        } / 20</p>
        <p>Listening: {
          quizData.Listening.reduce(
            (acc, q, i) => acc + (answers.Listening[i] === q.correct ? 1 : 0),
            0
          )
        } / 10</p>
      </div>
    );
  }

  const currentQuestion = quizData[currentPart][currentQuestionIndex];

  return (
    <div className="app">
      <Timer seconds={timeLeft} />

      <div className="part-selector">
        {Object.keys(quizData).map((part) => (
          <button
            key={part}
            className={currentPart === part ? "active" : ""}
            onClick={() => handleSelectPart(part)}
          >
            {part}
          </button>
        ))}
      </div>

      <QuestionCard
        question={currentQuestion}
        index={currentQuestionIndex}
        selected={answers[currentPart][currentQuestionIndex]}
        onSelect={handleSelectAnswer}
      />

      <NavBar
        onPrev={currentQuestionIndex > 0 ? handlePrev : null}
        onNext={
          currentQuestionIndex < quizData[currentPart].length - 1
            ? handleNext
            : null
        }
        onSubmit={handleSubmit}
        isLast={
          currentPart === "Listening" &&
          currentQuestionIndex === quizData[currentPart].length - 1
        }
        part={currentPart}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
