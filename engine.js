import { EXERCISES, EXERCISE_BY_ID } from "./exercise-library.js";

export const SESSION_TYPES = [
  ["push", "Push"], ["pull", "Pull"], ["legs", "Legs"], ["upper", "Upper"],
  ["full", "Full Body"], ["bodyweight", "Bodyweight"], ["kettlebell", "Kettlebell"], ["mobility", "Mobility"],
].map(([id, label]) => ({ id, label }));
export const LOCATIONS = [
  ["kongs", "Kongs"], ["home", "Home / garage"], ["hotel", "Hotel"], ["bodyweight", "No equipment"],
].map(([id, label]) => ({ id, label }));
export const DURATIONS = [20, 30, 40, 50, 60];
export const READINESS_LEVELS = [
  { id: "low", label: "Low", description: "Controlled & steady" },
  { id: "medium", label: "Medium", description: "Normal training" },
  { id: "high", label: "High", description: "Good to push" },
];
export const PAIN_AREAS = [
  ["shoulder", "Shoulder"], ["elbow", "Elbow"], ["wrist", "Wrist / hand"], ["back", "Lower back"],
  ["hip", "Hip"], ["knee", "Knee"], ["ankle", "Ankle / foot"], ["general", "General soreness"],
].map(([id, label]) => ({ id, label }));

const TYPE_LABELS = Object.fromEntries(SESSION_TYPES.map(({ id, label }) => [id, label]));
const LOCATION_LABELS = Object.fromEntries(LOCATIONS.map(({ id, label }) => [id, label]));
const PAIN_LABELS = Object.fromEntries(PAIN_AREAS.map(({ id, label }) => [id, label]));
const VALID_READINESS = new Set(READINESS_LEVELS.map(({ id }) => id));
const required = (pattern, label = pattern) => ({ pattern, label, required: true });
const optional = (pattern, label = pattern) => ({ pattern, label, required: false });

export function sessionContract(type, duration) {
  const long = duration > 30;
  const comprehensive = duration >= 60;
  const contracts = {
    push: [required("chest", "chest"), required("shoulderPress", "shoulder press"), required("triceps", "triceps"), ...(duration >= 30 ? [optional("lateralDelt", "lateral delts")] : [])],
    pull: [required("verticalPull", "vertical pull"), required("horizontalPull", "horizontal row"), required("biceps", "biceps"), required("rearDelt", "rear delts / shoulder health")],
    legs: [required("squat", "squat pattern"), required("unilateral", "lunge / unilateral"), required("quadIsolation", "direct quads"), required("hamstring", "hamstrings"), ...(long ? [optional("lowerAccessory", "rotating lower accessory")] : [])],
    upper: [required("chest", "chest press"), required("shoulderPress", "shoulder press"), required("verticalPull", "vertical pull"), required("horizontalPull", "horizontal row"), ...(long ? [required("biceps", "biceps"), required("triceps", "triceps"), required("rearDelt", "rear delts / shoulder health")] : []), ...(comprehensive ? [optional("lateralDelt", "lateral delts")] : [])],
    full: [required("unilateral", "lower / lunge"), required("chest", "chest press"), required("shoulderPress", "shoulder press"), required("verticalPull", "vertical pull"), required("horizontalPull", "horizontal row"), required("biceps", "biceps"), required("triceps", "triceps"), ...(long ? [optional("lowerAccessory", "rotating lower accessory")] : [])],
    bodyweight: [required("chest", "push"), optional("verticalPull", "pull"), required("squat", "squat"), required("unilateral", "lunge"), required("hamstring", "posterior chain"), required("core", "trunk")],
    kettlebell: [required("kbComplex", "athletic complex"), required("squat", "squat"), required("chest", "press"), required("horizontalPull", "row"), required("core", "trunk")],
    mobility: [required("mobilitySpine", "spine"), required("mobilityShoulder", "shoulders"), required("mobilityHip", "hips"), required("mobilityAnkle", "ankles"), required("mobilityCore", "trunk"), ...(duration >= 30 ? [optional("breathing", "breathing")] : [])],
  };
  return contracts[type] || contracts.upper;
}

