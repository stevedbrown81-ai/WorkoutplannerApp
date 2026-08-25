# Steve's Workout Planner

A private, phone-first Progressive Web App that generates a workout from:

- requested session type
- training location and available hotel equipment
- available time
- energy and recent hard activity
- pain level and affected areas

The generator implements the rules in `DataFiles/Steve_Workout_Planner_Rules.docx`. It does not import Strong data, track workouts, require a login, call an API or upload personal information.

## Phone use

Publish this folder with GitHub Pages over HTTPS. On iPhone, open the site in Safari, choose **Share → Add to Home Screen**, enable **Open as Web App**, and add it. After the first successful load, the complete app works offline.

The app remembers only the preferred session type, location, duration and energy setting in the browser. Pain areas, pain level, recent activity and notes are not retained after the page is closed.

## Updating

Replace the files in the GitHub Pages repository. The service worker downloads the new app when the phone next opens it with a connection. Opening it once more activates the latest cached version.

## Files

- `index.html` — planner interface
- `engine.js` — workout rules and exercise library
- `app.js` — interface behaviour and local preferences
- `styles.css` — responsive phone layout
- `workout-rules.html` — offline rule reference
- `sw.js` — offline cache and update behaviour
- `manifest.webmanifest` and icons — Home Screen installation
