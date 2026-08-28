# Workout Planner Improvement Specification

Status: implemented coaching requirements; library review applied 28 August 2026  
Purpose: define and document the current planner behaviour

## 1. Product outcome

The planner should act as a lightweight coach that removes exercise-selection decisions while preserving Steve's autonomy.

It must:

- honour the session Steve explicitly requests;
- create complete, balanced sessions for the requested duration;
- use only equipment available at the selected location;
- remember completed training so exercise variations are coordinated rather than random;
- adapt exercise stability to current Readiness;
- use safe substitutions for pain without automatically cancelling the requested session;
- remain private, phone-first and usable offline;
- avoid becoming a detailed workout logger or rigid weekly programme.

Primary coaching priority: joint-friendly hypertrophy first, strength second, with athletic movement emphasised in Kettlebell sessions and Mobility supporting consistency.

## 2. Session menu

Keep:

- Push
- Pull
- Legs
- Upper
- Full Body
- Bodyweight
- Kettlebell
- Mobility

Remove:

- Lower, because it duplicates Legs without a meaningful user-facing distinction.
- Mixed, because it does not represent a workout Steve would intentionally request.

## 3. Global training rules

### 3.1 Working sets and repetitions

- Standard strength and hypertrophy exercises use two working sets.
- Upper-body presses and pulls normally use 6-12 reps.
- Isolation exercises use higher rep ranges where appropriate.
- Loaded leg exercises normally use 10-20 reps to limit the load required.
- The app must not repeat RIR guidance on every exercise.
- The app must not prescribe rest periods.
- Primary compound exercises normally remain separate.
- Smaller body parts should be finished efficiently with supersets.
- A 20-minute pump or circuit workout uses two working rounds to preserve the two-set rule.

### 3.2 Duration meanings

- 20 minutes: lighter pump or circuit format; rely on supersets and two rounds to preserve pattern coverage and reduce boredom.
- 30 minutes or less: short session; use efficient supersets while maintaining the session's required patterns.
- 40-50 minutes: normal session; cover every required pattern and the normal accessories.
- 60 minutes: comprehensive session; include required patterns and all useful time-dependent accessories.
- The requested duration includes a 5-7 minute warm-up.

### 3.3 Warm-ups

- Kongs and Home/Garage: favour kettlebell swings, Turkish get-ups and light halos.
- Swings may satisfy the session's hinge exposure where specified below.
- Hotel and No Equipment: use bodyweight warm-up movements and assume no warm-up equipment.
- Keep the warm-up concise and inside the requested session duration.

### 3.4 Readiness

Replace the 1-10 Energy control with three options:

- Low: maintain full pattern coverage, but favour controlled, mentally easier machines and cables over heavy free weights.
- Medium: default; normal exercise selection and loading intent.
- High: Steve feels good to push; favour harder primary movements and loading while respecting every permanent restriction.

Readiness resets to Medium each day. Do not remember the previous day's value.

Remove the Hard activity in the last 48 hours switch. Readiness is the authority for fatigue and achiness.

### 3.5 Pain and restrictions

- Pain changes exercise selection through safe substitutions.
- Pain must not automatically switch the requested workout to Mobility.
- The planner must not refuse a requested strength session solely because of a pain score.
- Display an appropriate caution and a short reason for material substitutions.
- Permanent restrictions apply even when no current pain is selected.
- Pain and temporary restrictions live inside the collapsed Adjust today questionnaire.

### 3.6 Permanent exercise constraints

- Exclude barbell pressing. It aggravates Steve's golfer's elbow and rotator cuff.
- At Kongs, prefer dumbbell or machine pressing.
- The reviewed Kongs chest pool includes flat and incline dumbbell presses, cable fly and a chest-fly machine.
- The reviewed Kongs shoulder pool includes the Arnold press and half-kneeling single-kettlebell press, with existing pain filtering preserved.
- Chest dips are comfortable and should remain a staple chest/triceps option.
- Exclude straight-bar curls.
- Prefer hammer, cable and other neutral-grip curls.
- Neutral-grip pulldowns are the default vertical pull.
- At Home, neutral-grip pull-ups use the rings or outdoor climbing frame; the fixed pull-up bar uses a standard grip.
- Exclude underhand/supinated pulldowns.
- For loaded squats and lunges, do not prescribe depth below the clinician-provided 45-degree limit.
- Bodyweight squats and lunges may use a comfortable unweighted range.
- Remove carries from all generated sessions. Daily hangs cover grip separately.

