const LOWER_CUE = "If loaded, stop at the clinician-advised 45° depth; otherwise use a comfortable range.";

const move = (key, name, patterns, prescription, options = {}) => ({
  key, name, patterns, prescription,
  family: options.family || key,
  role: options.role || "primary",
  conflicts: options.conflicts || [],
  cue: options.cue || (patterns.some((pattern) => ["squat", "unilateral"].includes(pattern)) ? LOWER_CUE : ""),
});
const block = (label, formats, movements) => ({ label, formats, movements });
const formats = (twenty, thirty, forty, fifty, sixty) => ({ 20: twenty, 30: thirty, 40: forty, 50: fifty, 60: sixty });
const swing = (key = "swing", prescription = "10–20 reps") => move(key, "Two-hand kettlebell swing", ["kbPower", "hinge"], prescription, { family: "kb-swing", conflicts: ["hip", "back"] });
const clean = (key = "clean", prescription = "5 each side") => move(key, "Kettlebell clean", ["kbPower", "hinge"], prescription, { family: "kb-clean", conflicts: ["elbow", "wrist", "back"] });
const cleanPress = (key = "clean-press", prescription = "5 each side") => move(key, "Alternating kettlebell clean and press", ["kbPower", "shoulderPress"], prescription, { family: "kb-clean-press", conflicts: ["shoulder", "elbow", "wrist", "back"] });
const goblet = (key = "goblet", prescription = "5–10 reps") => move(key, "Kettlebell goblet squat", ["squat", "quad"], prescription, { family: "squat-goblet", conflicts: ["hip", "knee", "back"] });
const tgu = (key = "tgu", prescription = "1 each side") => move(key, "Turkish get-up", ["kbMobility", "core", "shoulderPress"], prescription, { family: "kb-tgu", conflicts: ["shoulder", "wrist", "hip", "knee", "back"] });
const row = (key = "row", prescription = "8–12 each side") => move(key, "Supported single-arm kettlebell row", ["horizontalPull"], prescription, { family: "row-kb-supported", conflicts: ["elbow"] });
const floorPress = (key = "floor-press", prescription = "8–12 each side") => move(key, "Single-arm kettlebell floor press", ["chest"], prescription, { family: "chest-floor", conflicts: ["shoulder", "elbow", "wrist"] });

