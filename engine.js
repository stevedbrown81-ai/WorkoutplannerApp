export const AREAS = [
  "Chest",
  "Back",
  "Shoulders",
  "Quads",
  "Hamstrings",
  "Calves",
  "Biceps",
  "Triceps",
];

export const LOCATION_LABELS = {
  kongs: "Kongs gym",
  home: "Home gym",
  bodyweight: "Bodyweight",
  hotel: "Hotel gym",
};

export const HOME_EQUIPMENT = [
  "Kettlebells: 1 × 12, 2 × 20, 2 × 24, 2 × 32, 1 × 48 kg",
  "7.5 kg macebell",
  "Dip bars",
  "Pull-up bar",
  "Gymnastic rings",
  "Climbing frame",
];

export const EXERCISE_LIBRARY = [
  // Kongs / commercial gym
  ex("Bench Press (Barbell)", "Chest", "Horizontal press", ["kongs"], "high", true, true),
  ex("Incline Bench Press (Dumbbell)", "Chest", "Incline press", ["kongs", "hotel"], "high", false, false, ["dumbbells", "bench"]),
  ex("Chest Press (Machine)", "Chest", "Horizontal press", ["kongs", "hotel"], "moderate", false, true, ["machines"]),
  ex("Weighted Dip", "Chest", "Dip pattern", ["kongs"], "high", false, false),
  ex("Iso Lateral High Row", "Back", "Horizontal row", ["kongs"], "high", true, true),
  ex("Seated Row (Cable)", "Back", "Horizontal row", ["kongs", "hotel"], "moderate", false, true, ["cable"]),
  ex("Iso Lateral Wide Pulldown", "Back", "Vertical pull", ["kongs"], "high", true, true),
  ex("Lat Pulldown (Cable)", "Back", "Vertical pull", ["kongs", "hotel"], "moderate", false, true, ["cable"]),
  ex("Pull-up", "Back", "Vertical pull", ["kongs", "home", "bodyweight", "hotel"], "high", false, false, ["pullup"]),
  ex("Overhead Press (Barbell)", "Shoulders", "Overhead press", ["kongs"], "high", true, false),
  ex("Iso Lateral Shoulder Press", "Shoulders", "Overhead press", ["kongs"], "moderate", false, true),
  ex("Lateral Raise (Dumbbell)", "Shoulders", "Lateral-delt", ["kongs", "hotel"], "low", false, true, ["dumbbells"]),
  ex("Face Pull (Cable)", "Shoulders", "Rear-delt / shoulder health", ["kongs", "hotel"], "low", false, true, ["cable"]),
  ex("ISO Lateral Leg Press", "Quads", "Leg press / squat", ["kongs"], "high", true, true),
  ex("Hack Squat", "Quads", "Leg press / squat", ["kongs"], "high", false, true),
  ex("Split Squat (Smith Machine)", "Quads", "Split-stance", ["kongs"], "high", false, true),
  ex("Leg Extension Hammer Strength", "Quads", "Knee extension", ["kongs"], "moderate", true, true),
  ex("Glute Drive", "Hamstrings", "Hip hinge / extension", ["kongs"], "moderate", true, true),
  ex("Romanian Deadlift (Dumbbell)", "Hamstrings", "Hip hinge / extension", ["kongs", "hotel"], "high", false, false, ["dumbbells"]),
  ex("Hamstring Curl", "Hamstrings", "Knee flexion", ["kongs", "hotel"], "moderate", true, true, ["machines"]),
  ex("Standing Calf Raise (Machine)", "Calves", "Standing calf raise", ["kongs"], "low", false, true),
  ex("Leg-press Calf Raise", "Calves", "Leg-press calf raise", ["kongs"], "low", false, true),
  ex("Seated Bicep Curl", "Biceps", "Supinated curl", ["kongs"], "low", false, true),
  ex("Hammer Curl (Dumbbell)", "Biceps", "Neutral / hammer curl", ["kongs", "hotel"], "low", false, true, ["dumbbells"]),
  ex("Bicep Curl (Cable)", "Biceps", "Supinated curl", ["kongs", "hotel"], "low", false, true, ["cable"]),
  ex("Cable Pushdown", "Triceps", "Pushdown", ["kongs", "hotel"], "low", false, true, ["cable"]),
  ex("Overhead Cable Extension", "Triceps", "Overhead extension", ["kongs", "hotel"], "low", false, true, ["cable"]),

  // Home gym
  ex("Double Kettlebell Floor Press", "Chest", "Horizontal press", ["home"], "high", false, true),
  ex("Ring Push-up", "Chest", "Push-up pattern", ["home", "bodyweight"], "moderate", false, false),
  ex("Dip", "Chest", "Dip pattern", ["home", "bodyweight"], "high", false, false),
  ex("One-arm Kettlebell Row", "Back", "Horizontal row", ["home"], "high", false, true),
  ex("Ring Row", "Back", "Horizontal row", ["home", "bodyweight"], "moderate", false, false),
  ex("Chin-up", "Back", "Vertical pull", ["home", "bodyweight"], "high", false, false),
  ex("Half-kneeling Kettlebell Press", "Shoulders", "Overhead press", ["home"], "high", false, false),
  ex("Ring Reverse Fly", "Shoulders", "Rear-delt / shoulder health", ["home", "bodyweight"], "low", false, false),
  ex("Mace 360", "Shoulders", "Shoulder health", ["home"], "low", false, false),
  ex("Double Kettlebell Front Squat", "Quads", "Leg press / squat", ["home"], "high", false, false),
  ex("Goblet Squat", "Quads", "Leg press / squat", ["home"], "moderate", false, true),
  ex("Bulgarian Split Squat", "Quads", "Split-stance", ["home", "bodyweight", "hotel"], "high", false, false, ["bench"]),
  ex("Double Kettlebell Romanian Deadlift", "Hamstrings", "Hip hinge / extension", ["home"], "high", false, false),
  ex("Kettlebell Swing", "Hamstrings", "Hip hinge / extension", ["home"], "moderate", false, false),
  ex("Sliding Leg Curl", "Hamstrings", "Knee flexion", ["home", "bodyweight", "hotel"], "moderate", false, false),
  ex("Loaded Single-leg Calf Raise", "Calves", "Standing calf raise", ["home"], "low", false, false),
  ex("Single-leg Calf Raise", "Calves", "Standing calf raise", ["home", "bodyweight", "hotel"], "low", false, false),
  ex("Kettlebell Curl", "Biceps", "Supinated curl", ["home"], "low", false, false),
  ex("Ring Curl", "Biceps", "Supinated curl", ["home", "bodyweight"], "low", false, false),
  ex("Kettlebell Hammer Curl", "Biceps", "Neutral / hammer curl", ["home"], "low", false, false),
  ex("Ring Triceps Extension", "Triceps", "Overhead extension", ["home", "bodyweight"], "low", false, false),
  ex("Overhead Kettlebell Extension", "Triceps", "Overhead extension", ["home"], "low", false, false),

  // Bodyweight fallbacks
  ex("Push-up", "Chest", "Push-up pattern", ["bodyweight", "hotel"], "moderate", false, true),
  ex("Pike Push-up", "Shoulders", "Overhead press", ["bodyweight", "hotel"], "moderate", false, false),
  ex("Reverse Snow Angel", "Shoulders", "Rear-delt / shoulder health", ["bodyweight", "hotel"], "low", false, false),
  ex("Walking Lunge", "Quads", "Split-stance", ["bodyweight", "hotel"], "moderate", false, false),
  ex("Single-leg Hip Bridge", "Hamstrings", "Hip hinge / extension", ["bodyweight", "hotel"], "moderate", false, false),
  ex("Close-grip Push-up", "Triceps", "Close-grip pressing", ["bodyweight", "hotel"], "low", false, false),

  // Hotel equipment-dependent choices
  ex("Dumbbell Bench Press", "Chest", "Horizontal press", ["hotel"], "high", false, true, ["dumbbells", "bench"]),
  ex("One-arm Dumbbell Row", "Back", "Horizontal row", ["hotel"], "high", false, true, ["dumbbells"]),
  ex("Band Row", "Back", "Horizontal row", ["hotel"], "moderate", false, false, ["bands"]),
  ex("Band Pulldown", "Back", "Vertical pull", ["hotel"], "moderate", false, false, ["bands"]),
  ex("Dumbbell Shoulder Press", "Shoulders", "Overhead press", ["hotel"], "high", false, false, ["dumbbells"]),
  ex("Goblet Squat (Dumbbell)", "Quads", "Leg press / squat", ["hotel"], "moderate", false, true, ["dumbbells"]),
  ex("Leg Press (Machine)", "Quads", "Leg press / squat", ["hotel"], "high", false, true, ["machines"]),
  ex("Dumbbell Romanian Deadlift", "Hamstrings", "Hip hinge / extension", ["hotel"], "high", false, false, ["dumbbells"]),
  ex("Dumbbell Calf Raise", "Calves", "Standing calf raise", ["hotel"], "low", false, false, ["dumbbells"]),
  ex("Dumbbell Curl", "Biceps", "Supinated curl", ["hotel"], "low", false, true, ["dumbbells"]),
  ex("Overhead Dumbbell Extension", "Triceps", "Overhead extension", ["hotel"], "low", false, false, ["dumbbells"]),
];