## 4. Session contracts

The requested session always wins. Balance means covering the patterns appropriate to that session, not forcing every workout to train the whole body.

### 4.1 Push

Required in every session:

1. Chest movement.
2. Shoulder press.
3. Direct triceps movement or a movement deliberately serving the triceps requirement.

When time allows:

- lateral-delt work, preferably in a finishing superset.

Kongs selection rules:

- Prefer dumbbell or machine pressing over barbell pressing.
- Rotate familiar chest options such as dips, suitable machine presses and dumbbell variations.
- Do not repeat the same primary pressing variation in consecutive comparable sessions.

### 4.2 Pull

Required in every session:

1. Vertical pull.
2. Horizontal row.
3. Direct biceps work.
4. Rear-delt or shoulder-health work.

Programming rule:

- Superset biceps with rear-delt/shoulder-health work when useful for time.
- Do not add carries or direct grip work.
- Prefer neutral-grip vertical pulling and elbow-friendly curls.

### 4.3 Legs

Required in every session:

1. Squat pattern.
2. Lunge or unilateral pattern.
3. Quad-focused work.
4. Hamstring-focused work.

When time allows, rotate:

- calves;
- adductors;
- abductors.

General rules:

- Use 10-20 reps for loaded leg exercises.
- Respect the 45-degree loaded squat/lunge depth limit.
- Do not require a separate loaded hinge when swings already provide the warm-up hinge pattern.

Kongs preferences:

- Hack squat.
- Leg press.
- Iso-lateral leg press.
- Barbell Bulgarian split squat for unilateral work, with the loaded depth restriction.
- Favour the good hamstring machines for direct hamstring work.
- The glute machine is available as an option.
- Add the unfamiliar RDL machine to the normal rotation so Steve becomes familiar with it.

Home/Garage preferences:

- Kettlebell goblet squat.
- RDLs are suitable for hamstring/hinge work.

Bodyweight preferences:

- Squats, lunges, sissy squats, side lunges and similar suitable variations are available.

### 4.4 Upper

Required in every session:

1. Chest press.
2. Shoulder press.
3. Vertical pull.
4. Horizontal row.

For sessions longer than 30 minutes, also require:

- biceps and triceps, preferably as a superset;
- rear-delt or shoulder-health work.

When time allows:

- light lateral raises in a final pump superset.

The selection engine must enforce complementary pulling. It may not fill both pull slots with horizontal rows while omitting vertical pulling.

### 4.5 Full Body

Required patterns:

1. Lunge or suitable lower-body pattern.
2. Chest press.
3. Shoulder press.
4. Vertical pull.
5. Horizontal row.

Hinge rule:

- Swings in the warm-up may satisfy the hinge pattern.

Finisher rule:

- Always include arms.
- Rotate calves, adductors and abductors according to recent history and available equipment.

Short-format rule:

- For a 20-minute session, keep the patterns using lighter loading, supersets or a two-round circuit.
- The goal is a productive pump rather than heavy loading.

### 4.6 Bodyweight

- Default to full body.
- At Home, automatically use the known pull-up bar, rings and parallettes where useful.
- At Hotel, use only equipment explicitly selected.
- No Equipment or Outdoor means no bars, anchors or improvised equipment.
- When no pulling equipment exists, omit pulling instead of prescribing weak floor-based substitutes.
- Do not claim full push/pull balance when a genuine pulling option is unavailable; explain the omission briefly.

### 4.7 Kettlebell

