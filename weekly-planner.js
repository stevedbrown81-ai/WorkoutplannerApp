import { generateWorkout } from "./engine.js";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function defaultWeek() {
  const sessions = ["push", "rest", "pull", "mobility", "legs", "rest", "rest"];
  return DAYS.map((day, index) => ({ day, session: sessions[index], location: index === 3 ? "home" : "kongs", duration: index === 3 ? 30 : 40 }));
}

export function generateWeeklyPlan(days, options = {}) {
  const coordinatedHistory = [...(options.history || [])];
  const plannedDays = days.map((day, index) => {
    if (day.session === "rest") return { ...day, workout: null };
    const workout = generateWorkout({
      type: day.session,
      location: day.location,
      duration: day.duration,
      readiness: "medium",
      hotelEquipment: day.hotelEquipment || [],
      history: coordinatedHistory,
      variation: index,
    });
    coordinatedHistory.unshift({ actualType: workout.type, actualExercises: workout.exercises.map(({ id }) => id) });
    return { ...day, workout };
  });
  const weekStart = startOfWeek(new Date());
  return {
    id: `week-${weekStart.toISOString().slice(0, 10)}`,
    weekLabel: `Week of ${weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    createdAt: new Date().toISOString(),
    followedPreviousPlan: options.followedPreviousPlan ?? null,
    days: plannedDays,
  };
}

function startOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
