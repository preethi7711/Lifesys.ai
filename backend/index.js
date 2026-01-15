import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let streak = 3;

function getMode() {
  if (streak <= 1) return "Recovery";
  if (streak <= 4) return "Standard";
  return "Growth";
}

// ---------- ANALYZE LIFE ----------
app.post("/analyze-life", (req, res) => {
  const { goals, routine } = req.body;
  const mode = getMode();

  let observation = "";
  let prediction = "";
  let system = "";

  // AI-like reasoning
  if (!routine || routine.toLowerCase() === "none") {
    observation = "You currently lack a structured daily routine.";
    prediction =
      "Without structure, motivation will fluctuate. Small habits are critical now.";
  } else {
    observation = "You are building consistency through routine awareness.";
    prediction =
      "Maintaining even minimal structure will compound results over time.";
  }

  if (mode === "Recovery") {
    system =
      "Recovery Mode:\n• Flexible wake-up\n• 1 focus block\n• Light movement\n• Zero pressure";
  } else if (mode === "Standard") {
    system =
      "Standard Mode:\n• Fixed wake-up\n• 2 focus blocks\n• Daily activity\n• Light reflection";
  } else {
    system =
      "Growth Mode:\n• Fixed wake-up + planning\n• 3 deep focus blocks\n• Workout or skill training\n• Night digital detox";
  }

  const aiResponse = `
Observations:
${observation}

Direction Prediction:
${prediction}

AI-Designed Life System:

${system}

Why this system?
This structure matches your current consistency level (${streak} day streak) 
and prevents burnout while maximizing progress.
`;

  res.json({ aiResponse, streak, mode });
});

// ---------- UPDATE STREAK ----------
app.post("/update-streak", (req, res) => {
  const { followedToday } = req.body;

  if (followedToday) streak++;
  else streak = Math.max(0, streak - 1);

  res.json({ streak, mode: getMode() });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
