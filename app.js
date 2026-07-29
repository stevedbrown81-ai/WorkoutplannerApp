import {
  AREAS,
  HOME_EQUIPMENT,
  LOCATION_LABELS,
  analyseHistory,
  formatLongDate,
  formatShortDate,
  generatePlan,
  parseStrongCsv,
} from "./engine.js";

const STORAGE_KEY = "full-body-planner-history-v1";
const PREFS_KEY = "full-body-planner-preferences-v1";
const state = {
  history: loadJson(STORAGE_KEY),
  location: "kongs",
  energy: 7,
  soreness: "",
  hardActivity: false,
  hotelEquipment: ["dumbbells", "bench"],
  selections: {},
  activeView: "plan",
};

const elements = {
  views: [...document.querySelectorAll("[data-view]")],
  navButtons: [...document.querySelectorAll("[data-nav]")],
  fileInput: document.querySelector("#strong-file"),
  importButton: document.querySelector("#import-button"),
  dataStatus: document.querySelector("#data-status"),
  latestStatus: document.querySelector("#latest-status"),
  locationButtons: [...document.querySelectorAll("[data-location]")],
  recoveryForm: document.querySelector("#recovery-form"),
  energy: document.querySelector("#energy"),
  energyValue: document.querySelector("#energy-value"),
  soreness: document.querySelector("#soreness"),
  hardActivity: document.querySelector("#hard-activity"),
  hotelEquipment: document.querySelector("#hotel-equipment"),
  priorities: document.querySelector("#priorities"),
  planList: document.querySelector("#plan-list"),
  recoveryNote: document.querySelector("#recovery-note"),
  emptyPlan: document.querySelector("#empty-plan"),
  planOutput: document.querySelector("#plan-output"),
  heatmap: document.querySelector("#heatmap"),
  heatmapDetail: document.querySelector("#heatmap-detail"),
  movementBalance: document.querySelector("#movement-balance"),
  copyButton: document.querySelector("#copy-workout"),
  copyStatus: document.querySelector("#copy-status"),
  privacyNote: document.querySelector("#privacy-note"),
  installHelp: document.querySelector("#install-help"),
  unknownCount: document.querySelector("#unknown-count"),
};

hydratePreferences();
bindEvents();
render();
registerServiceWorker();

function bindEvents() {
  elements.importButton.addEventListener("click", () => elements.fileInput.click());
  elements.fileInput.addEventListener("change", importStrongFile);

  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.nav;
      renderNavigation();
    });
  });

  elements.locationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.location = button.dataset.location;
      state.selections = {};
      savePreferences();
      render();
    });
  });

  elements.energy.addEventListener("input", () => {
    state.energy = Number(elements.energy.value);
    elements.energyValue.textContent = `${state.energy}/10`;
    savePreferences();
    renderPlan();
  });
  elements.soreness.addEventListener("input", () => {
    state.soreness = elements.soreness.value;
    savePreferences();
    renderPlan();
  });
  elements.hardActivity.addEventListener("change", () => {
    state.hardActivity = elements.hardActivity.checked;
    savePreferences();
    renderPlan();
  });
  elements.hotelEquipment.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    const value = event.target.value;
    state.hotelEquipment = event.target.checked
      ? [...new Set([...state.hotelEquipment, value])]
      : state.hotelEquipment.filter((item) => item !== value);
    state.selections = {};
    savePreferences();
    renderPlan();
  });
  elements.planList.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLSelectElement)) return;
    state.selections[event.target.dataset.area] = event.target.value;
    renderPlan();
  });
  elements.copyButton.addEventListener("click", copyWorkout);
}

async function importStrongFile() {
  const file = elements.fileInput.files?.[0];
  if (!file) return;
  elements.dataStatus.textContent = "Reading workout history…";
  try {
    const text = await file.text();
    const parsed = parseStrongCsv(text);
    state.history = {
      ...parsed,
      fileName: file.name,
      fileModified: new Date(file.lastModified).toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history));
    state.selections = {};
    render();
  } catch (error) {
    elements.dataStatus.textContent = error instanceof Error ? error.message : "The Strong export could not be read.";
  } finally {
    elements.fileInput.value = "";
  }
}

function render() {
  renderNavigation();
  renderDataStatus();
  renderLocations();
  renderRecovery();
  renderPlan();
  renderCoverage();
}