- At Home, default to one complete named circuit Steve has previously performed, rather than assembling unrelated movement slots. Leave the Kongs machine-based programme unchanged.
- Rotate the whole circuit using completed history. Preserve the circuit's movement order and identity.
- Use proven Simple & Sinister, single-bell, double-bell and simplified Kettlebell Warrior lanes. Armour Building is the favourite recurring anchor but may not repeat consecutively.
- Exclude the Deck of Cards circuit following the completed library review.
- Default to familiar swings, cleans, squats, presses, floor presses, supported rows, hinges, lunges and get-ups. Exclude snatch-heavy tails, split jerks, bent presses and elaborate cross-body transitions from normal selection.
- Scale rounds, ladders, draw size or EMOM duration to the selected time while retaining the named format.
- If a specific pain area is selected, use the safer substitution engine instead of forcing an unsuitable named circuit.
- Do not prescribe carries.

### 4.8 Mobility

- Use a consistent, high-value full-body routine.
- Variation should be lower than in strength sessions.
- Select a small set of the best bang-for-buck movements rather than adding novelty.
- Under 30 minutes: mobility movements only.
- At 30 minutes or longer: walking or breathing may be included if useful, but mobility remains the focus.
- Avoid forced end ranges and respect the loaded hip restriction when applicable.

## 5. Daily workout flow

The primary screen should remain fast and contain only:

1. Session.
2. Location.
3. Duration.
4. Readiness: Low, Medium or High.
5. Build workout.

Adjust today is collapsed by default and contains:

- pain level or severity;
- affected areas;
- structured temporary restrictions.

Do not include free text in the initial improved version. The offline rule engine cannot reliably interpret it, and merely echoing it creates false confidence.

Hotel equipment selection remains visible when Hotel is selected because it is required to construct a valid workout.

## 6. Exercise selection engine

### 6.1 Required architecture

Replace selection dominated by weighted scoring with this sequence:

1. Load the session contract for the selected duration.
2. Determine required movement-pattern slots.
3. Filter the exercise library by location and actual equipment.
4. Apply permanent restrictions.
5. Apply current pain restrictions and safe substitutions.
6. Apply Readiness preferences without removing required coverage.
7. Use completed-workout history to select a familiar variation that was not used in the previous comparable session.
8. Fill optional accessory slots according to duration and history.
9. Validate the completed workout against the session contract.
10. If validation fails, explain the unavailable pattern rather than silently filling the slot with an unrelated exercise.

Weighted scoring may still rank valid candidates, but it must never override required pattern coverage or equipment constraints.

### 6.2 Exercise metadata

Each exercise should define:

- movement patterns;
- valid locations;
- required equipment;
- stable/controlled suitability;
- Readiness suitability;
- permanent exclusions;
- pain-area conflicts;
- familiar rotation family;
- reviewed preference weighting (`favourite`, `like`, `neutral` or `avoid`), used only as a soft ranking bias;
- loaded-depth restriction where applicable;
- primary, secondary or accessory role;
- normal prescription;
- concise selection reason templates.

Equipment must be independent of session type. Selecting hotel kettlebells must make suitable kettlebell presses, rows and leg exercises available to Push, Pull, Upper, Legs and Full Body—not only to the Kettlebell session type.

### 6.3 Variation

- Use a small, familiar exercise pool.
- Give reviewed Favourite and Like movements a gentle bias without making them mandatory or suppressing approved variation.
- Do not repeat the same primary variation in consecutive comparable sessions.
- Variation changes angle, grip, machine or emphasis while preserving the requested muscle patterns.
- Example pressing sequence: flat or dip emphasis, shoulder emphasis, incline emphasis, then recur.
- Do not introduce unfamiliar movements merely for variety, except for explicitly approved additions such as the Kongs RDL machine.

## 7. Swap behaviour

- Every exercise has a Swap exercise action.
- Swap immediately selects the next-best compatible exercise for the same movement pattern and available equipment.
- Preserve the intended sets and rep role where practical.
- A swap is a one-off decision and does not become a permanent preference.
- If the workout is completed, history records the swapped exercise actually performed.

## 8. Completion history

### 8.1 Completion action

- Generating a workout does not update history.
- History updates only after Workout completed is selected.
- On completion, first ask whether the workout was completed broadly as written.
- If yes, save the actual generated workout including any swaps.
- If no, ask only for skipped or changed exercises and save the corrected version.
- Do not require weights, individual sets, reps or rest times. Strong remains responsible for detailed progression logging.

### 8.2 Stored information

