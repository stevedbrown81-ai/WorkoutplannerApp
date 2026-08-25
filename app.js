import { LOCATIONS, PAIN_AREAS, SESSION_TYPES, generateWorkout, workoutToText } from "./engine.js";

const PREFERENCES_KEY = "steves-workout-planner-preferences-v2";
const defaults = { type: "upper", location: "kongs", duration: 40, energy: 7 };
const saved = readPreferences();
const state = {
  ...defaults,
  ...saved,
  painLevel: 0,
  painAreas: [],
  hardActivity: false,
  hotelEquipment: [],
  notes: "",
  variation: 0,
  workout: null,
};

const elements = {
  form: document.querySelector("#planner-form"),
  sessionTypes: document.querySelector("#session-types"),
  locations: document.querySelector("#locations"),
  durations: document.querySelector("#durations"),
  hotelEquipment: document.querySelector("#hotel-equipment"),
  energy: document.querySelector("#energy"),
  energyOutput: document.querySelector("#energy-output"),
  painLevel: document.querySelector("#pain-level"),
  painOutput: document.querySelector("#pain-output"),
  painPanel: document.querySelector("#pain-panel"),
  painAreas: document.querySelector("#pain-areas"),
  hardActivity: document.querySelector("#hard-activity"),
  notes: document.querySelector("#notes"),
  output: document.querySelector("#workout-output"),
  workoutContext: document.querySelector("#workout-context"),
  workoutTitle: document.querySelector("#workout-title"),
  workoutSubtitle: document.querySelector("#workout-subtitle"),
  modeBadge: document.querySelector("#mode-badge"),
  warmup: document.querySelector("#warmup-text"),
  exerciseList: document.querySelector("#exercise-list"),
  workoutNotes: document.querySelector("#workout-notes"),
  copy: document.querySelector("#copy-workout"),
  regenerate: document.querySelector("#regenerate-workout"),
  edit: document.querySelector("#edit-setup"),
  copyStatus: document.querySelector("#copy-status"),
  connectionStatus: document.querySelector("#connection-status"),
};

renderChoices();
syncControls();
bindEvents();
updateConnectionStatus();
registerServiceWorker();

function renderChoices() {
  elements.sessionTypes.innerHTML = SESSION_TYPES.map(({ id, label }) => choiceButton("type", id, label, id === state.type)).join("");
  elements.locations.innerHTML = LOCATIONS.map(({ id, label }) => choiceButton("location", id, label, id === state.location)).join("");
  elements.painAreas.innerHTML = PAIN_AREAS.map(({ id, label }) => `
    <label>
      <input type="checkbox" name="pain-area" value="${id}">
      <span>${label}</span>
    </label>
  `).join("");
}

function choiceButton(kind, id, label, selected) {
  return `<button type="button" data-${kind}="${id}" role="radio" aria-checked="${selected}" class="${selected ? "is-selected" : ""}">${label}</button>`;
}

function syncControls() {
  elements.energy.value = state.energy;
  elements.painLevel.value = state.painLevel;
  elements.hardActivity.checked = state.hardActivity;
  elements.notes.value = state.notes;
  selectChoice(elements.sessionTypes, "type", state.type);
  selectChoice(elements.locations, "location", state.location);
  selectChoice(elements.durations, "duration", String(state.duration));
  elements.hotelEquipment.hidden = state.location !== "hotel";
  elements.painPanel.hidden = state.painLevel === 0;
  updateEnergyLabel();
  updatePainLabel();
}

