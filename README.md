# JobTrack

JobTrack is a personal job application management dashboard for organizing opportunities, tracking interview progress, and keeping the next step visible. It runs entirely in the browser; no account or backend is required.

## Features

- Dashboard overview with application counts, status pipeline, recent applications, and activity updates
- Application directory with live search, combined status/type/source filters, and sorting
- Create, edit, view, and confirm deletion of application records
- Form validation for required fields and job listing URLs
- Responsive table on larger screens and application cards on mobile
- Accessible labels, keyboard dismissal for dialogs, status text, and reduced-motion support
- Eight realistic sample records on first launch

## Technologies

- React 19
- Vite
- JavaScript (ES modules)
- Plain CSS
- Browser localStorage

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Data and localStorage

On the first visit, JobTrack loads its sample applications. Changes are saved in the browser under `jobtrack.applications.v1` and restored on later visits to the same browser. Data is local to that browser and is not synchronized or backed up to a server. Clearing site data removes the saved applications. If stored data is malformed, the app falls back to the sample set instead of crashing.

## Screenshots

Add project screenshots here when available.

## Future improvements

- Export and import application data
- Follow-up reminders and calendar integration
- Optional cloud sync across devices
- Automated end-to-end tests