import { useState } from "react";

const BACKEND_URL = "https://lifesys-backend.onrender.com";

function App() {
  const [goals, setGoals] = useState("");
  const [routine, setRoutine] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState("");

  // 🧠 AI Coach states
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachReply, setCoachReply] = useState("");
  const [loadingCoach, setLoadingCoach] = useState(false);

  const analyzeLife = async () => {
    const res = await fetch(`${BACKEND_URL}/analyze-life`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals, routine }),
    });

    const data = await res.json();
    setAnalysis(data.aiResponse);
    setStreak(data.streak);
    setMode(data.mode);
    setCoachReply(""); // reset coach when re-analyzing
  };

  const updateStreak = async (followedToday) => {
    const res = await fetch(`${BACKEND_URL}/update-streak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followedToday }),
    });

    const data = await res.json();
    setStreak(data.streak);
    setMode(data.mode);
    await analyzeLife();
  };

  // 🤖 Ask Coach
  const askCoach = async () => {
    if (!coachQuestion.trim()) return;

    setLoadingCoach(true);
    setCoachReply("Thinking...");

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: coachQuestion }),
      });

      const data = await res.json();
      setCoachReply(data.reply || "No response.");
    } catch (err) {
      setCoachReply("Something went wrong. Please try again.");
    } finally {
      setLoadingCoach(false);
      setCoachQuestion("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f8fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "800px",
          padding: "30px 40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: 25 }}>🌱 AI Life System Planner</h1>

        <label><strong>Life Goals</strong></label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          style={{ width: "100%", height: 60, marginBottom: 20, padding: 10 }}
        />

        <label><strong>Current Routine</strong></label>
        <textarea
          value={routine}
          onChange={(e) => setRoutine(e.target.value)}
          style={{ width: "100%", height: 60, marginBottom: 20, padding: 10 }}
        />

        <button
          onClick={analyzeLife}
          style={{
            padding: "10px 18px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "#111827",
            color: "#fff",
          }}
        >
          Analyze My Life System
        </button>

        {analysis && (
          <>
            <pre
              style={{
                marginTop: 30,
                whiteSpace: "pre-wrap",
                background: "#f3f4f6",
                padding: 20,
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              {analysis}
            </pre>

            <h3>🔥 Current Streak: {streak} days</h3>
            <p>📈 Current Mode: <strong>{mode}</strong></p>

            <p><strong>Did you follow the routine today?</strong></p>
            <button onClick={() => updateStreak(true)}>Yes</button>
            <button onClick={() => updateStreak(false)} style={{ marginLeft: 10 }}>
              No
            </button>

            {/* 🤖 AI COACH */}
            <hr style={{ margin: "30px 0" }} />
            <h2>🤖 AI Coach</h2>

            <input
              value={coachQuestion}
              onChange={(e) => setCoachQuestion(e.target.value)}
              placeholder="Ask: Why this routine? What if I miss a day?"
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <button onClick={askCoach} disabled={loadingCoach}>
              Ask Coach
            </button>

            {coachReply && (
              <div
                style={{
                  marginTop: 15,
                  background: "#f3f4f6",
                  padding: 15,
                  borderRadius: 8,
                }}
              >
                <strong>AI Coach:</strong> {coachReply}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
