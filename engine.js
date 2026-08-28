import { EXERCISES, EXERCISE_BY_ID } from "./exercise-library.js";
import { buildCircuitExercises, circuitStructure, selectKettlebellCircuit } from "./kettlebell-circuits.js";

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
const PREFERENCE_BONUS = { favourite: 8, like: 4, neutral: 0, avoid: -18 };
const required = (pattern, label = pattern) => ({ pattern, label, required: true });
const optional = (pattern, label = pattern) => ({ pattern, label, required: false });

export function sessionContract(type, duration) {
  const long = duration > 30;
  const comprehensive = duration >= 60;
  const lowerAccessories = duration >= 60
    ? [optional("calves", "calves"), optional("adductors", "adductors"), optional("abductors", "abductors")]
    : duration >= 50
      ? [optional("lowerAccessory1", "rotating lower accessory"), optional("lowerAccessory2", "rotating lower accessory")]
      : duration >= 40 ? [optional("lowerAccessory1", "rotating lower accessory")] : [];
  const pushSlots = [
    required("chest", "primary chest"),
    required("shoulderPress", "shoulder press"),
    required("triceps", "triceps"),
    required("lateralDelt", "lateral delts"),
    ...(duration >= 40 ? [required("chest", "secondary chest")] : []),
    ...(duration >= 50 ? [required("triceps", "secondary triceps")] : []),
    ...(duration >= 60 ? [required("chest", "chest pump finisher")] : []),
  ];
  const pullSlots = [
    required("verticalPull", "vertical pull"),
    required("horizontalPull", "horizontal row"),
    required("biceps", "biceps"),
    required("rearDelt", "rear delts / shoulder health"),
    ...(duration >= 40 ? [required("horizontalPull", "secondary row")] : []),
    ...(duration >= 50 ? [required("biceps", "secondary biceps")] : []),
    ...(duration >= 60 ? [required("verticalPull", "secondary vertical pull")] : []),
  ];
  const contracts = {
    push: pushSlots,
    pull: pullSlots,
    legs: [required("squat", "squat pattern"), required("unilateral", "lunge / unilateral"), required("quadIsolation", "direct quads"), required("hamstring", "hamstrings"), ...lowerAccessories],
    upper: [required("chest", "chest press"), required("shoulderPress", "shoulder press"), required("verticalPull", "vertical pull"), required("horizontalPull", "horizontal row"), ...(long ? [required("biceps", "biceps"), required("triceps", "triceps"), required("rearDelt", "rear delts / shoulder health")] : []), ...(comprehensive ? [optional("lateralDelt", "lateral delts")] : [])],
    full: [required("unilateral", "lower / lunge"), required("chest", "chest press"), required("shoulderPress", "shoulder press"), required("verticalPull", "vertical pull"), required("horizontalPull", "horizontal row"), required("biceps", "biceps"), required("triceps", "triceps"), ...lowerAccessories],
    bodyweight: [required("chest", "push"), optional("verticalPull", "vertical pull"), required("squat", "squat"), required("unilateral", "lunge"), required("hamstring", "posterior chain"), required("core", "trunk"), ...(duration >= 40 ? [optional("horizontalPull", "horizontal row")] : []), ...(duration >= 50 ? [optional("calves", "calves")] : []), ...(duration >= 60 ? [optional("adductors", "adductors"), optional("abductors", "abductors")] : [])],
    kettlebell: [required("kbComplex", "athletic complex"), required("squat", "squat"), required("chest", "press"), required("horizontalPull", "row"), required("core", "trunk"), ...(duration >= 40 ? [required("unilateral", "single-leg work")] : []), ...(duration >= 50 ? [required("kbPower", "power / swings")] : []), ...(duration >= 60 ? [required("kbMobility", "get-up / athletic mobility")] : [])],
    mobility: [required("mobilitySpine", "spine"), required("mobilityShoulder", "shoulders"), required("mobilityHip", "hips"), required("mobilityAnkle", "ankles"), required("mobilityCore", "trunk"), ...(duration >= 30 ? [optional("breathing", "breathing")] : []), ...(duration >= 40 ? [optional("walking", "easy walk")] : []), ...(duration >= 50 ? [optional("mobilitySpine", "second spine movement")] : []), ...(duration >= 60 ? [optional("mobilityShoulder", "second shoulder movement")] : [])],
  };
  return contracts[type] || contracts.upper;
}