function renderNavigation() {
  elements.navButtons.forEach((button) => {
    const active = button.dataset.nav === state.activeView;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.views.forEach((view) => {
    view.hidden = view.dataset.view !== state.activeView;
  });
}

function renderDataStatus() {
  if (!state.history?.sessions?.length) {
    elements.dataStatus.textContent = "Import your latest Strong CSV to begin.";
    elements.latestStatus.textContent = "No workout history stored on this device";
    elements.unknownCount.textContent = "";
    return;
  }
  const workoutCount = state.history.sessions.length;
  elements.dataStatus.textContent = `${state.history.fileName || "Strong export"} · ${workoutCount} workout${workoutCount === 1 ? "" : "s"} read`;
  elements.latestStatus.textContent = `Latest workout: ${formatLongDate(state.history.latestWorkout)}`;
  const unknown = state.history.unknown?.length || 0;
  elements.unknownCount.textContent = unknown
    ? `${unknown} unrecognised exercise name${unknown === 1 ? "" : "s"} ignored in coverage`
    : "All recorded exercise names recognised";
}

function renderLocations() {
  elements.locationButtons.forEach((button) => {
    const active = button.dataset.location === state.location;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.hotelEquipment.hidden = state.location !== "hotel";
  elements.hotelEquipment.querySelectorAll("input").forEach((input) => {
    input.checked = state.hotelEquipment.includes(input.value);
  });
}

function renderRecovery() {
  elements.energy.value = String(state.energy);
  elements.energyValue.textContent = `${state.energy}/10`;
  elements.soreness.value = state.soreness;
  elements.hardActivity.checked = state.hardActivity;
}

function currentPlan() {
  if (!state.history?.sessions?.length) return null;
  const plan = generatePlan(state.history, {
    location: state.location,
    equipment: state.hotelEquipment,
    energy: state.energy,
    soreness: state.soreness,
    hardActivity: state.hardActivity,
  });
  plan.choices = plan.choices.map((choice) => {
    const requested = state.selections[choice.area];
    const selected = choice.candidates.find((candidate) => candidate.name === requested) || choice.selected;
    return { ...choice, selected };
  });
  return plan;
}

function renderPlan() {
  const plan = currentPlan();
  elements.emptyPlan.hidden = Boolean(plan);
  elements.planOutput.hidden = !plan;
  if (!plan) return;

  elements.priorities.innerHTML = plan.focusAreas
    .map((area, index) => {
      const choice = plan.choices.find((item) => item.area === area);
      const selected = choice?.selected;
      if (!selected) return "";
      return `
        <article class="priority-card">
          <span class="eyebrow">Focus ${index + 1}</span>
          <strong>${escapeHtml(area)}</strong>
          <span>${escapeHtml(selected.pattern)}</span>
          <small>${focusReason(choice, selected)}</small>
        </article>`;
    })
    .join("");

  elements.recoveryNote.textContent = plan.recoveryNote;
  elements.recoveryNote.dataset.mode = plan.recoveryMode;
  elements.planList.innerHTML = plan.choices
    .map((choice, index) => renderPlanRow(choice, index, plan.focusAreas))
    .join("");

  elements.copyStatus.textContent = "";
}

function renderPlanRow(choice, index, focusAreas) {
  if (!choice.selected) {
    return `
      <article class="movement-row missing">
        <span class="order">${index + 1}</span>
        <div>
          <span class="area">${escapeHtml(choice.area)}</span>
          <strong>No suitable movement found</strong>
          <small>Change hotel equipment or choose another location.</small>
        </div>
      </article>`;
  }
  const focus = focusAreas.includes(choice.area);
  const options = choice.candidates
    .map((candidate) => `
      <option value="${escapeAttribute(candidate.name)}" ${candidate.name === choice.selected.name ? "selected" : ""}>
        ${escapeHtml(candidate.name)} — ${escapeHtml(candidate.pattern)}
      </option>`)
    .join("");
  const last = choice.selected.lastDone
    ? `Last selected exercise: ${formatShortDate(choice.selected.lastDone.date)}`
    : `Pattern selected to balance recent training`;
  return `
    <article class="movement-row ${focus ? "is-focus" : ""}">
      <span class="order">${index + 1}</span>
      <div class="movement-main">
        <div class="movement-heading">
          <span class="area">${escapeHtml(choice.area)}</span>
          ${focus ? '<span class="focus-label">Focus lift</span>' : ""}
        </div>
        <label class="sr-only" for="movement-${slug(choice.area)}">Movement for ${escapeHtml(choice.area)}</label>
        <select id="movement-${slug(choice.area)}" data-area="${escapeAttribute(choice.area)}">
          ${options}
        </select>
        <div class="movement-meta">
          <span>2 working sets</span>
          <span>${escapeHtml(choice.selected.demand)} demand</span>
          <span>${escapeHtml(last)}</span>
        </div>
      </div>
    </article>`;
}

function focusReason(choice, selected) {
  const areaLast = choice.areaStat?.lastDate ? formatShortDate(choice.areaStat.lastDate) : "never";
  return `Area last hit ${areaLast}; ${escapeHtml(selected.demand)}-demand option placed early.`;
}

function renderCoverage() {
  if (!state.history?.sessions?.length) {
    elements.heatmap.innerHTML = '<div class="coverage-empty">Import Strong history to generate the heatmap.</div>';
    elements.movementBalance.innerHTML = "";
    return;
  }
  const sessions = state.history.sessions.slice(-8);
  const header = sessions
    .map((session) => `<th scope="col"><span>${formatShortDate(session.date)}</span><small>${escapeHtml(shortWorkoutName(session.name))}</small></th>`)
    .join("");
  const rows = AREAS.map((area) => {
    const cells = sessions.map((session) => {
      const sets = session.areaSets?.[area] || 0;
      const movements = session.movements?.filter((movement) => movement.area === area) || [];
      const detail = movements.length
        ? movements.map((movement) => `${movement.name} (${movement.workingSets})`).join(", ")
        : "No direct work";
      return `
        <td>
          <button type="button" class="heat-cell heat-${heatLevel(sets)}"
            data-date="${escapeAttribute(session.date)}"
            data-workout="${escapeAttribute(session.name)}"
            data-area="${escapeAttribute(area)}"
            data-detail="${escapeAttribute(detail)}"
            aria-label="${escapeAttribute(`${formatShortDate(session.date)}, ${area}: ${sets} direct working sets. ${detail}`)}">
            ${sets || "—"}
          </button>
        </td>`;
    }).join("");
    return `<tr><th scope="row">${escapeHtml(area)}</th>${cells}</tr>`;
  }).join("");
  elements.heatmap.innerHTML = `
    <div class="heatmap-scroll">
      <table>
        <caption class="sr-only">Direct working sets by body area across the latest eight resistance sessions.</caption>
        <thead><tr><th scope="col">Area</th>${header}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="heat-legend" aria-label="Heatmap legend">
      <span>Direct sets</span>
      <i class="heat-0"></i><span>None</span>
      <i class="heat-1"></i><span>1–2</span>
      <i class="heat-2"></i><span>3–4</span>
      <i class="heat-3"></i><span>5+</span>
    </div>`;
  elements.heatmap.querySelectorAll(".heat-cell").forEach((button) => {
    button.addEventListener("click", () => {
      elements.heatmap.querySelectorAll(".heat-cell").forEach((cell) => cell.classList.remove("is-selected"));
      button.classList.add("is-selected");
      elements.heatmapDetail.innerHTML = `
        <strong>${escapeHtml(button.dataset.area)} · ${formatShortDate(button.dataset.date)}</strong>
        <span>${escapeHtml(button.dataset.workout)}</span>
        <small>${escapeHtml(button.dataset.detail)}</small>`;
    });
  });

  const analysis = analyseHistory(state.history);
  const patterns = [
    ["Chest", "Horizontal press"],
    ["Chest", "Incline press"],
    ["Back", "Vertical pull"],
    ["Back", "Horizontal row"],
    ["Shoulders", "Overhead press"],
    ["Shoulders", "Lateral-delt"],
    ["Shoulders", "Rear-delt / shoulder health"],
    ["Quads", "Leg press / squat"],
    ["Quads", "Split-stance"],
    ["Quads", "Knee extension"],
    ["Hamstrings", "Knee flexion"],
    ["Hamstrings", "Hip hinge / extension"],
    ["Calves", "Standing calf raise"],
    ["Biceps", "Supinated curl"],
    ["Biceps", "Neutral / hammer curl"],
    ["Triceps", "Pushdown"],
    ["Triceps", "Overhead extension"],
  ];
  elements.movementBalance.innerHTML = patterns.map(([area, pattern]) => {
    const stat = analysis.patternStats[pattern];
    const last = stat?.lastDate ? formatShortDate(stat.lastDate) : "Not recorded";
    const stale = !stat?.lastDate || stat.hits14 === 0;
    return `
      <div class="balance-row ${stale ? "is-due" : ""}">
        <span><strong>${escapeHtml(pattern)}</strong><small>${escapeHtml(area)}</small></span>
        <span>${escapeHtml(last)}</span>
        <span>${stat?.sets14 || 0} sets / 14d</span>
      </div>`;
  }).join("");
}

async function copyWorkout() {
  const plan = currentPlan();
  if (!plan) return;
  const lines = [
    `${LOCATION_LABELS[state.location]} · Full body · 60 minutes`,
    `Focus: ${plan.focusAreas.join(" + ")}`,
    "",
    ...plan.choices.map((choice, index) => `${index + 1}. ${choice.area}: ${choice.selected?.name || "Choose movement"} — 2 sets`),
    "",
    plan.recoveryNote,
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    elements.copyStatus.textContent = "Workout copied";
  } catch {
    elements.copyStatus.textContent = "Copy was unavailable on this browser";
  }
}

function hydratePreferences() {
  const saved = loadJson(PREFS_KEY);
  if (!saved) return;
  state.location = saved.location || state.location;
  state.energy = Number(saved.energy ?? state.energy);
  state.soreness = saved.soreness || "";
  state.hardActivity = Boolean(saved.hardActivity);
  state.hotelEquipment = Array.isArray(saved.hotelEquipment) ? saved.hotelEquipment : state.hotelEquipment;
}

function savePreferences() {
  localStorage.setItem(PREFS_KEY, JSON.stringify({
    location: state.location,
    energy: state.energy,
    soreness: state.soreness,
    hardActivity: state.hardActivity,
    hotelEquipment: state.hotelEquipment,
  }));
}

function loadJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

function heatLevel(sets) {
  return sets === 0 ? 0 : sets <= 2 ? 1 : sets <= 4 ? 2 : 3;
}

function shortWorkoutName(name) {
  const clean = String(name).trim();
  if (/full body/i.test(clean)) return "Full body";
  return clean.length > 10 ? `${clean.slice(0, 9)}…` : clean;
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
