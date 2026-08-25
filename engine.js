export const SESSION_TYPES = [
  ["push", "Push"], ["pull", "Pull"], ["legs", "Legs"], ["upper", "Upper"],
  ["lower", "Lower"], ["full", "Full body"], ["bodyweight", "Bodyweight"],
  ["kettlebell", "Kettlebell"], ["mobility", "Mobility"], ["mixed", "Mixed"],
].map(([id, label]) => ({ id, label }));

export const LOCATIONS = [
  ["kongs", "Kongs"], ["home", "Home / garage"], ["hotel", "Hotel"], ["bodyweight", "No equipment"],
].map(([id, label]) => ({ id, label }));

export const PAIN_AREAS = [
  ["shoulder", "Shoulder"], ["elbow", "Elbow"], ["wrist", "Wrist / hand"],
  ["back", "Lower back"], ["hip", "Hip"], ["knee", "Knee"],
  ["ankle", "Ankle / foot"], ["general", "General soreness"],
].map(([id, label]) => ({ id, label }));

const TYPE_LABELS = Object.fromEntries(SESSION_TYPES.map(({ id, label }) => [id, label]));
const LOCATION_LABELS = Object.fromEntries(LOCATIONS.map(({ id, label }) => [id, label]));
const PAIN_LABELS = Object.fromEntries(PAIN_AREAS.map(({ id, label }) => [id, label]));

const SLOTS = {
  push: [["chest"], ["shoulderPress", "chest"], ["triceps"], ["lateralDelt", "rearDelt"], ["chest", "triceps"], ["shoulderHealth", "lateralDelt"], ["core", "carry"]],
  pull: [["verticalPull"], ["horizontalPull"], ["horizontalPull", "rearDelt"], ["rearDelt", "shoulderHealth"], ["biceps"], ["carry", "traps", "grip"], ["core"]],
  legs: [["knee"], ["hinge"], ["hamstring"], ["unilateral", "glute"], ["quadIsolation", "glute"], ["calves"], ["carry", "core"]],
  upper: [["chest"], ["horizontalPull", "verticalPull"], ["shoulderPress", "chest"], ["verticalPull", "horizontalPull"], ["rearDelt", "lateralDelt", "shoulderHealth"], ["triceps", "biceps"], ["carry", "core", "traps"]],
  lower: [["knee"], ["hinge", "hamstring"], ["unilateral", "quadIsolation", "glute"], ["hamstring", "glute"], ["calves"], ["core", "carry"], ["hipAccessory"]],
  full: [["knee"], ["hinge", "hamstring"], ["chest"], ["horizontalPull", "verticalPull"], ["shoulderPress", "rearDelt", "shoulderHealth"], ["unilateral", "glute"], ["carry", "core"]],
  bodyweight: [["bodyPush"], ["bodyPull"], ["bodyKnee"], ["bodyPosterior"], ["bodyUnilateral"], ["bodyCore"], ["bodyMobility"]],
  kettlebell: [["kbPower", "kbHinge"], ["kbKnee"], ["kbPush"], ["kbPull"], ["kbUnilateral", "kbComplex"], ["kbCarry", "kbCore"], ["kbMobility", "mobility"]],
  mobility: [["mobilitySpine"], ["mobilityShoulder"], ["mobilityHip"], ["mobilityFlow"], ["mobilityCore"], ["mobilityCarry"], ["mobilityBreathing"]],
  mixed: [["power", "kbPower"], ["knee", "kbKnee", "bodyKnee"], ["chest", "kbPush", "bodyPush"], ["horizontalPull", "verticalPull", "kbPull", "bodyPull"], ["hinge", "kbHinge", "bodyPosterior"], ["carry", "kbCarry", "core"], ["mobility", "shoulderHealth"]],
};

