import {
  DURATIONS, LOCATIONS, PAIN_AREAS, READINESS_LEVELS, SESSION_TYPES,
  generateWorkout, swapExercise,
} from "./engine.js";
import { workoutToText, weekToText } from "./formatters.js";
import {
  exportPlannerData, importPlannerData, latestWeeklyPlan, listCompletions, saveCompletion, saveWeeklyPlan,
} from "./storage.js";
import { DAYS, defaultWeek, generateWeeklyPlan } from "./weekly-planner.js";

const PREFERENCES_KEY = "steves-workout-planner-preferences-v3";
const defaults = { type: "upper", location: "kongs", duration: 40, readiness: "medium" };
const state = {
  ...defaults,
  ...readPreferences(),
  readiness: "medium",
  painLevel: 0,
  painAreas: [],
  restrictions: [],
  hotelEquipment: [],
  variation: 0,
  workout: null,
  history: [],
  weekDays: defaultWeek(),
  weeklyPlan: null,
  followedPreviousPlan: null,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const elements = {
  form: $("#planner-form"), sessionTypes: $("#session-types"), locations: $("#locations"), durations: $("#durations"),
  readiness: $("#readiness"), hotelEquipment: $("#hotel-equipment"), painLevels: $("#pain-levels"),
  painAreaPanel: $("#pain-area-panel"), painAreas: $("#pain-areas"), restrictions: $("#restrictions"),
  output: $("#workout-output"), workoutContext: $("#workout-context"), workoutTitle: $("#workout-title"),
  workoutSubtitle: $("#workout-subtitle"), modeBadge: $("#mode-badge"), warmup: $("#warmup-text"),
  exerciseList: $("#exercise-list"), workoutNotes: $("#workout-notes"), workoutStatus: $("#workout-status"),
  copyWorkout: $("#copy-workout"), regenerate: $("#regenerate-workout"), complete: $("#complete-workout"),
  weekForm: $("#week-form"), weekDays: $("#week-days"), generateWeekLabel: $("#generate-week-label"),
  weekOutput: $("#week-output"), weekOutputTitle: $("#week-output-title"), plannedDays: $("#planned-days"),
  copyWeek: $("#copy-week"), weekStatus: $("#week-status"), previousPlanReview: $("#previous-plan-review"),
  historyList: $("#history-list"), exportData: $("#export-data"), importData: $("#import-data"), dataStatus: $("#data-status"),
  completionDialog: $("#completion-dialog"), completionForm: $("#completion-form"), completionChoice: $("#completion-choice"),
  deviationPanel: $("#deviation-panel"), deviationList: $("#deviation-list"), connectionStatus: $("#connection-status"),
};

init();

async function init() {
  renderSetupChoices();
  renderWeekBuilder();
  bindEvents();
  syncSetup();
  updateConnectionStatus();
  registerServiceWorker();
  try {
    [state.history, state.weeklyPlan] = await Promise.all([listCompletions(), latestWeeklyPlan()]);
    renderHistory();
    if (state.weeklyPlan) {
      elements.previousPlanReview.hidden = false;
      renderWeeklyPlan(state.weeklyPlan);
    }
  } catch {
    elements.dataStatus.textContent = "Local history is unavailable in this browser mode.";
  }
}

function renderSetupChoices() {
  elements.sessionTypes.innerHTML = SESSION_TYPES.map(({ id, label }) => choiceButton("type", id, label)).join("");
  elements.locations.innerHTML = LOCATIONS.map(({ id, label }) => choiceButton("location", id, label)).join("");
  elements.durations.innerHTML = DURATIONS.map((value) => choiceButton("duration", value, `${value} min`)).join("");
  elements.readiness.innerHTML = READINESS_LEVELS.map(({ id, label, description }) => `
    <button type="button" data-readiness="${id}" role="radio"><strong>${label}</strong><small>${description}</small></button>
  `).join("");
  elements.painAreas.innerHTML = PAIN_AREAS.map(({ id, label }) => `<label><input type="checkbox" value="${id}"><span>${label}</span></label>`).join("");
}

function choiceButton(kind, id, label) {
  return `<button type="button" data-${kind}="${id}" role="radio">${label}</button>`;
}

function syncSetup() {
  selectChoice(elements.sessionTypes, "type", state.type);
  selectChoice(elements.locations, "location", state.location);
  selectChoice(elements.durations, "duration", String(state.duration));
  selectChoice(elements.readiness, "readiness", state.readiness);
  elements.hotelEquipment.hidden = state.location !== "hotel";
}

function bindEvents() {
  bindChoice(elements.sessionTypes, "type", (value) => { state.type = value; });
  bindChoice(elements.locations, "location", (value) => {
    state.location = value;
    elements.hotelEquipment.hidden = value !== "hotel";
  });
  bindChoice(elements.durations, "duration", (value) => { state.duration = Number(value); });
  bindChoice(elements.readiness, "readiness", (value) => { state.readiness = value; }, false);
  bindChoice(elements.painLevels, "painLevel", (value) => {
    state.painLevel = Number(value);
    elements.painAreaPanel.hidden = state.painLevel === 0;
    if (!state.painLevel) {
      state.painAreas = [];
      $$("input", elements.painAreas).forEach((input) => { input.checked = false; });
    }
  }, false, "pain-level");

  elements.hotelEquipment.addEventListener("change", () => { state.hotelEquipment = checkedValues(elements.hotelEquipment); });
  elements.painAreas.addEventListener("change", () => { state.painAreas = checkedValues(elements.painAreas); });
  elements.restrictions.addEventListener("change", () => { state.restrictions = checkedValues(elements.restrictions); });
  elements.form.addEventListener("submit", buildWorkout);
  elements.exerciseList.addEventListener("click", handleSwap);
  elements.copyWorkout.addEventListener("click", () => copyText(workoutToText(state.workout), elements.workoutStatus, "Workout copied for Notes."));
  elements.regenerate.addEventListener("click", regenerateWorkout);
  elements.complete.addEventListener("click", openCompletionDialog);
  elements.completionForm.addEventListener("click", handleCompletionChoice);
  elements.completionDialog.addEventListener("close", saveCompletionFromDialog);

  elements.weekDays.addEventListener("change", handleWeekChange);
  elements.weekForm.addEventListener("submit", buildWeek);
  elements.copyWeek.addEventListener("click", () => copyText(weekToText(state.weeklyPlan), elements.weekStatus, "Week copied for Apple Notes."));
  elements.previousPlanReview.addEventListener("click", (event) => {
    const button = event.target.closest("[data-followed]");
    if (!button) return;
    state.followedPreviousPlan = button.dataset.followed === "yes";
    $$('[data-followed]', elements.previousPlanReview).forEach((item) => item.classList.toggle("is-selected", item === button));
  });

  $$("[data-view-target]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.viewTarget)));
  $$("[data-view-link]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); showView(link.dataset.viewLink); }));
  elements.exportData.addEventListener("click", exportData);
  elements.importData.addEventListener("change", importData);
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
}

function bindChoice(container, stateKey, update, persist = true, dataKey = stateKey) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest(`[data-${camelToKebab(dataKey)}]`);
    if (!button) return;
    const value = button.dataset[dataKey];
    update(value);
    selectChoice(container, camelToKebab(dataKey), value);
    state.variation = 0;
    if (persist) savePreferences();
  });
}