function ex(name, area, pattern, locations, demand, key = false, stable = false, equipment = []) {
  return { name, area, pattern, locations, demand, key, stable, equipment };
}

const EXACT_ALIASES = new Map([
  ["iso lateral leg press", ["Quads", "Leg press / squat"]],
  ["leg press", ["Quads", "Leg press / squat"]],
  ["seated leg press (machine)", ["Quads", "Leg press / squat"]],
  ["watson sissy squat", ["Quads", "Knee extension"]],
  ["leg extension (machine)", ["Quads", "Knee extension"]],
  ["split squat (smith machine)", ["Quads", "Split-stance"]],
  ["bulgarian split squat", ["Quads", "Split-stance"]],
  ["glute drive", ["Hamstrings", "Hip hinge / extension"]],
  ["glute kickback (machine)", ["Hamstrings", "Hip hinge / extension"]],
  ["kettlebell swing", ["Hamstrings", "Hip hinge / extension"]],
  ["trap bar deadlift", ["Hamstrings", "Hip hinge / extension"]],
  ["back extension", ["Hamstrings", "Hip hinge / extension"]],
  ["cable cbaum", ["Triceps", "Overhead extension"]],
  ["triceps extension", ["Triceps", "Overhead extension"]],
  ["skullcrusher cable", ["Triceps", "Overhead extension"]],
  ["tricep pulldown", ["Triceps", "Pushdown"]],
  ["seated dip", ["Chest", "Dip pattern"]],
  ["chest dip", ["Chest", "Dip pattern"]],
  ["sally push up", ["Chest", "Push-up pattern"]],
  ["pull up", ["Back", "Vertical pull"]],
  ["watson back machine", ["Back", "Horizontal row"]],
  ["kb halo", ["Shoulders", "Shoulder health"]],
  ["mace 360", ["Shoulders", "Shoulder health"]],
  ["kb curl", ["Biceps", "Supinated curl"]],
  ["seated bicep curl", ["Biceps", "Supinated curl"]],
  ["bicep curl cable handle", ["Biceps", "Supinated curl"]],
  ["cable push", ["Triceps", "Pushdown"]],
]);