For each completed workout, store:

- date and time;
- planned session type;
- actual session type if changed;
- location and duration;
- Readiness;
- planned and actual exercise IDs;
- movement patterns covered;
- swaps, additions and omissions;
- optional pain/recovery feedback;
- optional overall session difficulty and exercise feedback.

### 8.3 Coaching use

History should:

- rotate primary variations;
- identify patterns recently covered;
- coordinate Full Body, short and travel sessions;
- inform the next Sunday plan;
- never override the session Steve explicitly requests.

## 9. Weekly planning

### 9.1 Sunday flow

The optional weekly planner should:

1. Ask whether the previous week's plan was followed.
2. Pre-fill the answer from completed-workout history.
3. If the plan was not followed, capture only meaningful deviations: completed sessions, unplanned training, patterns covered, substitutions/omissions, pain or recovery issues, and notable exercise feedback.
4. Let Steve assign session type, location and duration separately to each planned day.
5. Default to three 40-50 minute sessions: Push, Pull and Legs.
6. Allow Mobility or another supported session to be added on chosen days.
7. Generate every workout for the week in full.
8. Coordinate variations across the week and with the previous week's completed history.

The generated weekly plan remains fixed. If a session is missed or circumstances change, Steve returns to the daily workout generator rather than reshuffling the remaining week.

### 9.2 Weekly output

Primary outputs:

- interactive weekly plan inside the app;
- Copy week as clean Apple Notes-friendly plain text.

The Apple Notes copy is a guide, not a checklist. It should contain:

- week heading;
- one heading per planned day;
- session, location and duration;
- warm-up;
- numbered exercises with sets/reps or rounds;
- superset/circuit grouping;
- concise adaptation reasons only when useful.

PDF export is optional future scope, not required for the first weekly-planning release.

## 10. Workout output

Show:

- session, location and duration;
- Readiness mode;
- warm-up;
- numbered exercises;
- sets/reps, rounds or circuit structure;
- explicit superset grouping;
- short reasons for meaningful selections or substitutions.

Do not show:

- repetitive RIR reminders;
- prescribed rest periods;
- long explanations;
- generic coaching text that does not change behaviour.

## 11. Scenario acceptance tests

The engine must pass deterministic scenario tests in addition to broad combination/property tests.

### Push

- A 40-minute Kongs Push contains chest, shoulder press and triceps.
- It contains no barbell press.
- Dips remain eligible.
- A longer Push may add lateral delts.
- Low Readiness selects stable machines/cables where valid while preserving all required patterns.

### Pull

- Every Pull contains a vertical pull, horizontal row, biceps and rear-delt/shoulder-health movement.
- Biceps and rear-delt work are grouped as a superset when appropriate.
- No straight-bar curl or underhand pulldown is generated.
- Neutral-grip vertical pulling is preferred.
- No carry or grip slot is generated.

### Legs

- Every Legs session contains squat, lunge/unilateral, quad and hamstring coverage.
- Loaded prescriptions use 10-20 reps.
- Loaded squat/lunge output displays the 45-degree depth limit.
- Kongs selects from approved squat patterns and hamstring machines.
- Kongs may introduce the RDL machine.
- Home may use goblet squats and RDLs.
- Calves, adductors and abductors appear only as time-dependent accessories.

### Upper

- Every Upper contains chest press, shoulder press, vertical pull and horizontal row.
- A 40-50 minute Upper also contains arms and rear-delt/shoulder-health work.
- It may not select two horizontal rows while omitting vertical pulling.
- Light lateral raises may appear in the finishing superset.

### Full Body

- Every normal Full Body contains lunge/lower, chest, shoulder press, vertical pull and horizontal row.
- Arms are always included in the finisher.
- Calves, adductors and abductors rotate based on history.
- A 20-minute Full Body uses two lighter circuit rounds and retains the required patterns.

### Bodyweight

- Home Bodyweight may use pull-up bar, rings and parallettes.
- Hotel Bodyweight uses only explicitly selected equipment.
- No Equipment assumes no bars or anchors.
- No Equipment omits pulling instead of generating towel or prone pulling substitutes.

### Kettlebell

