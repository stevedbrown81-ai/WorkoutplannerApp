# Steve's Workout Planner

A private, phone-first Progressive Web App that removes exercise-selection decisions while preserving Steve's requested session.

## What it does

- Builds balanced Push, Pull, Legs, Upper, Full Body, Bodyweight and Mobility workouts. Home Kettlebell selects complete, familiar circuits Steve has already performed; the Kongs machine programme remains independent.
- Adapts to Kongs, Home/Garage, Hotel equipment or No Equipment.
- Sizes sessions to 20, 30, 40, 50 or 60 minutes.
- Uses Low, Medium or High readiness without reducing required pattern coverage.
- Provides symptom-aware safe substitutions, one-off exercise swaps and concise selection reasons.
- Gives reviewed Favourite and Like movements a gentle selection bias while preserving rotation and session balance.
- Records only workouts explicitly marked completed, then uses them to rotate familiar variations.
- Plans all seven days with a session-or-Rest choice and copies a complete weekly guide for Apple Notes.

No login, backend or API is used. Preferences remain in `localStorage`; completed workouts and weekly plans remain in IndexedDB on the device. Export and Import provide a user-controlled backup.

## Phone use

Publish this folder with GitHub Pages over HTTPS. On iPhone, open the site in Safari, choose **Share → Add to Home Screen**, enable **Open as Web App**, and add it. After the first successful load, the app shell works offline.

## Tests

Run with Node 20 or later:

```sh
node --test
```

The suite covers named coaching scenarios, all supported session/location/duration/readiness combinations, all 64 hotel-equipment subsets and repeated variation/family checks.

## Main files

- `exercise-library.js` — exercise metadata, restrictions and rotation families
- `kettlebell-circuits.js` — simple proven Home circuits, Armour Building anchoring, duration scaling and whole-circuit rotation
- `engine.js` — hard session contracts, filtering, selection, swaps and validation
- `storage.js` — private IndexedDB history and weekly plans
- `weekly-planner.js` — seven-day coordinated planning
- `formatters.js` — workout and Apple Notes-friendly weekly text
- `app.js` — interface orchestration
- `index.html` and `styles.css` — modern phone-first interface
- `sw.js` — offline application shell
- `tests/` — scenario and invariant tests