function selectChoice(container, key, value) {
  $$(`[data-${key}]`, container).forEach((button) => {
    const selected = button.getAttribute(`data-${key}`) === String(value);
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
}

function checkedValues(container) {
  return $$("input:checked", container).map((input) => input.value);
}

function buildWorkout(event) {
  event.preventDefault();
  state.variation = 0;
  state.workout = generateWorkout(workoutInput());
  renderWorkout(state.workout);
  elements.output.hidden = false;
  elements.workoutStatus.textContent = "";
  setTimeout(() => elements.output.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
}

function workoutInput() {
  return {
    type: state.type, location: state.location, duration: state.duration, readiness: state.readiness,
    painLevel: state.painLevel, painAreas: state.painAreas, restrictions: state.restrictions,
    hotelEquipment: state.hotelEquipment, history: state.history, variation: state.variation,
  };
}

function renderWorkout(workout) {
  elements.complete.disabled = workout.availability === "unavailable";
  elements.complete.textContent = workout.availability === "unavailable" ? "No workout to complete" : "Workout completed";
  elements.workoutContext.textContent = `${workout.locationLabel} · ${workout.duration} min`;
  elements.workoutTitle.textContent = workout.typeLabel;
  elements.workoutSubtitle.textContent = `${title(workout.readiness)} readiness · ${workout.format === "circuit" ? "2-round pump circuit" : "2 working sets"}`;
  elements.modeBadge.textContent = workout.mode === "adapted" ? "Adjusted" : title(workout.mode);
  elements.modeBadge.dataset.mode = workout.mode;
  elements.warmup.textContent = workout.warmup;
  let lastGroup = "";
  elements.exerciseList.innerHTML = workout.exercises.length ? workout.exercises.map((item) => {
    const group = item.group && item.group !== lastGroup ? `<p class="group-label">${escapeHtml(item.group)}</p>` : "";
    lastGroup = item.group;
    return `${group}<article class="exercise-card">
      <span class="exercise-number">${String(item.order).padStart(2, "0")}</span>
      <div class="exercise-main"><h3>${escapeHtml(item.name)}</h3><strong>${escapeHtml(item.prescription)}</strong>
        ${item.cue ? `<p>${escapeHtml(item.cue)}</p>` : ""}${item.reason ? `<small class="selection-reason">Why: ${escapeHtml(item.reason)}</small>` : ""}</div>
      <button type="button" class="swap-button" data-swap="${item.id}" aria-label="Swap ${escapeHtml(item.name)}">Swap</button>
    </article>`;
  }).join("") : `<article class="unavailable-workout"><span aria-hidden="true">!</span><div><h3>This session cannot be built here</h3><p>${escapeHtml(workout.unavailableReason)}</p></div></article>`;
  elements.workoutNotes.hidden = !workout.notes.length;
  elements.workoutNotes.innerHTML = workout.notes.map((note) => `<p>${escapeHtml(note)}</p>`).join("");
}

function handleSwap(event) {
  const button = event.target.closest("[data-swap]");
  if (!button || !state.workout) return;
  const previous = state.workout;
  state.variation += 1;
  state.workout = swapExercise(state.workout, button.dataset.swap, { ...workoutInput(), variation: state.variation });
  renderWorkout(state.workout);
  elements.workoutStatus.textContent = state.workout === previous ? "No other safe match is available for that pattern." : "Exercise swapped for this workout only.";
}

function regenerateWorkout() {
  state.variation += 1;
  state.workout = generateWorkout(workoutInput());
  renderWorkout(state.workout);
  elements.workoutStatus.textContent = "A coordinated alternative is ready.";
}

function openCompletionDialog() {
  if (!state.workout) return;
  elements.completionChoice.hidden = false;
  elements.deviationPanel.hidden = true;
  elements.deviationList.innerHTML = state.workout.exercises.map((item) => `<label><input type="checkbox" value="${item.id}"><span>${escapeHtml(item.name)}</span></label>`).join("");
  elements.completionDialog.showModal();
}

function handleCompletionChoice(event) {
  const button = event.target.closest("button[value]");
  if (!button || button.value !== "changed") return;
  event.preventDefault();
  elements.completionChoice.hidden = true;
  elements.deviationPanel.hidden = false;
}

async function saveCompletionFromDialog() {
  if (!["followed", "save-changes"].includes(elements.completionDialog.returnValue) || !state.workout) return;
  const skipped = elements.completionDialog.returnValue === "save-changes" ? checkedValues(elements.deviationList) : [];
  const actualExercises = state.workout.exercises.filter((item) => !skipped.includes(item.id));
  const entry = {
    id: `completion-${Date.now()}`,
    completedAt: new Date().toISOString(),
    plannedType: state.workout.requestedType,
    actualType: state.workout.type,
    location: state.workout.location,
    locationLabel: state.workout.locationLabel,
    duration: state.workout.duration,
    readiness: state.workout.readiness,
    plannedExercises: state.workout.exercises.map(({ id }) => id),
    actualExercises: actualExercises.map(({ id }) => id),
    exercises: actualExercises.map(({ id, name, patterns }) => ({ id, name, patterns })),
    patterns: [...new Set(actualExercises.flatMap(({ patterns }) => patterns))],
    omissions: [...state.workout.omissions, ...skipped.map((id) => ({ exerciseId: id, reason: "Skipped during session" }))],
  };
  try {
    await saveCompletion(entry);
    state.history.unshift(entry);
    renderHistory();
    elements.workoutStatus.textContent = "Completed. Future suggestions will use what you actually did.";
    elements.complete.disabled = true;
    elements.complete.textContent = "Workout saved";
  } catch {
    elements.workoutStatus.textContent = "The workout could not be saved in this browser mode.";
  }
}

function renderWeekBuilder() {
  const sessionOptions = [{ id: "rest", label: "Rest" }, ...SESSION_TYPES];
  elements.weekDays.innerHTML = state.weekDays.map((item, index) => `
    <article class="week-day ${item.session === "rest" ? "is-rest" : ""}" data-day-index="${index}">
      <div class="day-name"><strong>${item.day.slice(0, 3)}</strong><small>${item.day}</small></div>
      <label><span class="sr-only">${item.day} session</span><select data-week-field="session">${optionsHtml(sessionOptions, item.session)}</select></label>
      <div class="day-settings" ${item.session === "rest" ? "hidden" : ""}>
        <label><span>Location</span><select data-week-field="location">${optionsHtml(LOCATIONS, item.location)}</select></label>
        <label><span>Time</span><select data-week-field="duration">${DURATIONS.map((duration) => `<option value="${duration}" ${duration === item.duration ? "selected" : ""}>${duration} min</option>`).join("")}</select></label>
      </div>
      <div class="week-hotel-equipment" ${item.session === "rest" || item.location !== "hotel" ? "hidden" : ""}>
        <p>Hotel equipment</p>
        <div class="week-equipment-grid">
          ${[["dumbbells", "DBs"], ["bench", "Bench"], ["cable", "Cables"], ["machines", "Machines"], ["pullup", "Pull-up bar"], ["kettlebells", "KBs"]].map(([value, label]) => `<label><input type="checkbox" data-week-equipment value="${value}" ${(item.hotelEquipment || []).includes(value) ? "checked" : ""}><span>${label}</span></label>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
  updateWeekCount();
}

function optionsHtml(options, selected) {
  return options.map(({ id, label }) => `<option value="${id}" ${id === selected ? "selected" : ""}>${label}</option>`).join("");
}

function handleWeekChange(event) {
  const equipmentInput = event.target.closest("[data-week-equipment]");
  if (equipmentInput) {
    const card = equipmentInput.closest("[data-day-index]");
    const index = Number(card.dataset.dayIndex);
    state.weekDays[index].hotelEquipment = $$('[data-week-equipment]:checked', card).map((input) => input.value);
    return;
  }
  const select = event.target.closest("[data-week-field]");
  if (!select) return;
  const card = select.closest("[data-day-index]");
  const index = Number(card.dataset.dayIndex);
  const field = select.dataset.weekField;
  state.weekDays[index][field] = field === "duration" ? Number(select.value) : select.value;
  const rest = state.weekDays[index].session === "rest";
  card.classList.toggle("is-rest", rest);
  $(".day-settings", card).hidden = rest;
  $(".week-hotel-equipment", card).hidden = rest || state.weekDays[index].location !== "hotel";
  updateWeekCount();
}

function updateWeekCount() {
  const count = state.weekDays.filter(({ session }) => session !== "rest").length;
  elements.generateWeekLabel.textContent = `Generate ${count} workout${count === 1 ? "" : "s"}`;
}

async function buildWeek(event) {
  event.preventDefault();
  state.weeklyPlan = generateWeeklyPlan(state.weekDays, { history: state.history, followedPreviousPlan: state.followedPreviousPlan });
  try { await saveWeeklyPlan(state.weeklyPlan); } catch { /* The plan is still usable in this session. */ }
  renderWeeklyPlan(state.weeklyPlan);
  elements.weekStatus.textContent = "Weekly guide generated and fixed. Use Today if plans change.";
  setTimeout(() => elements.weekOutput.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
}

function renderWeeklyPlan(plan) {
  elements.weekOutput.hidden = false;
  elements.weekOutputTitle.textContent = plan.weekLabel;
  elements.plannedDays.innerHTML = plan.days.map((day) => {
    if (!day.workout) return `<article class="planned-day rest-day"><header><span>${day.day.slice(0, 3)}</span><div><h3>${day.day}</h3><p>Rest</p></div></header></article>`;
    return `<details class="planned-day"><summary><span>${day.day.slice(0, 3)}</span><div><h3>${day.day} · ${escapeHtml(day.workout.typeLabel)}</h3><p>${escapeHtml(day.workout.locationLabel)} · ${day.workout.duration} min</p></div><i></i></summary>
      <div class="planned-workout"><p><strong>Warm-up</strong> ${escapeHtml(day.workout.warmup)}</p><ol>${day.workout.exercises.map((item) => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.prescription)}</span></li>`).join("")}</ol></div>
    </details>`;
  }).join("");
}

function renderHistory() {
  if (!state.history.length) {
    elements.historyList.innerHTML = `<div class="empty-state"><span>↗</span><h2>No completed workouts yet</h2><p>Generate freely. Only tapping Workout completed changes future suggestions.</p></div>`;
    return;
  }
  elements.historyList.innerHTML = state.history.map((entry) => {
    const date = new Date(entry.completedAt);
    const names = entry.exercises?.map(({ name }) => name).slice(0, 4).join(" · ") || `${entry.actualExercises.length} exercises`;
    return `<article class="history-item"><time datetime="${entry.completedAt}"><strong>${date.getDate()}</strong><span>${date.toLocaleDateString("en-GB", { month: "short" })}</span></time><div><p>${escapeHtml(entry.locationLabel || entry.location)} · ${entry.duration} min</p><h2>${title(entry.actualType)}</h2><span>${escapeHtml(names)}</span></div></article>`;
  }).join("");
}

function showView(view) {
  $$("[data-view]").forEach((section) => { section.hidden = section.dataset.view !== view; section.classList.toggle("is-active", section.dataset.view === view); });
  $$("[data-view-target]").forEach((button) => {
    const active = button.dataset.viewTarget === view;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function copyText(text, statusElement, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  statusElement.textContent = successMessage;
}

async function exportData() {
  try {
    const data = await exportPlannerData();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `steves-workout-planner-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    elements.dataStatus.textContent = "Backup exported.";
  } catch { elements.dataStatus.textContent = "Backup could not be created."; }
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    await importPlannerData(JSON.parse(await file.text()));
    state.history = await listCompletions();
    renderHistory();
    elements.dataStatus.textContent = "Backup restored.";
  } catch (error) { elements.dataStatus.textContent = error.message || "That backup could not be restored."; }
  event.target.value = "";
}

function savePreferences() {
  try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ type: state.type, location: state.location, duration: state.duration })); } catch { /* Optional. */ }
}

function readPreferences() {
  try { return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}"); } catch { return {}; }
}

function updateConnectionStatus() {
  const offline = navigator.onLine === false;
  elements.connectionStatus.innerHTML = `<i></i> ${offline ? "Working offline" : "Ready offline"}`;
  elements.connectionStatus.classList.toggle("is-offline", offline);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).catch(() => {
    elements.connectionStatus.innerHTML = "<i></i> Online only";
  }));
}

function camelToKebab(value) { return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`); }
function title(value = "") { return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()); }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