const EXERCISES = [
  // Kongs: Steve's preferred familiar library.
  ex("k-incline-db", "Incline dumbbell bench press", "kongs", ["chest"], "2 x 6-10", { demand: "high", avoid: ["shoulder"], cue: "Use a comfortable, slightly neutral grip." }),
  ex("k-weighted-dip", "Chest dip / weighted dip", "kongs", ["chest", "triceps"], "2 x 6-10", { demand: "high", avoid: ["shoulder", "elbow", "wrist"] }),
  ex("k-iso-chest", "Iso-lateral chest press", "kongs", ["chest"], "2 x 6-10", { stable: true, priority: 4, cue: "Set the handles for a pain-free pressing path." }),
  ex("k-incline-machine", "Incline chest press machine", "kongs", ["chest"], "2 x 8-12", { stable: true, priority: 3 }),
  ex("k-pec-deck", "Pec deck", "kongs", ["chest"], "2 x 10-15", { stable: true, avoid: ["shoulder"] }),
  ex("k-crossover", "Cable crossover", "kongs", ["chest"], "2 x 10-15", { stable: true, avoid: ["shoulder"] }),
  ex("k-iso-shoulder", "Iso-lateral shoulder press", "kongs", ["shoulderPress"], "2 x 6-10", { stable: true, priority: 3, avoid: ["shoulder"] }),
  ex("k-plate-shoulder", "Plate-loaded shoulder press", "kongs", ["shoulderPress"], "2 x 8-12", { stable: true, avoid: ["shoulder"] }),
  ex("k-lat-pulldown", "Lat pulldown", "kongs", ["verticalPull"], "2 x 8-12", { stable: true, priority: 3, avoid: ["elbow"] }),
  ex("k-wide-pulldown", "Iso-lateral wide pulldown", "kongs", ["verticalPull"], "2 x 8-12", { stable: true, priority: 2, avoid: ["shoulder"] }),
  ex("k-underhand-pulldown", "Underhand lat pulldown", "kongs", ["verticalPull"], "2 x 8-12", { stable: true, avoid: ["elbow"] }),
  ex("k-pullup", "Pull-ups", "kongs", ["verticalPull"], "2 x 6-10", { demand: "high", avoid: ["shoulder", "elbow"] }),
  ex("k-high-row", "Iso-lateral high row", "kongs", ["horizontalPull"], "2 x 6-10", { stable: true, priority: 5 }),
  ex("k-cable-row", "Seated cable row", "kongs", ["horizontalPull"], "2 x 8-12", { stable: true, priority: 5 }),
  ex("k-iso-row", "Iso-lateral row", "kongs", ["horizontalPull"], "2 x 8-12", { stable: true, priority: 3 }),
  ex("k-single-cable-row", "Single-arm cable row", "kongs", ["horizontalPull"], "2 x 8-12 each side", { stable: true, priority: 2 }),
  ex("k-wide-cable-row", "Wide-grip seated cable row", "kongs", ["horizontalPull", "rearDelt"], "2 x 10-15", { stable: true, avoid: ["shoulder"] }),
  ex("k-face-pull", "Face pull", "kongs", ["rearDelt", "shoulderHealth"], "2 x 12-20", { stable: true, priority: 3 }),
  ex("k-rear-cable", "Cable rear-delt fly", "kongs", ["rearDelt", "shoulderHealth"], "2 x 12-20", { stable: true }),
  ex("k-cable-lateral", "Cable lateral raise", "kongs", ["lateralDelt"], "2 x 12-20", { stable: true, priority: 3, avoid: ["shoulder"] }),
  ex("k-lateral-machine", "Lateral raise machine", "kongs", ["lateralDelt"], "2 x 12-20", { stable: true, priority: 2, avoid: ["shoulder"] }),
  ex("k-seated-dip", "Seated dip", "kongs", ["triceps"], "2 x 8-12", { stable: true, avoid: ["shoulder", "elbow"] }),
  ex("k-triceps-extension", "Cable triceps extension", "kongs", ["triceps"], "2 x 10-15", { stable: true, avoid: ["elbow"] }),
  ex("k-pushdown", "Cable triceps pushdown", "kongs", ["triceps"], "2 x 10-15", { stable: true, priority: 2, avoid: ["elbow"] }),
  ex("k-seated-curl", "Seated biceps curl", "kongs", ["biceps"], "2 x 10-15", { stable: true, avoid: ["elbow"] }),
  ex("k-hammer-curl", "Hammer curl", "kongs", ["biceps"], "2 x 8-12", { priority: 4, cue: "Keep the grip neutral and stop if the medial elbow complains." }),
  ex("k-cable-curl", "Cable biceps curl", "kongs", ["biceps"], "2 x 10-15", { stable: true, avoid: ["elbow"] }),
  ex("k-leg-press-iso", "Iso-lateral leg press", "kongs", ["knee"], "2 x 6-10", { stable: true, priority: 5, avoid: ["knee", "hip"] }),
  ex("k-leg-press", "Leg press", "kongs", ["knee"], "2 x 6-10", { stable: true, priority: 4, avoid: ["knee", "hip"] }),
  ex("k-hack", "Hack squat", "kongs", ["knee"], "2 x 6-10", { stable: true, demand: "high", avoid: ["knee", "hip", "back"] }),
  ex("k-smith-split", "Smith machine split squat", "kongs", ["knee", "unilateral", "glute"], "2 x 8-12 each side", { stable: true, avoid: ["knee", "hip"] }),
  ex("k-leg-extension", "Hammer Strength leg extension", "kongs", ["quadIsolation"], "2 x 10-15", { stable: true, priority: 4, avoid: ["knee"] }),
  ex("k-ham-curl", "Hamstring curl", "kongs", ["hamstring"], "2 x 8-12", { stable: true, priority: 5 }),
  ex("k-iso-ham-curl", "Iso-lateral hamstring curl", "kongs", ["hamstring"], "2 x 10-15", { stable: true, priority: 3 }),
  ex("k-db-rdl", "Dumbbell Romanian deadlift", "kongs", ["hinge"], "2 x 6-10", { priority: 4, demand: "high", avoid: ["back", "hip"] }),
  ex("k-trap-deadlift", "Trap-bar deadlift", "kongs", ["hinge"], "2 x 5-8", { demand: "high", avoid: ["back", "hip", "knee"] }),
  ex("k-glute-drive", "Glute drive", "kongs", ["glute"], "2 x 8-12", { stable: true, avoid: ["hip", "back"] }),
  ex("k-calf", "Standing calf raise machine", "kongs", ["calves"], "2 x 10-15", { stable: true, priority: 3, avoid: ["ankle"] }),
  ex("k-abductor", "Hip abductor machine", "kongs", ["hipAccessory", "glute"], "2 x 12-20", { stable: true, avoid: ["hip"] }),
  ex("k-adductor", "Hip adductor machine", "kongs", ["hipAccessory"], "2 x 12-20", { stable: true, avoid: ["hip"] }),
  ex("k-shrug", "Dumbbell shrug", "kongs", ["traps", "carry"], "2 x 8-12", { avoid: ["shoulder"] }),
  ex("k-suitcase", "Dumbbell suitcase carry", "kongs", ["carry", "grip", "core"], "2 rounds each side", { format: "rounds", avoid: ["wrist", "back"] }),
  ex("k-plank", "Front plank", "kongs", ["core"], "2 x 30-45 sec", { format: "time" }),

  // Home / garage: 12, pairs of 20/24/32 kg, pull-up bar, rings, parallettes, bands and 7.5 kg mace.
  ex("h-kb-floor", "Double-kettlebell floor press", "home", ["chest", "kbPush"], "2 x 6-10", { priority: 4, avoid: ["shoulder", "elbow", "wrist"], cue: "Use a neutral grip." }),
  ex("h-kb-press", "Double-kettlebell press", "home", ["shoulderPress", "kbPush"], "2 x 5-8", { demand: "high", avoid: ["shoulder", "elbow", "wrist"] }),
  ex("h-ring-pushup", "Ring push-up", "home", ["chest", "bodyPush"], "2 x 8-15", { priority: 4, avoid: ["shoulder", "wrist"], cue: "Let the rings find a comfortable wrist and shoulder angle." }),
  ex("h-parallette-pushup", "Parallette push-up", "home", ["chest", "bodyPush"], "2 x 8-15", { priority: 3, avoid: ["shoulder"] }),
  ex("h-ring-dip", "Ring dip", "home", ["chest", "triceps", "bodyPush"], "2 x 6-10", { demand: "high", avoid: ["shoulder", "elbow", "wrist"] }),
  ex("h-band-press", "Standing band chest press", "home", ["chest"], "2 x 12-20", { stable: true }),
  ex("h-pullup", "Pull-ups", "home", ["verticalPull", "bodyPull"], "2 x 6-10", { priority: 4, demand: "high", avoid: ["shoulder", "elbow"] }),
  ex("h-ring-row", "Ring row", "home", ["horizontalPull", "bodyPull"], "2 x 8-15", { priority: 5, cue: "Adjust foot position to finish with clean reps." }),
  ex("h-kb-row", "Double-kettlebell row", "home", ["horizontalPull", "kbPull"], "2 x 6-10", { priority: 4, avoid: ["back"] }),
  ex("h-single-kb-row", "Supported single-arm kettlebell row", "home", ["horizontalPull", "kbPull"], "2 x 8-12 each side", { stable: true }),
  ex("h-band-pulldown", "Kneeling band pulldown", "home", ["verticalPull"], "2 x 12-20", { stable: true, avoid: ["shoulder"] }),
  ex("h-band-face", "Band face pull", "home", ["rearDelt", "shoulderHealth"], "2 x 15-20", { stable: true, priority: 3 }),
  ex("h-band-lateral", "Band lateral raise", "home", ["lateralDelt"], "2 x 12-20", { avoid: ["shoulder"] }),
  ex("h-band-triceps", "Band triceps pressdown", "home", ["triceps"], "2 x 12-20", { stable: true, avoid: ["elbow"] }),
  ex("h-kb-hammer", "Kettlebell hammer curl", "home", ["biceps"], "2 x 8-12", { priority: 3 }),
  ex("h-front-squat", "Double-kettlebell front squat", "home", ["knee", "kbKnee"], "2 x 5-8", { priority: 5, demand: "high", avoid: ["knee", "hip", "back", "wrist"] }),
  ex("h-goblet", "Goblet squat", "home", ["knee", "kbKnee"], "2 x 8-12", { priority: 3, avoid: ["knee", "hip", "back"] }),
  ex("h-split", "Kettlebell split squat", "home", ["unilateral", "knee", "kbUnilateral"], "2 x 8-12 each side", { avoid: ["knee", "hip", "ankle"] }),
  ex("h-kb-rdl", "Double-kettlebell Romanian deadlift", "home", ["hinge", "kbHinge"], "2 x 6-10", { priority: 5, demand: "high", avoid: ["back", "hip"] }),
  ex("h-swings", "Two-hand kettlebell swing", "home", ["power", "kbPower", "kbHinge"], "5 x 10 crisp reps", { format: "rounds", priority: 4, demand: "high", avoid: ["back", "hip"] }),
  ex("h-ham-walkout", "Hamstring walkout", "home", ["hamstring", "bodyPosterior"], "2 x 8-12", { avoid: ["back"] }),
  ex("h-glute-bridge", "Kettlebell glute bridge", "home", ["glute", "bodyPosterior"], "2 x 10-15", { avoid: ["back", "hip"] }),
  ex("h-calf", "Single-leg calf raise", "home", ["calves", "bodyUnilateral"], "2 x 12-20 each side", { avoid: ["ankle"] }),
  ex("h-tgu", "Turkish get-up", "home", ["kbCore", "kbMobility", "mobilityCore"], "2 controlled reps each side", { format: "reps", avoid: ["shoulder", "wrist", "back", "hip", "knee"] }),
  ex("h-suitcase", "Kettlebell suitcase carry", "home", ["carry", "kbCarry", "core"], "2 rounds each side", { format: "rounds", priority: 4, avoid: ["wrist", "back"] }),
  ex("h-front-rack-carry", "Double-kettlebell front-rack carry", "home", ["carry", "kbCarry", "core"], "3 x 30-40 sec", { format: "time", demand: "high", avoid: ["wrist", "back"] }),
  ex("h-mace", "Mace 360s", "home", ["mobility", "mobilityShoulder", "shoulderHealth"], "3 x 8 each direction", { format: "rounds", avoid: ["shoulder", "elbow", "wrist"] }),
  ex("h-complex", "Double-kettlebell clean, squat and press complex", "home", ["kbComplex", "kbPower", "kbKnee", "kbPush"], "4 rounds: 3 cleans + 3 squats + 3 presses", { format: "rounds", demand: "high", avoid: ["shoulder", "elbow", "wrist", "back", "hip", "knee"] }),

  // Bodyweight works at home, in a hotel, or with no equipment.
  multi("b-pushup", "Push-up", ["home", "hotel", "bodyweight"], ["bodyPush", "chest"], "2 x 8-20", { priority: 4, avoid: ["shoulder", "wrist"] }),
  multi("b-close-pushup", "Close-grip push-up", ["home", "hotel", "bodyweight"], ["bodyPush", "triceps"], "2 x 8-15", { avoid: ["shoulder", "elbow", "wrist"] }),
  multi("b-pike", "Pike push-up", ["home", "hotel", "bodyweight"], ["bodyPush", "shoulderPress"], "2 x 6-12", { demand: "high", avoid: ["shoulder", "wrist"] }),
  multi("b-towel-row", "Towel isometric row", ["hotel", "bodyweight"], ["bodyPull", "horizontalPull"], "2 x 30-40 sec", { format: "time", avoid: ["elbow", "wrist"] }),
  multi("b-prone-pull", "Prone lat pull-down", ["hotel", "bodyweight"], ["bodyPull", "shoulderHealth"], "2 x 10-15", { stable: true, avoid: ["shoulder"] }),
  multi("b-squat", "Tempo bodyweight squat", ["home", "hotel", "bodyweight"], ["bodyKnee", "knee"], "2 x 12-20", { priority: 3, avoid: ["knee", "hip", "ankle"] }),
  multi("b-split", "Rear-foot-supported split squat", ["home", "hotel", "bodyweight"], ["bodyUnilateral", "bodyKnee", "unilateral"], "2 x 8-15 each side", { demand: "high", avoid: ["knee", "hip", "ankle"] }),
  multi("b-reverse-lunge", "Reverse lunge", ["home", "hotel", "bodyweight"], ["bodyUnilateral", "bodyKnee", "unilateral"], "2 x 10-15 each side", { avoid: ["knee", "hip", "ankle"] }),
  multi("b-bridge", "Single-leg glute bridge", ["home", "hotel", "bodyweight"], ["bodyPosterior", "glute"], "2 x 10-15 each side", { avoid: ["back", "hip"] }),
  multi("b-ham-walk", "Hamstring walkout", ["home", "hotel", "bodyweight"], ["bodyPosterior", "hamstring"], "2 x 8-12", { priority: 3, avoid: ["back"] }),
  multi("b-calf", "Single-leg calf raise", ["home", "hotel", "bodyweight"], ["bodyUnilateral", "calves"], "2 x 12-20 each side", { avoid: ["ankle"] }),
  multi("b-side-plank", "Side plank", ["home", "hotel", "bodyweight"], ["bodyCore", "core", "mobilityCore"], "2 x 25-40 sec each side", { format: "time", avoid: ["shoulder"] }),
  multi("b-dead-bug", "Dead bug", ["home", "hotel", "bodyweight", "kongs"], ["bodyCore", "core", "mobilityCore"], "2 x 6-10 each side", { stable: true }),
  multi("b-bear", "Bear crawl", ["home", "hotel", "bodyweight"], ["bodyCore", "bodyMobility", "core"], "3 x 20-30 sec", { format: "time", avoid: ["shoulder", "wrist", "knee"] }),
  multi("b-flow", "Squat-to-stand flow", ["home", "hotel", "bodyweight", "kongs"], ["bodyMobility", "mobilityFlow", "mobilityHip"], "2 x 6 slow reps", { format: "reps", avoid: ["knee", "hip", "back"] }),

  // Simple hotel equipment options.
  hotel("t-db-bench", "Dumbbell bench press", ["dumbbells", "bench"], ["chest"], "2 x 6-10", { demand: "high", avoid: ["shoulder", "elbow", "wrist"] }),
  hotel("t-db-floor", "Dumbbell floor press", ["dumbbells"], ["chest"], "2 x 8-12", { cue: "Use a neutral grip.", avoid: ["shoulder", "elbow", "wrist"] }),
  hotel("t-db-press", "Seated dumbbell shoulder press", ["dumbbells", "bench"], ["shoulderPress"], "2 x 8-12", { avoid: ["shoulder", "elbow"] }),
  hotel("t-cable-row", "Seated cable row", ["cable"], ["horizontalPull"], "2 x 8-12", { stable: true, priority: 3 }),
  hotel("t-pulldown", "Cable lat pulldown", ["cable"], ["verticalPull"], "2 x 8-12", { stable: true, avoid: ["elbow"] }),
  hotel("t-pullup", "Pull-ups", ["pullup"], ["verticalPull", "bodyPull"], "2 x 6-10", { demand: "high", avoid: ["shoulder", "elbow"] }),
  hotel("t-db-row", "Bench-supported dumbbell row", ["dumbbells", "bench"], ["horizontalPull"], "2 x 8-12 each side", { stable: true }),
  hotel("t-face-pull", "Cable face pull", ["cable"], ["rearDelt", "shoulderHealth"], "2 x 12-20", { stable: true }),
  hotel("t-db-goblet", "Goblet squat", ["dumbbells"], ["knee"], "2 x 8-12", { avoid: ["knee", "hip", "back"] }),
  hotel("t-db-rdl", "Dumbbell Romanian deadlift", ["dumbbells"], ["hinge"], "2 x 8-12", { demand: "high", avoid: ["back", "hip"] }),
  hotel("t-leg-press", "Leg press machine", ["machines"], ["knee"], "2 x 8-12", { stable: true, avoid: ["knee", "hip"] }),
  hotel("t-leg-curl", "Leg curl machine", ["machines"], ["hamstring"], "2 x 10-15", { stable: true }),
  hotel("t-suitcase", "Dumbbell suitcase carry", ["dumbbells"], ["carry", "core"], "2 rounds each side", { format: "rounds", avoid: ["wrist", "back"] }),

  // Joint-friendly mobility menu, available everywhere.
  all("m-cat-cow", "Cat-cow and pelvic tilt", ["mobilitySpine", "mobilityFlow"], "2 x 6-8 slow reps", { format: "reps", avoid: ["wrist"] }),
  all("m-open-book", "Open-book rotation", ["mobilitySpine", "mobilityFlow"], "2 x 6 each side", { format: "reps", stable: true }),
  all("m-wall-slide", "Wall slide", ["mobilityShoulder", "shoulderHealth"], "2 x 8-12", { format: "reps", avoid: ["shoulder"] }),
  all("m-scap", "Scapular circles and controlled reaches", ["mobilityShoulder", "shoulderHealth"], "2 x 40 sec", { format: "time", stable: true }),
  all("m-hip-90", "90/90 hip switches", ["mobilityHip", "mobilityFlow"], "2 x 6 each side", { format: "reps", avoid: ["hip", "knee"] }),
  all("m-hip-flexor", "Half-kneeling hip-flexor rock", ["mobilityHip"], "2 x 40 sec each side", { format: "time", avoid: ["hip", "knee"] }),
  all("m-ankle", "Supported ankle rocks", ["mobilityHip", "mobilityFlow"], "2 x 10 each side", { format: "reps", avoid: ["ankle"] }),
  all("m-bird-dog", "Bird dog", ["mobilityCore", "core"], "2 x 6 each side", { format: "reps", stable: true, avoid: ["wrist"] }),
  all("m-breath", "Crocodile breathing", ["mobilityBreathing", "mobilityFlow"], "3 minutes", { format: "time", stable: true }),
  all("m-walk", "Easy walk", ["mobilityCarry", "mobilityFlow"], "8-12 minutes", { format: "time", stable: true, avoid: ["ankle", "knee"] }),
];