export function generateWorkout(input = {}) {
  const options = normaliseOptions(input);
  const specificAdjustments = [...activeAreas(options)].filter((area) => area !== "general");
  if (options.type === "kettlebell" && options.location === "home" && hasKettlebellAccess(options) && specificAdjustments.length === 0) {
    return generateNamedKettlebellWorkout(options);
  }
  const lowerAccessoryOrder = chooseLowerAccessories(options.history, options.variation);
  const contract = sessionContract(options.type, options.duration).map((slot) => {
    if (slot.pattern === "lowerAccessory1") return { ...slot, pattern: lowerAccessoryOrder[0] };
    if (slot.pattern === "lowerAccessory2") return { ...slot, pattern: lowerAccessoryOrder[1] };
    return slot;
  });
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
    availability: exercises.length ? "ready" : "unavailable",
    unavailableReason: exercises.length ? "" : unavailableWorkoutReason(options),
    notes: buildNotes(options, omissions),
    generatedAt: new Date().toISOString(),
  };
}

function generateNamedKettlebellWorkout(options) {
  const selectionOptions = options.painLevel > 0 || options.painAreas.includes("general")
    ? { ...options, readiness: "low" }
    : options;
  const circuit = selectKettlebellCircuit(selectionOptions);
  const exercises = circuit ? buildCircuitExercises(circuit, options.duration) : [];
  const mode = options.painLevel > 0 || options.painAreas.length ? "adapted" : options.readiness;
  const notes = buildNotes(options, []);
  if (circuit) notes.push("Selected as one complete circuit from workouts you have already performed. Regenerate to rotate the whole circuit.");
  return {
    id: `workout-${Date.now()}-${Math.floor(seededNoise(`${options.type}:${options.variation}:${circuit?.id || "none"}`) * 1e6)}`,
    requestedType: options.type,
    type: options.type,
    typeLabel: TYPE_LABELS[options.type],
    circuitId: circuit?.id || "",
    circuitName: circuit?.name || "",
    circuitCategory: circuit?.category || "",
    circuitEquipment: circuit?.equipment || "",
    circuitStructure: circuit ? circuitStructure(circuit, options.duration) : "",
    location: options.location,
    locationLabel: LOCATION_LABELS[options.location],
    duration: options.duration,
    readiness: options.readiness,
    painLevel: options.painLevel,
    painAreas: options.painAreas,
    restrictions: options.restrictions,
    mode,
    format: "named-circuit",
    warmup: circuit?.warmup || buildWarmup(options),
    exercises,
    omissions: [],
    availability: exercises.length ? "ready" : "unavailable",
    unavailableReason: exercises.length ? "" : unavailableWorkoutReason(options),
    notes: [...new Set(notes)],
    generatedAt: new Date().toISOString(),
  };
}

function chooseLowerAccessories(history, variation) {
  const candidates = ["calves", "adductors", "abductors"];
  const order = Object.fromEntries(candidates.map((pattern, index) => [pattern, (index + variation) % 3]));
  const counts = Object.fromEntries(candidates.map((pattern) => [pattern, 0]));
  history.slice(0, 8).forEach((entry, recency) => {
    const covered = entry.patterns || (entry.actualExercises || []).flatMap((item) => EXERCISE_BY_ID.get(typeof item === "string" ? item : item.id)?.patterns || []);
    candidates.forEach((pattern) => { if (covered.includes(pattern)) counts[pattern] += 8 - recency; });
  });
  return candidates.sort((a, b) => counts[a] - counts[b] || order[a] - order[b]);
}

export function swapExercise(workout, exerciseId, input = {}) {
  if (workout.circuitId) return workout;
  const current = workout.exercises.find((item) => item.id === exerciseId);
  if (!current) return workout;
  const options = normaliseOptions({ ...workout, ...input, type: workout.requestedType || workout.type, variation: (input.variation || 0) + 1 });
  const selected = workout.exercises.filter((item) => item.id !== exerciseId);
  const recentFamilies = recentComparableFamilies(options.history, options.type);
  const candidates = rankedCandidates(current.slotPattern, options, selected, recentFamilies, 99).filter((item) => item.id !== current.id);
  if (!candidates.length) return workout;
  const candidate = candidates.find((item) => !selected.some((chosen) => chosen.family === item.family)) || candidates[0];
  const replacement = toWorkoutExercise(candidate, { pattern: current.slotPattern, label: current.slotLabel, required: true }, options, recentFamilies);
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
  if (workout.circuitId) {
    if (!workout.circuitName) errors.push("named circuit missing name");
    if (!["squat", "unilateral", "hinge", "kbPower", "kbMobility"].some((pattern) => covered.has(pattern))) errors.push("named circuit missing lower-body pattern");
    if (!["chest", "shoulderPress", "horizontalPull", "verticalPull", "core"].some((pattern) => covered.has(pattern))) errors.push("named circuit missing upper-body or trunk pattern");
    if (workout.exercises.some((item) => item.swappable !== false)) errors.push("named circuit contains swappable movement");
  } else {
    sessionContract(workout.type, workout.duration).filter((slot) => slot.required).forEach((slot) => {
      if (!covered.has(slot.pattern) && !workout.omissions.some((item) => item.pattern === slot.pattern)) errors.push(`unexplained missing pattern: ${slot.pattern}`);
    });
  }
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
  const candidates = rankedCandidates(pattern, options, selected, recentFamilies, slotIndex);
  return candidates.find((item) => !selected.some((chosen) => chosen.family === item.family)) || candidates[0] || null;
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
  const athleticKettlebell = item.patterns.includes("kbComplex") || item.patterns.includes("kbPower") || item.patterns.includes("kbMobility");
  if (athleticKettlebell && options.type !== "kettlebell") return false;
  if (options.type === "kettlebell" && !isKettlebellExercise(item, options.location)) return false;
  if (options.location === "kongs" && item.id.startsWith("kb-") && options.type !== "kettlebell") return false;
  if (options.type === "bodyweight") {
    const approvedBodyweightEquipment = [
      "h-pullup", "h-bar-pullup", "h-ring-row", "h-ring-pushup", "h-parallette-pushup", "h-ring-curl",
      "k-pullup", "t-pullup", "t-pulldown", "t-cable-row", "t-db-row",
    ];
    if (!item.id.startsWith("b-") && !approvedBodyweightEquipment.includes(item.id)) return false;
  }
  if (options.location !== "hotel") return true;
  return item.equipment.every((requirement) => options.hotelEquipment.includes(requirement));
}

