# Frontend Setup

## Install dependencies

bash npm install 

## Run development server

bash npm run dev 

## Tech Stack

- React
- Vite
- Tailwind CSS v4

## FitBook Design System

FitBook shared design tokens and reusable UI classes are defined in:

```txt
src/index.css
```

Use these shared styles to keep colors, typography, cards, buttons, inputs and booking statuses consistent across the frontend.

### Available Theme Tokens

Theme tokens can be used directly in Tailwind classes:

```txt
bg-fit-bg
bg-fit-surface
text-fit-text
text-fit-muted
text-fit-primary
border-fit-border
rounded-fit-xl
font-fit
```

Example:

```jsx
<main className="bg-fit-bg text-fit-text font-fit">
  ...
</main>
```

### Reusable Component Classes

```txt
fit-page
fit-panel
fit-card
fit-btn-primary
fit-btn-secondary
fit-input
fit-text-muted
```

Examples:

```jsx
<main className="fit-page">
  ...
</main>

<section className="fit-panel p-6">
  ...
</section>

<article className="fit-card">
  ...
</article>

<button className="fit-btn-primary">
  Save
</button>

<button className="fit-btn-secondary">
  Cancel
</button>

<input className="fit-input" />

<p className="fit-text-muted">
  Helper text
</p>
```

### Status Badges

Use `fit-status` together with a status modifier class:

```txt
fit-status fit-status-pending
fit-status fit-status-confirmed
fit-status fit-status-completed
fit-status fit-status-cancelled
```

Examples:

```jsx
<span className="fit-status fit-status-pending">
  pending
</span>

<span className="fit-status fit-status-confirmed">
  confirmed
</span>

<span className="fit-status fit-status-completed">
  completed
</span>

<span className="fit-status fit-status-cancelled">
  cancelled
</span>
```

## FitBook Visual Prototype

A standalone HTML visual prototype is available in the project root:

```txt
fitbook-visual-prototype.html
```

This file is used as a design reference for FitBook pages and does not require the backend, Docker or the Vite development server.

To open it locally from the project root, open the file directly in a browser or use:

```bash
open fitbook-visual-prototype.html
```

The prototype includes visual references for:

- Sessions
- My bookings
- Admin panel
- Login
- Register
