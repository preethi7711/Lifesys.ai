import { useState } from "react";

function App() {
  const [goals, setGoals] = useState("");
  const [routine, setRoutine] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");

  const BACKEND_URL = "https://lifesys-backend.onrender.com";

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

    // Re-run analysis after streak update
    await analyzeLife();
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;

    setChatReply("Thinking...");

    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput }),
    });

    const data = await res.json();
    setChatReply(data.reply);
    setChatInput("");
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial", maxWidth: 700 }}>
      <h1>🌱 AI Life System Planner</h1>

      <label>Life Goals</label>
      <textarea
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
        style={{ width: "100%", height: 50, marginBottom: 10 }}
      />

      <label>Current Routine</label>
      <textarea
        value={routine}
        onChange={(e) => setRoutine(e.target.value)}
        style={{ width: "100%", height: 50, marginBottom: 20 }}
      />

      <button onClick={analyzeLife}>Analyze My Life System</button>

      {analysis && (
        <>
          <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
            {analysis}
          </pre>

          <h3>🔥 Current Streak: {streak} days</h3>
          <p>
            📈 Current Mode: <strong>{mode}</strong>
          </p>

          <p>Did you follow the routine today?</p>
          <button onClick={() => updateStreak(true)}>Yes</button>
          <button onClick={() => updateStreak(false)} style={{ marginLeft: 10 }}>
            No
          </button>

          <hr style={{ margin: "30px 0" }} />

          <h2>🤖 AI Coach</h2>

          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask: why this routine? what if I miss?"
            style={{ width: "100%", padding: 8 }}
          />
          <button onClick={sendChat} style={{ marginTop: 10 }}>
            Ask Coach
          </button>

          {chatReply && (
            <div style={{ marginTop: 10, background: "#f4f4f4", padding: 10 }}>
              <strong>AI Coach:</strong> {chatReply}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