function ex(id, name, location, categories, prescription, options = {}) {
  return multi(id, name, [location], categories, prescription, options);
}

function hotel(id, name, equipment, categories, prescription, options = {}) {
  return { ...multi(id, name, ["hotel"], categories, prescription, options), equipment };
}

function all(id, name, categories, prescription, options = {}) {
  return multi(id, name, ["kongs", "home", "hotel", "bodyweight"], categories, prescription, options);
}

function multi(id, name, locations, categories, prescription, options = {}) {
  return { id, name, locations, categories, prescription, equipment: [], stable: false, demand: "moderate", priority: 1, avoid: [], cue: "", format: "sets", ...options };
}

export function generateWorkout(input = {}) {
  const options = normaliseOptions(input);
  const requestedType = options.type;
  const highPainReset = options.painLevel >= 8 && painConflictsWithType(requestedType, options.painAreas);
  const unavailableKettlebell = requestedType === "kettlebell"
    && (options.location === "bodyweight" || (options.location === "hotel" && !options.hotelEquipment.includes("kettlebells")));
  const effectiveType = highPainReset ? "mobility" : unavailableKettlebell ? "bodyweight" : requestedType;
  const targetCount = exerciseCount(options.duration, options.energy, options.painLevel, effectiveType);
  const selected = [];
  const usedCategories = new Map();

  for (let index = 0; index < SLOTS[effectiveType].length && selected.length < targetCount; index += 1) {
    const categories = SLOTS[effectiveType][index];
    const candidate = chooseExercise(categories, options, selected, usedCategories, index);
    if (!candidate) continue;
    const matchedCategory = categories.find((category) => candidate.categories.includes(category)) || candidate.categories[0];
    usedCategories.set(matchedCategory, (usedCategories.get(matchedCategory) || 0) + 1);
    selected.push({ ...candidate, matchedCategory });
  }

  if (selected.length < 4) {
    const fallbacks = EXERCISES
      .filter((exercise) => isAvailable(exercise, options) && !selected.some(({ id }) => id === exercise.id))
      .filter((exercise) => !selected.some((item) => nearDuplicate(item, exercise)))
      .filter((exercise) => painScore(exercise, options) > -100)
      .sort((a, b) => scoreExercise(b, options, selected, usedCategories, 20) - scoreExercise(a, options, selected, usedCategories, 20));
    selected.push(...fallbacks.slice(0, 4 - selected.length));
  }

  const mode = recoveryMode(options, highPainReset);
  const exercises = selected.map((exercise, index) => ({
    ...exercise,
    order: index + 1,
    effort: effortFor(exercise, mode),
    cue: cueFor(exercise, options, mode),
    superset: options.duration <= 35 && exercise.format === "sets" && index >= 2 ? String.fromCharCode(65 + Math.floor((index - 2) / 2)) : "",
  }));

  return {
    requestedType,
    type: effectiveType,
    typeLabel: highPainReset ? `Pain-aware ${TYPE_LABELS[requestedType]}` : unavailableKettlebell ? "Bodyweight fallback" : TYPE_LABELS[requestedType],
    location: options.location,
    locationLabel: options.location === "hotel" ? (options.hotelEquipment.length ? "Hotel gym" : "Hotel — bodyweight") : LOCATION_LABELS[options.location],
    duration: options.duration,
    energy: options.energy,
    painLevel: options.painLevel,
    painAreas: options.painAreas,
    mode,
    warmup: buildWarmup(options, effectiveType),
    exercises,
    notes: buildNotes(options, mode, highPainReset, unavailableKettlebell),
    generatedAt: new Date().toISOString(),
  };
}