- A standard Home Kettlebell workout is a complete named circuit already performed by Steve; other location programmes remain independent.
- Single- and double-kettlebell circuits rotate as coordinated sessions rather than isolated exercise swaps. Armour Building recurs as a weighted favourite without dominating.
- Short sessions retain the named circuit and use an appropriate reduced round, ladder, card or EMOM structure.
- Specific pain selections fall back to safe movement-level substitutions.
- Carries never appear.

### Mobility

- Mobility uses a stable, full-body, high-value movement set.
- Sessions under 30 minutes contain only mobility movements.
- The routine does not vary merely for novelty.

### History and planning

- Generating without completing does not alter rotation history.
- Completing after a swap records the replacement.
- Consecutive comparable sessions do not repeat the same primary variation when a valid familiar alternative exists.
- A Sunday plan uses previous completed history.
- A missed weekly session does not mutate the remaining plan.
- Copy week produces readable Apple Notes-friendly plain text.

### Property tests

Across supported session, location, duration, Readiness, pain and equipment combinations:

- no duplicate exercise IDs;
- no unavailable equipment;
- no permanent restriction violations;
- two working sets unless the exercise uses an approved rounds/circuit format;
- exercise count and structure fit the requested duration;
- every satisfiable required pattern is present;
- any unsatisfied pattern has an explicit reason;
- the generated output contains no unsafe HTML from user-controlled data.

## 12. Technology decision record

### 12.1 Static PWA and GitHub Pages: keep

Argument for:

- Excellent fit for private, phone-first, offline use.
- No account, backend, subscription or API dependency.
- Fast loading and low maintenance.
- HTTPS supports service workers and clipboard copying.

Argument against:

- No automatic cross-device history sync.
- Browser-owned data can be cleared or evicted.
- GitHub Pages publishes application code publicly, so no personal health or workout history may be committed to the repository.

Decision:

- Keep the static PWA and GitHub Pages.
- Store personal history only on-device.
- Add local data export/import so history is recoverable.

### 12.2 Service worker: keep and harden

Argument for:

- Essential to the reliable offline gym/travel experience.
- The existing app shell already works offline.

Argument against:

- Cache updates can be confusing without an explicit version/update experience.

Decision:

- Keep the service worker.
- Add an update-available message and a controlled activation/reload path.
- Include weekly plan and history UI assets in offline verification.

### 12.3 localStorage: preferences only

Argument for:

- Simple and adequate for tiny values such as preferred location and duration.

Argument against:

- Poor fit for structured workout history, plans, migrations and queries.
- Synchronous string storage becomes brittle as the data model grows.

Decision:

- Keep localStorage only for lightweight UI preferences.
- Use IndexedDB for completed workouts, weekly plans and schema-versioned history.
- Provide Export data and Import data actions.

### 12.4 Deterministic JavaScript rules engine: keep, refactor

Argument for:

- Offline, fast, explainable and private.
- Scenario rules can be tested exactly.
- The desired inputs are now structured; an AI model is unnecessary for normal generation.

Argument against:

- The current weighted score can violate intended pattern balance.
- Free-text interpretation is not credible without an external model.

Decision:

- Keep plain JavaScript.
- Refactor to hard session contracts, constraint filtering, history-aware rotation and then soft ranking.
- Do not add an LLM/API in the next version.

### 12.5 AI/LLM backend: reject for now

Argument for:

- Could interpret free text and produce more conversational coaching.

Argument against:

- Requires connectivity, a backend or exposed credentials, ongoing cost and privacy decisions.
- Makes suggestions less deterministic and scenario tests harder.
- The agreed structured rules are sufficient for the desired output.

Decision:

- Do not use an AI backend in the implementation phase.
- Reconsider only if semantic notes or richer coaching become a proven need.

### 12.6 Apple Notes copy: primary document output

Argument for:

- Already accessible on Steve's phone.
- Editable, searchable and easy to use during training.
- Clipboard text is simpler and more useful than a fixed PDF.

Argument against:

- Copied Notes content cannot update the app's history automatically.

Decision:

- Make Copy week the primary weekly document action.
- Keep Workout completed in the app as the tracking action.
- Defer PDF unless printing or archiving becomes a real need.