function bindEvents() {
  elements.sessionTypes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-type]");
    if (!button) return;
    state.type = button.dataset.type;
    state.variation = 0;
    selectChoice(elements.sessionTypes, "type", state.type);
    savePreferences();
  });

  elements.locations.addEventListener("click", (event) => {
    const button = event.target.closest("[data-location]");
    if (!button) return;
    state.location = button.dataset.location;
    state.variation = 0;
    selectChoice(elements.locations, "location", state.location);
    elements.hotelEquipment.hidden = state.location !== "hotel";
    savePreferences();
  });

  elements.durations.addEventListener("click", (event) => {
    const button = event.target.closest("[data-duration]");
    if (!button) return;
    state.duration = Number(button.dataset.duration);
    selectChoice(elements.durations, "duration", String(state.duration));
    savePreferences();
  });

  elements.energy.addEventListener("input", () => {
    state.energy = Number(elements.energy.value);
    updateEnergyLabel();
    savePreferences();
  });

  elements.painLevel.addEventListener("input", () => {
    state.painLevel = Number(elements.painLevel.value);
    elements.painPanel.hidden = state.painLevel === 0;
    if (state.painLevel === 0) {
      state.painAreas = [];
      elements.painAreas.querySelectorAll("input").forEach((input) => { input.checked = false; });
    }
    updatePainLabel();
  });

  elements.painAreas.addEventListener("change", () => {
    state.painAreas = [...elements.painAreas.querySelectorAll("input:checked")].map((input) => input.value);
  });

  elements.hotelEquipment.addEventListener("change", () => {
    state.hotelEquipment = [...elements.hotelEquipment.querySelectorAll("input:checked")].map((input) => input.value);
  });

  elements.hardActivity.addEventListener("change", () => { state.hardActivity = elements.hardActivity.checked; });
  elements.notes.addEventListener("input", () => { state.notes = elements.notes.value; });

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.variation = 0;
    buildWorkout();
  });

  elements.regenerate.addEventListener("click", () => {
    const previous = workoutSignature(state.workout);
    let candidate = state.workout;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      state.variation += 1;
      candidate = generateWorkout(state);
      if (workoutSignature(candidate) !== previous) break;
    }
    state.workout = candidate;
    renderWorkout(candidate);
    elements.copyStatus.textContent = workoutSignature(candidate) === previous
      ? "This is the best fit for today's constraints."
      : "New option ready.";
  });

  elements.edit.addEventListener("click", () => {
    elements.form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.copy.addEventListener("click", copyWorkout);
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
}

function buildWorkout() {
  if (state.painLevel > 0 && state.painAreas.length === 0) {
    state.painAreas = ["general"];
    const general = elements.painAreas.querySelector('input[value="general"]');
    if (general) general.checked = true;
  }
  state.workout = generateWorkout(state);
  renderWorkout(state.workout);
  elements.output.hidden = false;
  elements.copyStatus.textContent = "";
  window.setTimeout(() => elements.output.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function renderWorkout(workout) {
  elements.workoutContext.textContent = `${workout.locationLabel} · ${workout.duration} min`;
  elements.workoutTitle.textContent = workout.typeLabel;
  elements.workoutSubtitle.textContent = `Energy ${workout.energy}/10${workout.painLevel ? ` · Pain ${workout.painLevel}/10` : " · No pain flagged"}`;
  elements.modeBadge.textContent = modeLabel(workout.mode);
  elements.modeBadge.dataset.mode = workout.mode;
  elements.warmup.textContent = workout.warmup;
  elements.exerciseList.innerHTML = workout.exercises.map((exercise) => `
    <article class="exercise-card">
      <span class="exercise-number">${String(exercise.order).padStart(2, "0")}</span>
      <div class="exercise-main">
        ${exercise.superset ? `<small class="superset-tag">Superset ${exercise.superset}</small>` : ""}
        <h3>${exercise.name}</h3>
        <strong>${exercise.prescription}</strong>
        <p>${exercise.effort}</p>
        ${exercise.cue ? `<p class="exercise-cue">${exercise.cue}</p>` : ""}
      </div>
    </article>
  `).join("");
  elements.workoutNotes.innerHTML = workout.notes.map((note, index) => `<p class="${index === 0 ? "lead-note" : ""}">${note}</p>`).join("");
}

function modeLabel(mode) {
  return { normal: "Normal", lighter: "Lighter", "pain-aware": "Pain-aware", reset: "Reset" }[mode] || "Adapted";
}

function workoutSignature(workout) {
  return workout?.exercises?.map(({ id }) => id).join("|") || "";
}

async function copyWorkout() {
  if (!state.workout) return;
  const text = workoutToText(state.workout);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  elements.copyStatus.textContent = "Workout copied.";
  window.setTimeout(() => { elements.copyStatus.textContent = ""; }, 2500);
}

function selectChoice(container, key, value) {
  container.querySelectorAll(`[data-${key}]`).forEach((button) => {
    const selected = button.dataset[key] === value;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
}

function updateEnergyLabel() {
  const label = state.energy <= 3 ? "Low" : state.energy <= 5 ? "Reduced" : state.energy <= 7 ? "Good" : "High";
  elements.energyOutput.innerHTML = `${state.energy} <small>/ 10 · ${label}</small>`;
  document.documentElement.style.setProperty("--energy-position", `${(state.energy - 1) / 9 * 100}%`);
}

function updatePainLabel() {
  const label = state.painLevel === 0 ? "None" : state.painLevel <= 3 ? "Mild" : state.painLevel <= 6 ? "Moderate" : "High";
  elements.painOutput.innerHTML = `${state.painLevel} <small>/ 10 · ${label}</small>`;
  document.documentElement.style.setProperty("--pain-position", `${state.painLevel / 10 * 100}%`);
}

function readPreferences() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePreferences() {
  const preferences = { type: state.type, location: state.location, duration: state.duration, energy: state.energy };
  try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)); } catch { /* Preferences are optional. */ }
}

function updateConnectionStatus() {
  const offline = navigator.onLine === false;
  elements.connectionStatus.innerHTML = `<i></i> ${offline ? "Working offline" : "Ready offline"}`;
  elements.connectionStatus.classList.toggle("is-offline", offline);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {
      elements.connectionStatus.innerHTML = "<i></i> Online only";
    });
  });
}