function normaliseOptions(input) {
  const type = TYPE_LABELS[input.type] ? input.type : "upper";
  const location = LOCATION_LABELS[input.location] ? input.location : "kongs";
  return {
    type,
    location,
    duration: clamp(Number(input.duration) || 40, 20, 60),
    energy: clamp(Number(input.energy) || 7, 1, 10),
    painLevel: clamp(Number(input.painLevel) || 0, 0, 10),
    painAreas: [...new Set(Array.isArray(input.painAreas) ? input.painAreas : [])].filter((area) => PAIN_LABELS[area]),
    hardActivity: Boolean(input.hardActivity),
    hotelEquipment: Array.isArray(input.hotelEquipment) ? input.hotelEquipment : [],
    notes: String(input.notes || "").trim().slice(0, 180),
    variation: Number(input.variation) || 0,
  };
}

function chooseExercise(categories, options, selected, usedCategories, slotIndex) {
  return EXERCISES
    .filter((exercise) => isAvailable(exercise, options))
    .filter((exercise) => categories.some((category) => exercise.categories.includes(category)))
    .filter((exercise) => !selected.some(({ id }) => id === exercise.id))
    .filter((exercise) => !selected.some((item) => nearDuplicate(item, exercise)))
    .filter((exercise) => painScore(exercise, options) > -100)
    .sort((a, b) => scoreExercise(b, options, selected, usedCategories, slotIndex) - scoreExercise(a, options, selected, usedCategories, slotIndex))[0] || null;
}