export const KETTLEBELL_CIRCUITS = [
  {
    id: "armour-building", name: "Armour Building Complex", equipment: "double", category: "Strength EMOM", demand: "medium", anchor: true,
    durations: [20, 30, 40, 50, 60], source: "Steve's proven double-kettlebell circuits",
    blocks: [
      block("EMOM", formats("12 minutes", "20 minutes", "30 minutes", "40 minutes", "50 minutes"), [
        move("double-clean", "Double-kettlebell clean", ["kbPower", "hinge"], "2 reps", { family: "kb-double-clean", conflicts: ["elbow", "wrist", "back"] }),
        move("double-press", "Double-kettlebell press", ["shoulderPress"], "1 rep", { family: "shoulder-double-kb", conflicts: ["shoulder", "elbow", "wrist"] }),
        move("rack-squat", "Double-kettlebell rack squat", ["squat", "quad"], "3 reps", { family: "squat-double-rack", conflicts: ["hip", "knee", "back"] }),
      ]),
      block("Complementary strength pair", formats(null, null, "2 sets", "3 sets", "4 sets"), [row("supported-row", "8–12 each side"), floorPress("floor-press", "8–12 each side")]),
    ],
  },
  {
    id: "simple-sinister", name: "Simple & Sinister", equipment: "single", category: "Practice & power", demand: "low",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven Simple & Sinister lane",
    warmup: "3 cycles · 5 halos each way, 5 comfortable goblet or prying squats, 5 glute bridges",
    blocks: [
      block("Swing practice · ample rest", formats("5 x 10", "7 x 10", "10 x 10", "10 x 10", "10 x 10"), [swing("swing", "10 crisp reps per set")]),
      block("Get-up practice", formats("2 rounds", "3 rounds", "5 rounds", "5 rounds", "5 rounds"), [tgu("get-up", "1 each side")]),
    ],
  },
  {
    id: "big-three", name: "The Big 3", equipment: "single", category: "Practice circuit", demand: "low",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven single-kettlebell circuits",
    blocks: [block("Five-minute round · generous rest", formats("3 rounds", "5 rounds", "6 rounds", "8 rounds", "10 rounds"), [swing("swing", "20 reps"), tgu("get-up", "1 each side"), goblet("goblet", "5 reps")])],
  },
  {
    id: "lung-buster", name: "Lung Buster", equipment: "single", category: "Conditioning complex", demand: "high",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven single-kettlebell circuits",
    blocks: [block("Continuous complex · rest as needed", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
      swing("opening-swing", "10 reps"), goblet("goblet", "5 reps"), cleanPress("clean-press", "5 each side"),
      move("thruster", "Single-kettlebell thruster", ["squat", "quad", "shoulderPress"], "5 reps", { family: "kb-thruster", conflicts: ["shoulder", "elbow", "hip", "knee", "back"] }),
      swing("closing-swing", "10 reps"),
    ])],
  },
  {
    id: "simple-complex-b", name: "Simple Complex B", equipment: "single", category: "Alternating-side complex", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven single-kettlebell circuits · technical tail omitted",
    blocks: [block("Complete one side, then the other", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
      move("single-swing", "Single-arm kettlebell swing", ["kbPower", "hinge"], "6 each side", { family: "kb-single-swing", conflicts: ["hip", "back", "elbow"] }),
      clean("clean", "5 each side"),
      move("front-squat", "Single-kettlebell front squat", ["squat", "quad"], "4 each side", { family: "squat-front-kb", conflicts: ["hip", "knee", "back"] }),
      move("press", "Single-kettlebell press", ["shoulderPress"], "3 each side", { family: "shoulder-kb", conflicts: ["shoulder", "elbow", "wrist"] }),
    ])],
  },
  {
    id: "swing-ladder", name: "Swing Ladder", equipment: "single", category: "Simple conditioning", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's approved swing-ladder pattern",
    blocks: [block("Swing and push-up ladder · controlled rest", formats("5 steps", "7 steps", "8 steps", "10 steps", "10 steps down and back"), [
      swing("swing", "10 reps each step"),
      move("push-up", "Push-up", ["chest"], "5 controlled reps or rest instead", { family: "chest-pushup", conflicts: ["shoulder", "wrist"] }),
    ])],
  },
  {
    id: "double-full-body", name: "Double-KB Full Body", equipment: "double", category: "Full-body EMOM", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven double-kettlebell circuits",
    blocks: [
      block("EMOM complex", formats("12 minutes", "20 minutes", "28 minutes", "36 minutes", "44 minutes"), [
        move("push-up", "Push-up on kettlebells", ["chest"], "5 reps", { family: "chest-kb-pushup", conflicts: ["shoulder", "wrist"] }),
        move("deadlift", "Double-kettlebell deadlift", ["hinge", "hamstring"], "5 reps", { family: "kb-double-deadlift", conflicts: ["hip", "back"] }),
        move("clean", "Double-kettlebell clean", ["kbPower", "hinge"], "5 reps", { family: "kb-double-clean", conflicts: ["elbow", "wrist", "back"] }),
        move("press", "Double-kettlebell press", ["shoulderPress"], "5 reps", { family: "shoulder-double-kb", conflicts: ["shoulder", "elbow", "wrist"] }),
        move("squat", "Double-kettlebell rack squat", ["squat", "quad"], "5 reps", { family: "squat-double-rack", conflicts: ["hip", "knee", "back"] }),
      ]),
      block("Row finisher", formats(null, null, "2 sets", "3 sets", "4 sets"), [row("supported-row", "10 each side")]),
    ],
  },
  {
    id: "home-five", name: "Home Five", equipment: "double", category: "Balanced strength circuit", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven home circuit · carry removed",
    blocks: [
      block("Strength circuit", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
        move("single-leg-deadlift", "Kettlebell single-leg deadlift", ["unilateral", "hinge", "hamstring"], "5 each side", { family: "kb-single-leg-rdl", conflicts: ["hip", "knee", "back"] }),
        row("supported-row", "5 each side"),
        move("seesaw-press", "Kettlebell seesaw press", ["shoulderPress"], "5 each side", { family: "shoulder-seesaw", conflicts: ["shoulder", "elbow", "wrist"] }),
        move("reverse-lunge", "Kettlebell reverse lunge", ["unilateral", "quad"], "5 each side", { family: "lunge-kb", conflicts: ["hip", "knee", "back"] }),
        move("seesaw-floor", "Kettlebell seesaw floor press", ["chest"], "5 each side", { family: "chest-seesaw-floor", conflicts: ["shoulder", "elbow", "wrist"] }),
      ]),
      block("Core finisher", formats(null, null, "2 sets", "3 sets", "4 sets"), [move("dead-bug", "Kettlebell dead bug pullover", ["core"], "8–12 reps", { family: "core-kb", role: "accessory", conflicts: ["shoulder"] })]),
    ],
  },
  {
    id: "strength-descent", name: "Squat, Row & Push-Press Descent", equipment: "double", category: "Descending strength ladder", demand: "high",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven strength descent · scaled volume",
    blocks: [block("Descending ladder", formats("5-to-1", "6-to-1", "7-to-1", "8-to-1", "10-to-1"), [
      move("rack-squat", "Double-kettlebell rack squat", ["squat", "quad"], "Current ladder number", { family: "squat-double-rack", conflicts: ["hip", "knee", "back"] }),
      move("bent-row", "Double-kettlebell bent-over row", ["horizontalPull"], "Current ladder number", { family: "row-double-kb", conflicts: ["elbow", "back"] }),
      move("push-press", "Double-kettlebell push press", ["shoulderPress", "kbPower"], "Current ladder number", { family: "shoulder-double-push", conflicts: ["shoulder", "elbow", "wrist", "back"] }),
    ])],
  },
  {
    id: "deconstruction", name: "Deconstruction Set", equipment: "double", category: "Strength-density complex", demand: "high",
    durations: [20, 30, 40, 50, 60], source: "Steve's proven deconstruction idea",
    blocks: [block("Complex, then individual movements", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
      move("clean-thruster", "Double-kettlebell clean and thruster", ["kbPower", "squat", "shoulderPress"], "3 reps", { family: "kb-double-thruster", conflicts: ["shoulder", "elbow", "wrist", "hip", "knee", "back"] }),
      move("clean", "Double-kettlebell clean", ["kbPower", "hinge"], "3 reps", { family: "kb-double-clean", conflicts: ["elbow", "wrist", "back"] }),
      move("press", "Double-kettlebell press", ["shoulderPress"], "3 reps", { family: "shoulder-double-kb", conflicts: ["shoulder", "elbow", "wrist"] }),
      move("rack-squat", "Double-kettlebell rack squat", ["squat", "quad"], "3 reps", { family: "squat-double-rack", conflicts: ["hip", "knee", "back"] }),
    ])],
  },
  {
    id: "warrior-dead-start", name: "Warrior: Dead-Start Power", equipment: "single", category: "Timed power blocks", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's completed Kettlebell Warrior patterns",
    blocks: [
      block("60-second blocks · 30 seconds rest", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
        move("dead-hike", "Dead-start kettlebell hike", ["hinge", "kbPower"], "30 seconds", { family: "kb-dead-hike", conflicts: ["hip", "back"] }),
        swing("dead-swing", "30 seconds dead-start swings"), swing("continuous-swing", "30 seconds continuous swings"),
      ]),
      block("Simple upper-body pair", formats(null, "2 sets", "2 sets", "3 sets", "4 sets"), [
        move("pushup-toe", "Push-up to toe touch", ["chest", "core"], "8–12 reps", { family: "chest-pushup-flow", conflicts: ["shoulder", "wrist", "back"] }), row("supported-row", "8–12 each side"),
      ]),
    ],
  },
  {
    id: "warrior-squat-hinge", name: "Warrior: Squat & Hinge", equipment: "single", category: "Strength pairs", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's completed Kettlebell Warrior patterns",
    blocks: [
      block("Strength pair", formats("2 sets", "3 sets", "4 sets", "5 sets", "6 sets"), [
        move("front-squat", "Kettlebell front squat", ["squat", "quad"], "10 reps", { family: "squat-front-kb", conflicts: ["hip", "knee", "back"] }),
        move("bstance-rdl", "B-stance kettlebell Romanian deadlift", ["unilateral", "hinge", "hamstring"], "10 each side", { family: "ham-bstance-rdl", conflicts: ["hip", "knee", "back"] }),
      ]),
      block("Press and row", formats(null, "2 sets", "2 sets", "3 sets", "4 sets"), [floorPress("floor-press", "10 each side"), row("row", "10 each side")]),
    ],
  },
  {
    id: "warrior-press-row", name: "Warrior: Press & Row", equipment: "single", category: "Upper-body density", demand: "low",
    durations: [20, 30, 40, 50, 60], source: "Steve's completed Kettlebell Warrior patterns",
    blocks: [
      block("Density block", formats("3 rounds", "4 rounds", "5 rounds", "6 rounds", "7 rounds"), [floorPress("floor-press", "10 each side"), row("row", "10 each side"), swing("swing", "10 reps")]),
      block("Trunk finisher", formats(null, null, "2 sets", "3 sets", "4 sets"), [move("dead-bug", "Kettlebell dead bug pullover", ["core"], "8–12 reps", { family: "core-kb", role: "accessory", conflicts: ["shoulder"] })]),
    ],
  },
  {
    id: "warrior-lunge-press", name: "Warrior: Lunge & Press", equipment: "single", category: "Timed athletic blocks", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's completed Kettlebell Warrior patterns",
    blocks: [
      block("60–90 seconds work · 30 seconds rest", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
        move("reverse-lunge", "Front-rack kettlebell reverse lunge", ["unilateral", "quad"], "6–10 each side", { family: "lunge-kb", conflicts: ["hip", "knee", "back"] }),
        move("push-press", "Single-kettlebell push press", ["shoulderPress", "kbPower"], "6–10 each side", { family: "shoulder-kb-push", conflicts: ["shoulder", "elbow", "wrist", "back"] }), swing("swing", "15 reps"),
      ]),
      block("Supported row", formats(null, "2 sets", "2 sets", "3 sets", "4 sets"), [row("supported-row", "10 each side")]),
    ],
  },
  {
    id: "warrior-getup-press", name: "Warrior: Get-Up & Floor Press", equipment: "single", category: "Controlled strength practice", demand: "low",
    durations: [20, 30, 40, 50, 60], source: "Steve's completed Kettlebell Warrior patterns",
    blocks: [
      block("Controlled circuit", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [tgu("get-up", "1 each side"), floorPress("floor-press", "10 each side"), row("row", "10 each side")]),
      block("Swing finisher · ample rest", formats(null, null, "5 x 10", "7 x 10", "10 x 10"), [swing("swing", "10 reps per set")]),
    ],
  },
  {
    id: "warrior-halo-lunge", name: "Warrior: Halo & Lateral Lunge", equipment: "single", category: "Lateral athletic circuit", demand: "medium",
    durations: [20, 30, 40, 50, 60], source: "Steve's completed Kettlebell Warrior patterns",
    blocks: [
      block("60-second blocks · 30 seconds rest", formats("2 rounds", "3 rounds", "4 rounds", "5 rounds", "6 rounds"), [
        move("halo", "Light kettlebell halo", ["mobilityShoulder", "core"], "5 each way", { family: "kb-halo", conflicts: ["shoulder", "elbow"] }),
        move("lateral-lunge", "Kettlebell lateral lunge", ["unilateral", "adductors"], "6–10 each side", { family: "lunge-lateral-kb", conflicts: ["hip", "knee", "back"] }), cleanPress("clean-press", "5 each side"),
      ]),
      block("Hinge complement", formats(null, "2 sets", "2 sets", "3 sets", "4 sets"), [move("rdl", "Kettlebell Romanian deadlift", ["hinge", "hamstring"], "10–15 reps", { family: "ham-rdl", conflicts: ["hip", "back"] })]),
    ],
  },
];

