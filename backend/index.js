import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

let streak = 5;

// sanity check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

function getMode() {
  if (streak <= 1) return "Recovery";
  if (streak <= 4) return "Standard";
  return "Growth";
}

// -------- ANALYZE LIFE --------
app.post("/analyze-life", (req, res) => {
  const mode = getMode();

  let system =
    mode === "Recovery"
      ? "Recovery Mode:\n• Flexible wake-up\n• 1 focus block\n• Light movement"
      : mode === "Standard"
      ? "Standard Mode:\n• Fixed wake-up\n• 2 focus blocks\n• Daily activity"
      : "Growth Mode:\n• Fixed wake-up + planning\n• 3 focus blocks\n• Workout\n• Digital detox";

  res.json({
    aiResponse:
      `Observations:\nYou are currently in ${mode} Mode.\n\n` +
      `Direction Prediction:\nConsistency is driving progress.\n\n` +
      `AI-Designed Life System:\n\n${system}`,
    streak,
    mode,
  });
});

// -------- UPDATE STREAK --------
app.post("/update-streak", (req, res) => {
  const { followedToday } = req.body;

  if (followedToday === true) streak++;
  else streak = Math.max(streak - 1, 0);

  res.json({ streak, mode: getMode() });
});

// -------- AI COACH (THIS WAS MISSING BEFORE) --------
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Please type something." });
  }

  const text = message.toLowerCase();
  const mode = getMode();

  let reply =
    "I’m your AI Coach. Ask me why your routine changed, what if you miss a day, or how to improve.";

  if (text.includes("why")) {
    reply = `You are in ${mode} Mode because your streak is ${streak} days. The system adapts to consistency.`;
  } else if (text.includes("miss")) {
    reply =
      "Missing one day is okay. The system reduces intensity, not motivation.";
  } else if (text.includes("improve")) {
    reply =
      "The fastest improvement comes from protecting your streak, even with small actions.";
  } else if (text.includes("mode")) {
    reply = `Your current mode is ${mode}. Each mode matches your consistency level.`;
  }

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