function isAvailable(exercise, options) {
  const bodyweightAnywhere = options.type === "bodyweight" && exercise.id.startsWith("b-");
  const kettlebellElsewhere = options.type === "kettlebell"
    && exercise.categories.some((category) => category.startsWith("kb"))
    && (options.location === "kongs" || (options.location === "hotel" && options.hotelEquipment.includes("kettlebells")));
  if (!exercise.locations.includes(options.location) && !bodyweightAnywhere && !kettlebellElsewhere) return false;
  if (options.location !== "hotel" || exercise.equipment.length === 0) return true;
  return exercise.equipment.every((item) => options.hotelEquipment.includes(item));
}

function scoreExercise(exercise, options, selected, usedCategories, slotIndex) {
  let score = exercise.priority * 12 + painScore(exercise, options);
  if (options.energy <= 4) {
    if (exercise.stable) score += 30;
    if (exercise.demand === "high") score -= 35;
  } else if (options.energy <= 6) {
    if (exercise.stable) score += 12;
    if (exercise.demand === "high") score -= 10;
  } else if (exercise.demand === "high") score += 8;
  if (options.hardActivity && exercise.categories.some((category) => ["knee", "hinge", "unilateral", "kbPower", "power"].includes(category))) score -= exercise.stable ? 8 : 22;
  exercise.categories.forEach((category) => { score -= (usedCategories.get(category) || 0) * 18; });
  if (selected.some((item) => item.categories.some((category) => exercise.categories.includes(category)))) score -= 8;
  return score + seededNoise(`${options.type}:${options.location}:${options.variation}:${slotIndex}:${exercise.id}`) * 18;
}