function isKettlebellExercise(item, location) {
  if (location === "hotel") return item.id.startsWith("tkb-");
  return item.id.startsWith("kb-") || item.name.toLowerCase().includes("kettlebell");
}

function hasConflict(item, options) {
  const active = activeAreas(options);
  if (!active.size || active.has("general")) return false;
  return item.conflicts.some((area) => active.has(area));
}

function score(item, options, recentFamilies, slotIndex) {
  let value = 100;
  if (options.location === "kongs") value += item.id.startsWith("k-") ? 24 : item.id.startsWith("b-") ? -12 : 0;
  if (options.location === "home") value += item.id.startsWith("h-") || item.id.startsWith("kb-") ? 16 : 0;
  if (options.location === "hotel") value += item.id.startsWith("t-") || item.id.startsWith("tkb-") ? 16 : 0;
  if (options.readiness === "low") {
    if (item.stable) value += 35;
    if (item.demand === "high") value -= 28;
  }
  if (options.readiness === "high" && item.demand === "high") value += 18;
  if (options.readiness === "medium" && item.stable) value += 6;
  if (recentFamilies.has(item.family)) value -= 65;
  value += PREFERENCE_BONUS[item.preference] || 0;
  if (item.id.includes("neutral") || item.name.toLowerCase().includes("neutral-grip")) value += 8;
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
  if (item.preference === "favourite") reasons.push("One of your reviewed staple movements.");
  if (recentFamilies.size && !recentFamilies.has(item.family) && item.role === "primary") reasons.push("Rotated from your last comparable session.");
  if (item.id === "k-rdl-machine") reasons.push("Included to build familiarity with the RDL machine.");
  return { ...item, slotPattern: slot.pattern, slotLabel: slot.label, reason: reasons[0] || "", order: 0, group: "" };
}

function groupExercises(exercises, options) {
  const circuit = options.duration === 20;
  let ordered = options.type === "mobility"
    ? [...exercises]
    : [...exercises.filter((item) => item.role !== "accessory"), ...exercises.filter((item) => item.role === "accessory")];

  if (options.duration === 30 && ["upper", "full", "bodyweight"].includes(options.type)) {
    const preferredOrder = {
      upper: ["chest", "horizontalPull", "shoulderPress", "verticalPull"],
      full: ["unilateral", "chest", "horizontalPull", "shoulderPress", "verticalPull", "biceps", "triceps"],
      bodyweight: ["chest", "verticalPull", "squat", "hamstring", "unilateral", "core"],
    }[options.type];
    ordered.sort((a, b) => preferredOrder.indexOf(a.slotPattern) - preferredOrder.indexOf(b.slotPattern));
  }

  const grouped = ordered.map((item) => ({ ...item, group: circuit ? "Circuit · 2 rounds" : "" }));
  if (!circuit && options.duration === 30) assignShortSupersets(grouped, options.type);
  if (!circuit) assignAccessoryFinishers(grouped);
  return grouped.map((item, index) => ({ ...item, order: index + 1 }));
}

function assignShortSupersets(exercises, type) {
  const pairs = {
    upper: [["chest", "horizontalPull", "Superset A"], ["shoulderPress", "verticalPull", "Superset B"]],
    full: [["chest", "horizontalPull", "Superset A"], ["shoulderPress", "verticalPull", "Superset B"], ["biceps", "triceps", "Finisher A"]],
    bodyweight: [["chest", "verticalPull", "Superset A"], ["squat", "hamstring", "Superset B"], ["unilateral", "core", "Superset C"]],
  }[type] || [];
  pairs.forEach(([first, second, label]) => {
    const firstExercise = exercises.find((item) => item.slotPattern === first && !item.group);
    const secondExercise = exercises.find((item) => item.slotPattern === second && !item.group);
    if (firstExercise && secondExercise) {
      firstExercise.group = label;
      secondExercise.group = label;
    }
  });
}