export function generateWorkout(input = {}) {
  const options = normaliseOptions(input);
  const contract = sessionContract(options.type, options.duration).map((slot) => slot.pattern === "lowerAccessory"
    ? { ...slot, pattern: chooseLowerAccessory(options.history, options.variation) }
    : slot);
  const selected = [];
  const omissions = [];
  const recentFamilies = recentComparableFamilies(options.history, options.type);

  contract.forEach((slot, slotIndex) => {
    const candidate = chooseCandidate(slot.pattern, options, selected, recentFamilies, slotIndex);
    if (!candidate) {
      if (slot.required || shouldExplainOptional(slot, options)) omissions.push(omissionFor(slot, options));
      return;
    }
    selected.push(toWorkoutExercise(candidate, slot, options, recentFamilies));
  });

  const exercises = groupExercises(selected, options);
  const mode = options.painLevel > 0 || options.painAreas.length ? "adapted" : options.readiness;
  return {
    id: `workout-${Date.now()}-${Math.floor(seededNoise(`${options.type}:${options.variation}`) * 1e6)}`,
    requestedType: options.type,
    type: options.type,
    typeLabel: TYPE_LABELS[options.type],
    location: options.location,
    locationLabel: options.location === "hotel" && options.hotelEquipment.length ? "Hotel gym" : LOCATION_LABELS[options.location],
    duration: options.duration,
    readiness: options.readiness,
    painLevel: options.painLevel,
    painAreas: options.painAreas,
    restrictions: options.restrictions,
    mode,
    format: options.duration === 20 ? "circuit" : "sets",
    warmup: buildWarmup(options),
    exercises,
    omissions,
    notes: buildNotes(options, omissions),
    generatedAt: new Date().toISOString(),
  };
}

function chooseLowerAccessory(history, variation) {
  const candidates = ["calves", "adductors", "abductors"];
  const order = Object.fromEntries(candidates.map((pattern, index) => [pattern, (index + variation) % 3]));
  const counts = Object.fromEntries(candidates.map((pattern) => [pattern, 0]));
  history.slice(0, 8).forEach((entry, recency) => {
    const covered = entry.patterns || (entry.actualExercises || []).flatMap((item) => EXERCISE_BY_ID.get(typeof item === "string" ? item : item.id)?.patterns || []);
    candidates.forEach((pattern) => { if (covered.includes(pattern)) counts[pattern] += 8 - recency; });
  });
  return candidates.sort((a, b) => counts[a] - counts[b] || order[a] - order[b])[0];
}

export function swapExercise(workout, exerciseId, input = {}) {
  const current = workout.exercises.find((item) => item.id === exerciseId);
  if (!current) return workout;
  const options = normaliseOptions({ ...workout, ...input, type: workout.requestedType || workout.type, variation: (input.variation || 0) + 1 });
  const selected = workout.exercises.filter((item) => item.id !== exerciseId);
  const recentFamilies = recentComparableFamilies(options.history, options.type);
  const candidates = rankedCandidates(current.slotPattern, options, selected, recentFamilies, 99).filter((item) => item.id !== current.id);
  if (!candidates.length) return workout;
  const replacement = toWorkoutExercise(candidates[0], { pattern: current.slotPattern, label: current.slotLabel, required: true }, options, recentFamilies);
  replacement.order = current.order;
  replacement.group = current.group;
  replacement.swappedFrom = current.id;
  return { ...workout, exercises: workout.exercises.map((item) => item.id === exerciseId ? replacement : item) };
}

export function validateWorkout(workout) {
  const errors = [];
  const ids = workout.exercises.map(({ id }) => id);
  if (new Set(ids).size !== ids.length) errors.push("duplicate exercise");
  if (workout.exercises.some((item) => /barbell.*press|underhand.*pulldown|straight.bar.*curl|carry/i.test(item.name))) errors.push("permanent restriction violation");
  const covered = new Set(workout.exercises.flatMap(({ patterns }) => patterns));
  sessionContract(workout.type, workout.duration).filter((slot) => slot.required).forEach((slot) => {
    if (!covered.has(slot.pattern) && !workout.omissions.some((item) => item.pattern === slot.pattern)) errors.push(`unexplained missing pattern: ${slot.pattern}`);
  });
  return { valid: errors.length === 0, errors };
}

function normaliseOptions(input) {
  const type = TYPE_LABELS[input.type] ? input.type : "upper";
  const location = LOCATION_LABELS[input.location] ? input.location : "kongs";
  const duration = DURATIONS.includes(Number(input.duration)) ? Number(input.duration) : 40;
  const readiness = VALID_READINESS.has(input.readiness) ? input.readiness : "medium";
  const painAreas = [...new Set(Array.isArray(input.painAreas) ? input.painAreas : [])].filter((area) => PAIN_LABELS[area]);
  const restrictions = [...new Set(Array.isArray(input.restrictions) ? input.restrictions : [])];
  return {
    type, location, duration, readiness, painAreas, restrictions,
    painLevel: Math.max(0, Math.min(3, Number(input.painLevel) || 0)),
    hotelEquipment: Array.isArray(input.hotelEquipment) ? input.hotelEquipment : [],
    history: Array.isArray(input.history) ? input.history : [],
    variation: Number(input.variation) || 0,
  };
}

function chooseCandidate(pattern, options, selected, recentFamilies, slotIndex) {
  return rankedCandidates(pattern, options, selected, recentFamilies, slotIndex)[0] || null;
}

function rankedCandidates(pattern, options, selected, recentFamilies, slotIndex) {
  return EXERCISES
    .filter((item) => item.patterns.includes(pattern))
    .filter((item) => isAvailable(item, options))
    .filter((item) => !selected.some(({ id }) => id === item.id))
    .filter((item) => !hasConflict(item, options))
    .sort((a, b) => score(b, options, recentFamilies, slotIndex) - score(a, options, recentFamilies, slotIndex));
}