function painScore(exercise, options) {
  if (!options.painLevel || !options.painAreas.length) return 0;
  const conflict = exercise.avoid.some((area) => options.painAreas.includes(area));
  if (!conflict) return exercise.stable ? Math.min(20, options.painLevel * 2) : 0;
  return options.painLevel >= 6 ? -200 : -(options.painLevel * 16);
}

function painConflictsWithType(type, painAreas) {
  const map = {
    push: ["shoulder", "elbow", "wrist"], pull: ["shoulder", "elbow", "wrist", "back"],
    legs: ["back", "hip", "knee", "ankle"], upper: ["shoulder", "elbow", "wrist", "back"],
    lower: ["back", "hip", "knee", "ankle"], full: ["shoulder", "elbow", "wrist", "back", "hip", "knee", "ankle"],
    bodyweight: ["shoulder", "wrist", "back", "hip", "knee", "ankle"],
    kettlebell: ["shoulder", "elbow", "wrist", "back", "hip", "knee"],
    mixed: ["shoulder", "elbow", "wrist", "back", "hip", "knee", "ankle"], mobility: [],
  };
  return painAreas.some((area) => (map[type] || map.full).includes(area));
}

function exerciseCount(duration, energy, painLevel, type) {
  if (type === "mobility") return duration <= 30 ? 4 : duration <= 45 ? 5 : 6;
  let count = duration <= 25 ? 4 : duration <= 35 ? 5 : duration <= 50 ? 6 : 7;
  if (energy <= 4 || painLevel >= 6) count -= 1;
  return clamp(count, 4, 7);
}

