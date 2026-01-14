import { useState } from "react";

function App() {
  const [goals, setGoals] = useState("");
  const [routine, setRoutine] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");

  const analyzeLife = async () => {
    const res = await fetch("http://localhost:5000/analyze-life", {
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
    const res = await fetch("http://localhost:5000/update-streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followedToday }),
    });

    const data = await res.json();
    setStreak(data.streak);
    setMode(data.mode);
    await analyzeLife();
  };

  const sendChat = async () => {
    setChatReply("Thinking...");

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput }),
    });

    const data = await res.json();
    setChatReply(data.reply);
    setChatInput("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px",
        fontFamily: "Segoe UI, Arial",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 30 }}>
          🌱 AI Life System Planner
        </h1>

        {/* INPUT CARD */}
        <div style={cardStyle}>
          <h2>📝 Your Inputs</h2>

          <label>Life Goals</label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            style={inputStyle}
            placeholder="Example: good health, financial stability"
          />

          <label>Current Routine</label>
          <textarea
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
            style={inputStyle}
            placeholder="Example: irregular sleep, scrolling, no fixed routine"
          />

          <button style={primaryBtn} onClick={analyzeLife}>
            Analyze My Life System
          </button>
        </div>

        {/* ANALYSIS CARD */}
        {analysis && (
          <>
            <div style={cardStyle}>
              <h2>📊 Life System Analysis</h2>
              <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {analysis}
              </pre>

              <div style={{ marginTop: 15 }}>
                <strong>🔥 Current Streak:</strong> {streak} days <br />
                <strong>📈 Current Mode:</strong> {mode}
              </div>

              <div style={{ marginTop: 15 }}>
                <p>Did you follow the routine today?</p>
                <button
                  style={successBtn}
                  onClick={() => updateStreak(true)}
                >
                  Yes
                </button>
                <button
                  style={dangerBtn}
                  onClick={() => updateStreak(false)}
                >
                  No
                </button>
              </div>
            </div>

            {/* AI COACH CARD */}
            <div style={cardStyle}>
              <h2>🤖 AI Coach</h2>

              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask: why this routine? what if I miss?"
                style={chatInputStyle}
              />
              <button style={primaryBtn} onClick={sendChat}>
                Ask Coach
              </button>

              {chatReply && (
                <div style={chatReplyBox}>
                  <strong>AI Coach:</strong>
                  <div style={{ marginTop: 5 }}>{chatReply}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const cardStyle = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "10px",
  marginBottom: "25px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  height: "70px",
  marginTop: 5,
  marginBottom: 15,
  padding: 10,
  fontSize: 14,
};

const chatInputStyle = {
  width: "100%",
  padding: 10,
  fontSize: 14,
  marginBottom: 10,
};

const primaryBtn = {
  padding: "10px 16px",
  background: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const successBtn = {
  ...primaryBtn,
  marginRight: 10,
};

const dangerBtn = {
  padding: "10px 16px",
  background: "#f44336",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const chatReplyBox = {
  marginTop: 15,
  background: "#f1f8e9",
  padding: 12,
  borderRadius: 6,
};

export default App;