function assignAccessoryFinishers(exercises) {
  const accessories = exercises.filter((item) => item.role === "accessory" && !item.group);
  if (accessories.length < 2) return;
  const firstGroupSize = accessories.length % 2 === 1 ? 3 : 2;
  accessories.forEach((item, index) => {
    const groupIndex = index < firstGroupSize ? 0 : 1 + Math.floor((index - firstGroupSize) / 2);
    item.group = `Finisher ${String.fromCharCode(65 + groupIndex)}`;
  });
}

function shouldExplainOptional(slot, options) {
  return ["verticalPull", "horizontalPull"].includes(slot.pattern) && ["hotel", "bodyweight"].includes(options.location);
}

function omissionFor(slot, options) {
  let reason = `No safe ${slot.label} matched today's setup.`;
  if (options.type === "kettlebell" && !hasKettlebellAccess(options)) reason = "Kettlebell pattern omitted: no kettlebell is available at this location.";
  if (["verticalPull", "horizontalPull"].includes(slot.pattern) && options.location === "bodyweight") reason = "Pulling omitted: no bar, rings or anchor are available with no equipment.";
  else if (["verticalPull", "horizontalPull"].includes(slot.pattern) && options.location === "hotel") reason = "Pulling omitted: the selected hotel equipment has no suitable bar, cable or supported row option.";
  return { pattern: slot.pattern, label: slot.label, reason };
}

function buildWarmup(options) {
  const minutes = options.duration <= 30 ? 5 : 7;
  const affected = activeAreas(options);
  const upperAffected = ["shoulder", "elbow", "wrist"].some((area) => affected.has(area));
  const lowerAffected = ["back", "hip", "knee", "ankle"].some((area) => affected.has(area));
  if (options.type === "mobility" && options.duration < 30) return `${minutes} min · relaxed full-body mobility in comfortable ranges`;
  if (options.type === "mobility") return `${minutes} min · easy walking or breathing, then relaxed movement in comfortable ranges`;
  if (["kongs", "home"].includes(options.location)) {
    if (upperAffected && lowerAffected) return `${minutes} min · easy walk, relaxed breathing and pain-free pattern rehearsal only`;
    if (upperAffected) return `${minutes} min · easy walk, comfortable bodyweight squats and lower-body movement rehearsal; omit get-ups, halos and swings today`;
    if (lowerAffected) return `${minutes} min · easy walk, scapular circles and light halos; omit swings and get-ups today`;
    if (affected.has("general")) return `${minutes} min · easy walk and comfortable full-body movement rehearsal`;
    return `${minutes} min · light halos, Turkish get-up practice and crisp kettlebell swings`;
  }
  if (upperAffected) return `${minutes} min · easy walk, comfortable squats and reverse lunges; omit loaded upper-body rehearsal`;
  if (lowerAffected) return `${minutes} min · easy walk, scapular circles and comfortable upper-body rehearsal`;
  return `${minutes} min · bodyweight squats, reverse lunges, scapular circles and easy movement rehearsal`;
}

function buildNotes(options, omissions) {
  const notes = [];
  if (options.readiness === "low") notes.push("Coverage is unchanged; today favours controlled, mentally easier choices.");
  if (options.painAreas.length || options.restrictions.length) notes.push("Today's adjustments use symptom-aware substitutions. Keep every range comfortable and stop if symptoms increase.");
  notes.push(...omissions.map(({ reason }) => reason));
  return [...new Set(notes)];
}

function activeAreas(options) {
  const mappedRestrictions = { avoidOverhead: "shoulder", avoidGrip: "elbow", avoidHipLoad: "hip", avoidBackLoad: "back" };
  return new Set([...options.painAreas, ...options.restrictions.map((item) => mappedRestrictions[item]).filter(Boolean)]);
}

function hasKettlebellAccess(options) {
  return ["kongs", "home"].includes(options.location) || (options.location === "hotel" && options.hotelEquipment.includes("kettlebells"));
}

function unavailableWorkoutReason(options) {
  if (options.type === "pull" && ["hotel", "bodyweight"].includes(options.location)) return "A Pull workout needs a bar, rings, cable or supported row. Choose available hotel equipment, Home or Kongs.";
  if (options.type === "kettlebell" && !hasKettlebellAccess(options)) return "No kettlebell is available here. Choose a location with kettlebells or select Bodyweight instead.";
  return "No safe exercises matched this session and today's adjustments. Change the setup or use a different session.";
}

function seededNoise(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4_294_967_295;
}