function recoveryMode(options, highPainReset) {
  if (highPainReset) return "reset";
  if (options.painLevel >= 6) return "pain-aware";
  if (options.energy <= 4 || (options.energy <= 6 && options.hardActivity)) return "lighter";
  return "normal";
}

function effortFor(exercise, mode) {
  if (exercise.format !== "sets") return "Keep every rep crisp and comfortable.";
  if (mode === "normal") return exercise.demand === "high" ? "Set 1: 1-2 RIR. Set 2: match or controlled back-off." : "Both sets: 1-3 RIR.";
  if (mode === "lighter") return "Both sets: about 3 RIR; no grinding.";
  return "Use a comfortable range only; stop before symptoms increase.";
}

function cueFor(exercise, options, mode) {
  const cues = [];
  if (exercise.cue) cues.push(exercise.cue);
  if (mode === "pain-aware" && exercise.stable) cues.push("Use the most comfortable setup and range today.");
  if (options.energy <= 4 && exercise.format === "sets") cues.push("Reduce load if rep speed or technique drops.");
  return cues.join(" ");
}

function buildWarmup(options, type) {
  const minutes = options.duration <= 30 ? 5 : 7;
  if (type === "mobility") return `Easy walk or breathing — ${Math.min(5, minutes)} min`;
  if (options.location === "home") {
    if (["legs", "lower"].includes(type)) {
      if (options.painAreas.some((area) => ["back", "hip", "knee"].includes(area))) return `Gentle joint circles + pain-free hinge rehearsal — ${minutes} min`;
      return `Light swings + squat and hinge rehearsal — ${minutes} min`;
    }
    if (options.painAreas.includes("back") || options.painAreas.includes("hip")) return `Easy bodyweight movement + band shoulder work — ${minutes} min`;
    return `Light swings + mace 360s + easy pattern rehearsal — ${minutes} min`;
  }
  if (options.location === "bodyweight" || (options.location === "hotel" && options.hotelEquipment.length === 0)) return `Easy walk + joint circles + movement rehearsal — ${minutes} min`;
  return `Easy cardio + 1-2 ramp-up sets for the first movement — ${minutes} min`;
}