function isAvailable(item, options) {
  if (!item.locations.includes(options.location)) return false;
  if (options.type === "bodyweight") {
    const approvedBodyweightEquipment = ["h-pullup", "h-ring-row", "h-ring-pushup", "h-parallette-pushup", "t-pullup"];
    if (!item.id.startsWith("b-") && !approvedBodyweightEquipment.includes(item.id)) return false;
  }
  if (options.location !== "hotel") return true;
  return item.equipment.every((requirement) => options.hotelEquipment.includes(requirement));
}

function hasConflict(item, options) {
  const mappedRestrictions = { avoidOverhead: "shoulder", avoidGrip: "elbow", avoidHipLoad: "hip", avoidBackLoad: "back" };
  const active = new Set([...options.painAreas, ...options.restrictions.map((item) => mappedRestrictions[item]).filter(Boolean)]);
  if (!active.size || active.has("general")) return false;
  return item.conflicts.some((area) => active.has(area));
}

function score(item, options, recentFamilies, slotIndex) {
  let value = 100;
  if (options.readiness === "low") {
    if (item.stable) value += 35;
    if (item.demand === "high") value -= 28;
  }
  if (options.readiness === "high" && item.demand === "high") value += 18;
  if (options.readiness === "medium" && item.stable) value += 6;
  if (recentFamilies.has(item.family)) value -= 65;
  if (item.id.includes("neutral") || item.name.toLowerCase().includes("neutral-grip")) value += 8;
  if (item.id === "k-dip") value += 8;
  if (item.id === "k-rdl-machine") value += 5;
  return value + seededNoise(`${options.type}:${options.location}:${options.duration}:${options.variation}:${slotIndex}:${item.id}`) * 12;
}

function recentComparableFamilies(history, type) {
  const last = history.find((entry) => (entry.actualType || entry.type || entry.plannedType) === type);
  const exercises = last?.actualExercises || last?.exercises || [];
  return new Set(exercises.map((item) => EXERCISE_BY_ID.get(typeof item === "string" ? item : item.id)?.family).filter(Boolean));
}

function toWorkoutExercise(item, slot, options, recentFamilies) {
  const reasons = [];
  if (options.readiness === "low" && item.stable) reasons.push("Stable, controlled choice for lower readiness.");
  else if (options.readiness === "high" && item.demand === "high") reasons.push("A strong primary choice while readiness is high.");
  if (recentFamilies.size && !recentFamilies.has(item.family) && item.role === "primary") reasons.push("Rotated from your last comparable session.");
  if (item.id === "k-rdl-machine") reasons.push("Included to build familiarity with the RDL machine.");
  return { ...item, slotPattern: slot.pattern, slotLabel: slot.label, reason: reasons[0] || "", order: 0, group: "" };
}

function groupExercises(exercises, options) {
  const circuit = options.duration === 20;
  let accessoryGroup = 0;
  return exercises.map((item, index) => {
    let group = "";
    if (circuit) group = "Circuit · 2 rounds";
    else if (item.role === "accessory") {
      group = `Finisher ${String.fromCharCode(65 + Math.floor(accessoryGroup / 2))}`;
      accessoryGroup += 1;
    }
    return { ...item, order: index + 1, group };
  });
}

function shouldExplainOptional(slot, options) {
  return ["verticalPull", "horizontalPull"].includes(slot.pattern) && ["hotel", "bodyweight"].includes(options.location);
}

function omissionFor(slot, options) {
  let reason = `No safe ${slot.label} matched today's setup.`;
  if (["verticalPull", "horizontalPull"].includes(slot.pattern) && options.location === "bodyweight") reason = "Pulling omitted: no bar, rings or anchor are available with no equipment.";
  else if (["verticalPull", "horizontalPull"].includes(slot.pattern) && options.location === "hotel") reason = "Pulling omitted: the selected hotel equipment has no suitable bar, cable or supported row option.";
  return { pattern: slot.pattern, label: slot.label, reason };
}

function buildWarmup(options) {
  const minutes = options.duration <= 30 ? 5 : 7;
  if (options.type === "mobility") return `${minutes} min · easy joint circles and relaxed full-body movement`;
  if (["kongs", "home"].includes(options.location)) return `${minutes} min · light halos, Turkish get-up practice and crisp kettlebell swings`;
  return `${minutes} min · bodyweight squats, reverse lunges, scapular circles and easy movement rehearsal`;
}

function buildNotes(options, omissions) {
  const notes = [];
  if (options.readiness === "low") notes.push("Coverage is unchanged; today favours controlled, mentally easier choices.");
  if (options.painAreas.length || options.restrictions.length) notes.push("Today's adjustments use symptom-aware substitutions. Keep every range comfortable and stop if symptoms increase.");
  notes.push(...omissions.map(({ reason }) => reason));
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
