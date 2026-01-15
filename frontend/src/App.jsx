import { useState } from "react";

const BACKEND_URL = "https://lifesys-backend.onrender.com";

function App() {
  const [goals, setGoals] = useState("");
  const [routine, setRoutine] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState("");

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
          style={{
            width: "100%",
            height: 60,
            marginTop: 6,
            marginBottom: 20,
            padding: 10,
          }}
        />

        <label><strong>Current Routine</strong></label>
        <textarea
          value={routine}
          onChange={(e) => setRoutine(e.target.value)}
          style={{
            width: "100%",
            height: 60,
            marginTop: 6,
            marginBottom: 20,
            padding: 10,
          }}
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
            fontSize: 14,
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

            <div style={{ marginTop: 20 }}>
              <h3>🔥 Current Streak: {streak} days</h3>
              <p>
                📈 Current Mode: <strong>{mode}</strong>
              </p>
            </div>

            <div style={{ marginTop: 10 }}>
              <p><strong>Did you follow the routine today?</strong></p>
              <button
                onClick={() => updateStreak(true)}
                style={{
                  padding: "8px 14px",
                  marginRight: 10,
                  borderRadius: 6,
                  border: "1px solid #16a34a",
                  background: "#16a34a",
                  color: "#fff",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => updateStreak(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid #dc2626",
                  background: "#dc2626",
                  color: "#fff",
                }}
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