export function classifyExercise(rawName) {
  const name = normalise(rawName);
  if (EXACT_ALIASES.has(name)) {
    const [area, pattern] = EXACT_ALIASES.get(name);
    return { area, pattern };
  }
  if (/incline.*(bench|chest press)/.test(name)) return hit("Chest", "Incline press");
  if (/(bench press|chest press|kb floor press|floor press)/.test(name)) return hit("Chest", "Horizontal press");
  if (/(pec deck|cable crossover|chest fly)/.test(name)) return hit("Chest", "Fly / adduction");
  if (/(push.?up)/.test(name)) return hit("Chest", "Push-up pattern");
  if (/(pullover)/.test(name)) return hit("Back", "Straight-arm pull");
  if (/(pulldown|pull.?up|chin.?up)/.test(name)) return hit("Back", "Vertical pull");
  if (/(row)/.test(name)) return hit("Back", "Horizontal row");
  if (/(face pull|reverse fly)/.test(name)) return hit("Shoulders", "Rear-delt / shoulder health");
  if (/(lateral raise|upright row)/.test(name)) return hit("Shoulders", "Lateral-delt");
  if (/(overhead press|shoulder press|double kb press|kneeling kb press)/.test(name)) return hit("Shoulders", "Overhead press");
  if (/(leg extension|sissy squat)/.test(name)) return hit("Quads", "Knee extension");
  if (/(split squat|lunge)/.test(name)) return hit("Quads", "Split-stance");
  if (/(leg press|hack squat|goblet squat|front squat)/.test(name)) return hit("Quads", "Leg press / squat");
  if (/(hamstring curl|leg curl)/.test(name)) return hit("Hamstrings", "Knee flexion");
  if (/(romanian deadlift|rdl|glute drive|glute kickback|kettlebell swing|trap bar deadlift|back extension)/.test(name)) return hit("Hamstrings", "Hip hinge / extension");
  if (/calf raise/.test(name)) return hit("Calves", "Standing calf raise");
  if (/(hammer curl)/.test(name)) return hit("Biceps", "Neutral / hammer curl");
  if (/(bicep curl|biceps curl|kb curl|preacher curl)/.test(name)) return hit("Biceps", "Supinated curl");
  if (/(pushdown|pulldown)/.test(name) && /tricep/.test(name)) return hit("Triceps", "Pushdown");
  if (/(tricep|skullcrusher|cbaum)/.test(name)) return hit("Triceps", "Overhead extension");
  return null;
}