export const CIRCUIT_BY_ID = new Map(KETTLEBELL_CIRCUITS.map((circuit) => [circuit.id, circuit]));

export function selectKettlebellCircuit(options) {
  const recentIds = recentCircuitIds(options.history);
  let eligible = KETTLEBELL_CIRCUITS.filter((circuit) => circuit.durations.includes(options.duration));
  if (options.readiness === "low") {
    const controlled = eligible.filter((circuit) => circuit.demand !== "high");
    if (controlled.length) eligible = controlled;
  }
  eligible = eligible
    .filter((circuit) => circuit.id !== recentIds[0])
    .sort((a, b) => circuitScore(b, options, recentIds) - circuitScore(a, options, recentIds) || a.name.localeCompare(b.name));
  if (!eligible.length) return null;
  const armour = eligible.find((circuit) => circuit.anchor);
  if (armour && Math.abs(options.variation) % 8 === 0) return armour;
  const fresh = eligible.filter((circuit) => !recentIds.includes(circuit.id) && !circuit.anchor);
  const pool = fresh.length >= 3 ? fresh : eligible.filter((circuit) => !circuit.anchor);
  const choices = pool.length ? pool : eligible;
  const offset = Math.max(0, Math.abs(options.variation) - 1) % choices.length;
  return choices[offset];
}