### 12.7 Strong: retain as the progression logger

Argument for integration:

- Load and rep history could improve progression advice.

Argument against integration now:

- Adds import, matching and data-maintenance complexity.
- The planner is solving exercise selection, not detailed set logging.

Decision:

- Keep Strong responsible for weights, reps and detailed progression.
- Do not integrate it in the next version.
- Consider optional CSV analysis later only if progression recommendations become a product goal.

### 12.8 Testing tools

Decision:

- Add a small package configuration using JavaScript modules.
- Use Node's built-in test runner for fast engine and scenario tests; avoid a large unit-test framework.
- Add browser-level smoke tests for generation, swap, completion, weekly planning, copy and offline reload.
- Keep the large combination/property test that previously exercised 14,400 inputs, and extend it with the new hard contracts.

### 12.9 Source of truth

Argument for the current approach:

- The Word rules document is readable and the HTML rules page is convenient offline.

Argument against:

- Rules are duplicated across the Word document, HTML page, engine data and prose, so they can drift.

Decision:

- This specification becomes the product/coaching authority for the improvement project.
- Executable scenario tests become the behavioural authority.
- Runtime session contracts and exercise metadata become the engine authority.
- Generate or update the human-readable rules page from the agreed rules during implementation rather than maintaining contradictory summaries.

## 13. Recommended implementation sequence

### Phase 1: engine correctness

- Remove Lower, Mixed and carries.
- Encode permanent restrictions.
- Repair hotel equipment metadata.
- Create hard session contracts and duration variants.
- Implement Readiness Low/Medium/High.
- Add deterministic scenario and property tests.

### Phase 2: daily experience

- Simplify the main flow.
- Add collapsed Adjust today.
- Add Swap exercise.
- Simplify workout output and show selection reasons.
- Add Workout completed and deviation confirmation.

### Phase 3: local history

- Add IndexedDB schema and migrations.
- Record actual completed exercises and patterns.
- Add familiar variation rotation.
- Add data export/import.

### Phase 4: weekly planning

- Add Sunday review.
- Add per-day session, location and duration planning.
- Generate coordinated full workouts.
- Add interactive weekly view and Apple Notes-friendly Copy week.

### Phase 5: phone and offline hardening

- Add update handling.
- Verify install, completion history, weekly planning and copy on iPhone Safari/Home Screen.
- Verify offline reload and history persistence after application updates.
- Run accessibility and narrow-screen checks.

## 14. Proposed code structure

- `engine.js`: pure session contracts, exercise filtering, rotation, generation and validation. It must not access the DOM or browser storage.
- `exercise-library.js`: exercise metadata and familiar rotation families.
- `storage.js`: IndexedDB schema, migrations, completed-workout history, weekly plans and export/import.
- `weekly-planner.js`: Sunday review, cross-session variation planning and weekly generation.
- `formatters.js`: workout text and Apple Notes-friendly weekly text.
- `app.js`: UI orchestration only; collect inputs, call pure modules and render results.
- `index.html`: simplified daily flow, optional weekly-planner view, Adjust today, swap and completion controls.
- `styles.css`: phone-first styling for the simplified daily screen and weekly plan.
- `workout-rules.html`: human-readable summary generated or updated from this agreed specification.
- `sw.js`: offline shell versioning and update handling.
- `tests/engine.test.js`: property tests for all supported input combinations.
- `tests/scenarios.test.js`: named coaching scenarios from section 11.
- `tests/history.test.js`: completion, swaps, variation and weekly-history behaviour.

Keep modules small and browser-native. Do not add a UI framework, state-management library, database wrapper or build step unless implementation proves that plain modules are genuinely insufficient.

## 15. Definition of done

The improved planner is ready when:

- every scenario test passes;
- the daily workout can be generated with session, location, duration and one Readiness choice;
- Adjust today is optional and collapsed;
- completed history rotates familiar variations accurately;
- weekly planning generates complete coordinated sessions and clean Apple Notes text;
- personal history never leaves the device unless Steve explicitly exports it;
- the installed phone app works offline after first load;
- a real iPhone acceptance test confirms installation, update, copy, swap and completion flows.
