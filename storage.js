const DB_NAME = "steves-workout-planner";
const DB_VERSION = 1;
const COMPLETIONS = "completions";
const PLANS = "plans";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(COMPLETIONS)) database.createObjectStore(COMPLETIONS, { keyPath: "id" });
      if (!database.objectStoreNames.contains(PLANS)) database.createObjectStore(PLANS, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeRequest(storeName, mode, action) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const request = action(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export function saveCompletion(entry) {
  return storeRequest(COMPLETIONS, "readwrite", (store) => store.put(entry));
}

export async function listCompletions(limit = 100) {
  const entries = await storeRequest(COMPLETIONS, "readonly", (store) => store.getAll());
  return entries.sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt))).slice(0, limit);
}

export function saveWeeklyPlan(plan) {
  return storeRequest(PLANS, "readwrite", (store) => store.put(plan));
}

export async function latestWeeklyPlan() {
  const plans = await storeRequest(PLANS, "readonly", (store) => store.getAll());
  return plans.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
}

export async function exportPlannerData() {
  const [completions, plans] = await Promise.all([
    storeRequest(COMPLETIONS, "readonly", (store) => store.getAll()),
    storeRequest(PLANS, "readonly", (store) => store.getAll()),
  ]);
  return { schemaVersion: DB_VERSION, exportedAt: new Date().toISOString(), completions, plans };
}

export async function importPlannerData(data) {
  if (!data || !Array.isArray(data.completions) || !Array.isArray(data.plans)) throw new Error("That file is not a valid planner export.");
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction([COMPLETIONS, PLANS], "readwrite");
    const completionStore = transaction.objectStore(COMPLETIONS);
    const planStore = transaction.objectStore(PLANS);
    data.completions.forEach((entry) => completionStore.put(entry));
    data.plans.forEach((entry) => planStore.put(entry));
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}