export function buildCircuitExercises(circuit, duration) {
  let order = 0;
  return circuit.blocks.flatMap((item, blockIndex) => {
    const structure = item.formats[duration];
    if (!structure) return [];
    const group = `${item.label} · ${structure}`;
    return item.movements.map((movement, movementIndex) => ({
      id: `circuit-${circuit.id}-${blockIndex}-${movementIndex}-${movement.key}`,
      name: movement.name,
      locations: ["home"],
      equipment: circuit.equipment === "single" ? ["one kettlebell"] : ["two kettlebells"],
      patterns: movement.patterns,
      prescription: movement.prescription,
      family: movement.family,
      role: movement.role,
      stable: circuit.demand === "low",
      demand: circuit.demand,
      conflicts: movement.conflicts,
      cue: movement.cue,
      slotPattern: movement.patterns[0],
      slotLabel: movement.patterns[0],
      reason: "",
      group,
      order: ++order,
      swappable: false,
    }));
  });
}

export function circuitStructure(circuit, duration) {
  return circuit.blocks.map((item) => item.formats[duration] ? `${item.label}: ${item.formats[duration]}` : "").filter(Boolean).join(" · ");
}

function recentCircuitIds(history = []) {
  return history.filter((entry) => (entry.actualType || entry.type || entry.plannedType) === "kettlebell")
    .map((entry) => entry.circuitId).filter(Boolean).slice(0, 4);
}

function circuitScore(circuit, options, recentIds) {
  let value = 100;
  if (options.readiness === "low") value += circuit.demand === "low" ? 60 : circuit.demand === "medium" ? 15 : -50;
  if (options.readiness === "medium") value += circuit.demand === "medium" ? 25 : circuit.demand === "low" ? 10 : 0;
  if (options.readiness === "high") value += circuit.demand === "high" ? 35 : 0;
  if (recentIds.includes(circuit.id)) value -= 90;
  if (circuit.anchor) value += 12;
  return value + seededNoise(`${options.duration}:${options.readiness}:${circuit.id}`) * 18;
}

function seededNoise(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4_294_967_295;
}