function hit(area, pattern) {
  return { area, pattern };
}

function normalise(value) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field.replace(/\r$/, ""));
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

export function parseStrongCsv(text) {
  const matrix = parseCsv(text.replace(/^\uFEFF/, ""));
  if (matrix.length < 2) throw new Error("The CSV does not contain workout rows.");
  const headers = matrix[0].map((header) => header.trim());
  const required = ["Date", "Workout Name", "Exercise Name", "Set Order", "Reps"];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) throw new Error(`This does not look like a Strong export. Missing: ${missing.join(", ")}.`);

  const sessionsByDate = new Map();
  const unknown = new Set();
  for (const cells of matrix.slice(1)) {
    const record = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    const dateText = record.Date?.trim();
    const exerciseName = record["Exercise Name"]?.trim();
    if (!dateText || !exerciseName) continue;
    const date = parseStrongDate(dateText);
    if (!date) continue;
    const key = date.toISOString();
    if (!sessionsByDate.has(key)) {
      sessionsByDate.set(key, {
        date: key,
        name: record["Workout Name"]?.trim() || "Workout",
        exercises: new Map(),
      });
    }
    const session = sessionsByDate.get(key);
    const mapping = classifyExercise(exerciseName);
    if (!mapping) unknown.add(exerciseName);
    if (!session.exercises.has(exerciseName)) {
      session.exercises.set(exerciseName, {
        name: exerciseName,
        mapping,
        workingSets: 0,
      });
    }
    const exercise = session.exercises.get(exerciseName);
    const setOrder = normalise(record["Set Order"]);
    const reps = Number.parseFloat(record.Reps || "0");
    if (setOrder !== "w" && Number.isFinite(reps) && reps > 0) exercise.workingSets += 1;
  }

  const sessions = [...sessionsByDate.values()]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((session) => {
      const areaSets = Object.fromEntries(AREAS.map((area) => [area, 0]));
      const patternSets = {};
      const movements = [];
      for (const exercise of session.exercises.values()) {
        if (!exercise.mapping || exercise.workingSets === 0) continue;
        const { area, pattern } = exercise.mapping;
        areaSets[area] += exercise.workingSets;
        patternSets[pattern] = (patternSets[pattern] || 0) + exercise.workingSets;
        movements.push({
          name: exercise.name,
          area,
          pattern,
          workingSets: exercise.workingSets,
        });
      }
      return {
        date: session.date,
        name: session.name,
        areaSets,
        patternSets,
        movements,
      };
    });

  if (!sessions.length) throw new Error("No dated Strong workouts could be read.");
  return {
    sessions,
    unknown: [...unknown].sort(),
    importedAt: new Date().toISOString(),
    latestWorkout: sessions.at(-1).date,
  };
}

function parseStrongDate(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/);
  if (!match) return null;
  const [, year, month, day, hour = "00", minute = "00", second = "00"] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function analyseHistory(history) {
  const sessions = history?.sessions || [];
  const latestDate = sessions.length ? new Date(sessions.at(-1).date) : new Date();
  const areaStats = {};
  const patternStats = {};
  for (const area of AREAS) areaStats[area] = emptyStat();

  sessions.forEach((session, sessionIndex) => {
    const sessionDate = new Date(session.date);
    for (const area of AREAS) {
      const sets = session.areaSets?.[area] || 0;
      if (sets > 0) updateStat(areaStats[area], sessionDate, sessionIndex, sets, latestDate);
    }
    for (const [pattern, sets] of Object.entries(session.patternSets || {})) {
      patternStats[pattern] ||= emptyStat();
      if (sets > 0) updateStat(patternStats[pattern], sessionDate, sessionIndex, sets, latestDate);
    }
  });
  return { latestDate, areaStats, patternStats, sessionCount: sessions.length };
}

function emptyStat() {
  return { lastDate: null, lastSessionIndex: -1, lastSets: 0, sets14: 0, hits14: 0 };
}

function updateStat(stat, date, sessionIndex, sets, latestDate) {
  stat.lastDate = date.toISOString();
  stat.lastSessionIndex = sessionIndex;
  stat.lastSets = sets;
  const age = daysBetween(date, latestDate);
  if (age <= 14) {
    stat.sets14 += sets;
    stat.hits14 += 1;
  }
}

