export function workoutToText(workout, heading = "") {
  const workoutHeading = workout.circuitName || workout.typeLabel;
  const lines = [heading || workoutHeading, `${workout.locationLabel} · ${workout.duration} min · ${title(workout.readiness)} readiness`];
  if (workout.circuitId) lines.push(`${workout.circuitEquipment === "double" ? "Double kettlebell" : "Single kettlebell"} · ${workout.circuitCategory}`);
  lines.push("", `Warm-up — ${workout.warmup}`, "");
  let lastGroup = "";
  workout.exercises.forEach((item) => {
    if (item.group && item.group !== lastGroup) lines.push(item.group);
    lines.push(`${item.order}. ${item.name} — ${item.prescription}`);
    if (item.cue) lines.push(`   ${item.cue}`);
    lastGroup = item.group;
  });
  if (workout.notes.length) lines.push("", ...workout.notes);
  return lines.join("\n");
}

export function weekToText(plan) {
  const lines = [`STEVE'S WORKOUT PLAN`, plan.weekLabel, ""];
  plan.days.forEach((day) => {
    lines.push(day.day.toUpperCase());
    if (day.session === "rest") lines.push("Rest", "");
    else lines.push(workoutToText(day.workout), "");
  });
  return lines.join("\n").trim();
}

function title(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Medium";
}