function buildNotes(options, mode, highPainReset, unavailableKettlebell) {
  const notes = [];
  if (highPainReset) notes.push("Pain is high in an area this session would load, so today is a mobility reset rather than a hard training session.");
  else if (mode === "pain-aware") notes.push("Pain-aware session: joint-friendly choices, controlled range and no forced reps.");
  else if (mode === "lighter") notes.push("Lower-readiness session: useful work with stable choices and lower fatigue.");
  else notes.push("Two quality working sets per strength movement; warm-up sets do not count.");
  if (unavailableKettlebell) notes.push("No kettlebells were available at this location, so the session automatically switched to bodyweight.");
  if (options.hardActivity) notes.push("Recent sport noted: keep lower-body loading honest and avoid chasing fatigue.");
  if (options.painAreas.length) notes.push(`Areas flagged: ${options.painAreas.map((area) => PAIN_LABELS[area]).join(", ")}.`);
  if (options.notes) notes.push(`Your note: ${options.notes}`);
  if (options.painLevel >= 7) notes.push("Stop if pain is sharp, worsening or changes normal movement; seek clinical advice when appropriate.");
  return notes;
}

function seededNoise(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4_294_967_295;
}

function nearDuplicate(first, second) {
  const families = [
    "glute bridge", "leg press", "lat pulldown", "cable row", "chest press",
    "lateral raise", "hamstring curl", "push-up", "split squat", "suitcase carry",
  ];
  const a = first.name.toLowerCase();
  const b = second.name.toLowerCase();
  return families.some((family) => a.includes(family) && b.includes(family));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function workoutToText(workout) {
  const lines = [
    `${workout.typeLabel} — ${workout.locationLabel} — ${workout.duration} min`,
    `Energy ${workout.energy}/10${workout.painLevel ? ` · Pain ${workout.painLevel}/10` : ""}`,
    "", `Warm-up: ${workout.warmup}`, "",
  ];
  let lastSuperset = "";
  workout.exercises.forEach((exercise) => {
    if (exercise.superset && exercise.superset !== lastSuperset) lines.push(`Superset ${exercise.superset}`);
    lines.push(`${exercise.order}. ${exercise.name} — ${exercise.prescription}`);
    if (exercise.cue) lines.push(`   ${exercise.cue}`);
    lastSuperset = exercise.superset;
  });
  lines.push("", ...workout.notes);
  return lines.join("\n");
}