export function generatePlan(history, {
  location = "kongs",
  equipment = [],
  energy = 7,
  soreness = "",
  hardActivity = false,
} = {}) {
  const analysis = analyseHistory(history);
  const available = EXERCISE_LIBRARY.filter((exercise) => {
    if (!exercise.locations.includes(location)) return false;
    if (location !== "hotel" || exercise.equipment.length === 0) return true;
    return exercise.equipment.every((item) => equipment.includes(item));
  });
  const familiarity = new Set(
    (history?.sessions || []).flatMap((session) => session.movements?.map((movement) => normalise(movement.name)) || []),
  );

  const choices = AREAS.map((area) => {
    const candidates = available
      .filter((exercise) => exercise.area === area)
      .map((exercise) => ({
        ...exercise,
        score: scoreExercise(exercise, analysis, familiarity, energy),
        lastDone: findLastExercise(history, exercise.name),
      }))
      .sort((a, b) => b.score - a.score || demandRank(b.demand) - demandRank(a.demand) || a.name.localeCompare(b.name));

    if (!candidates.length) {
      return {
        area,
        candidates: [],
        selected: null,
        areaStat: analysis.areaStats[area],
        focusScore: -999,
      };
    }
    const top = candidates[0];
    return {
      area,
      candidates: candidates.slice(0, 5),
      selected: top,
      areaStat: analysis.areaStats[area],
      focusScore: top.score + demandRank(top.demand) * 7,
    };
  });

  const focusAreas = choices
    .filter((choice) => choice.selected && choice.selected.demand !== "low")
    .sort((a, b) => b.focusScore - a.focusScore)
    .slice(0, 2)
    .map((choice) => choice.area);

  const ordered = [...choices].sort((a, b) => {
    const aFocus = focusAreas.indexOf(a.area);
    const bFocus = focusAreas.indexOf(b.area);
    if (aFocus !== -1 || bFocus !== -1) {
      if (aFocus === -1) return 1;
      if (bFocus === -1) return -1;
      return aFocus - bFocus;
    }
    return demandRank(b.selected?.demand) - demandRank(a.selected?.demand) || b.focusScore - a.focusScore;
  });

  const recoveryMode = Number(energy) <= 4 || (Number(energy) <= 6 && hardActivity) ? "reduced" : "normal";
  return {
    choices: ordered,
    focusAreas,
    recoveryMode,
    recoveryNote: buildRecoveryNote(recoveryMode, soreness, hardActivity),
    latestDate: analysis.latestDate.toISOString(),
  };
}

function scoreExercise(exercise, analysis, familiarity, energy) {
  const pattern = analysis.patternStats[exercise.pattern] || emptyStat();
  const sessionsSince = pattern.lastSessionIndex < 0
    ? Math.min(8, analysis.sessionCount + 2)
    : analysis.sessionCount - 1 - pattern.lastSessionIndex;
  const daysSince = pattern.lastDate ? Math.min(45, daysBetween(new Date(pattern.lastDate), analysis.latestDate)) : 45;
  let score = sessionsSince * 18 + daysSince * 0.65 - pattern.sets14 * 1.25;
  if (exercise.key) score += 6;
  if (familiarity.has(normalise(exercise.name))) score += 4;
  if (Number(energy) <= 4) {
    if (exercise.stable) score += 18;
    if (exercise.demand === "high") score -= 12;
  }
  return score;
}

function buildRecoveryNote(mode, soreness, hardActivity) {
  const notes = [];
  if (mode === "reduced") notes.push("Use stable choices and keep both sets comfortably short of failure.");
  else notes.push("Use two high-quality working sets per movement, normally around RPE 7–9.");
  if (hardActivity) notes.push("Account for fatigue from recent sport or running when selecting lower-body movements.");
  if (String(soreness).trim()) notes.push("If pain or soreness changes normal technique, replace or remove the affected movement.");
  return notes.join(" ");
}

function findLastExercise(history, name) {
  const target = normalise(name);
  const sessions = history?.sessions || [];
  for (let index = sessions.length - 1; index >= 0; index -= 1) {
    const movement = sessions[index].movements?.find((item) => normalise(item.name) === target);
    if (movement) return { date: sessions[index].date, workingSets: movement.workingSets };
  }
  return null;
}

function demandRank(demand) {
  return demand === "high" ? 3 : demand === "moderate" ? 2 : demand === "low" ? 1 : 0;
}

export function daysBetween(earlier, later) {
  return Math.max(0, Math.round((later.getTime() - earlier.getTime()) / 86_400_000));
}

export function formatShortDate(value) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(value));
}

export function formatLongDate(value) {
  if (!value) return "No workout";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
