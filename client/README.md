# V-Talk — Client

The web front-end for **V-Talk**, a modern real-time chat application. Built with
React 18 (Create React App), it features a marketing landing page, a full auth
flow, and a real-time chat interface — all sharing one cohesive **blue/cyan
design language** with light/dark themes and a customizable accent color.

> Looking for the API/socket server? See the `server/` package at the repo root.

## Tech stack

| Area | Libraries |
| --- | --- |
| UI | React 18, React Router 6 |
| State | Redux + redux-thunk (redux-logger in dev) |
| Styling | Tailwind CSS 3 + styled-components (theme tokens) |
| Motion | framer-motion, AOS (scroll), react-wavify |
| Realtime | socket.io-client |
| Networking | axios |
| UX | @headlessui/react, react-toastify, react-icons, emoji-mart, swiper, moment |

## Getting started

```bash
# from the client/ directory
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000) and talks to the
backend at the URL configured below (default `http://localhost:4000`). Start the
`server/` package as well for a fully working app.

### Environment

Create `client/.env` to point the client at your backend. The base URL is the
single source of truth for both REST (axios) and the realtime socket
([src/config/serverConfig.js](src/config/serverConfig.js)):

```env
REACT_APP_SERVER_ACCESS_BASE_URL=http://localhost:4000
```

If unset, it falls back to `http://localhost:4000`.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the dev server with hot reload. |
| `npm run build` | Production build to `build/` (minified, hashed). |
| `npm test` | Run the test runner in watch mode. |
| `npm run eject` | Eject CRA config (one-way — avoid unless necessary). |

> Tip: `npm run build` treats lint warnings as errors only when `CI=true`. To
> build locally without failing on warnings, run `CI=false npm run build`.

## Design system

The UI is driven by design tokens rather than scattered hardcoded colors.

- **Theme tokens** — [src/Components/Themes.js](src/Components/Themes.js) exports
  `makeLightTheme(accent)` / `makeDarkTheme(accent)` plus shared `spacing`,
  `radius`, `motion`, and `shadow` scales. Themes are built from the
  user-selected accent color, so the picker drives CTAs, gradients, focus rings,
  scrollbars, and message bubbles everywhere. They are provided to the app via
  the styled-components `ThemeProvider` in [src/App.js](src/App.js).
- **Reusable primitives** — in [src/Styles/](src/Styles/):
  - `Button.js` — themed button with `$variant` (`primary`/`secondary`/`ghost`/`danger`/`icon`), `$block`, and a built-in `loading` spinner (default export `AppButton`).
  - `Input.js` — labeled field with error state and an accessible password toggle.
  - `Card.js` — surface primitive (`solid` / `$glass`).
  - `Skeleton.js` — shimmer placeholder for loading states.
  - `motion.js` — shared framer-motion presets (`fadeInUp`, `stagger`, `scaleIn`, …).
- **Global styles** — [src/GlobalStyle/GlobalStyle.js](src/GlobalStyle/GlobalStyle.js)
  and [src/index.css](src/index.css) provide the theme-aware body, fluid
  typography, `:focus-visible` rings, and a global `prefers-reduced-motion` guard.

### Theming & accessibility

- **Dark mode** is toggled via Redux (`themeReducer`) and persisted to
  `localStorage`; the whole UI cross-fades on switch.
- **Accent color** is chosen from cool presets in **Settings**
  ([src/Components/Setting.js](src/Components/Setting.js)); the choice is stored in
  `localStorage` and flows through every theme token.
- **Reduced motion** is honored app-wide (CSS guard + framer-motion
  `MotionConfig reducedMotion="user"`), so animations calm down when the OS
  requests it.

## Project structure

```
src/
  App.js                 App shell, routes, ThemeProvider + MotionConfig
  index.css              Base + reduced-motion guard
  Pages/                 HomePage, AuthPage
  Layout/                DefaultLayout HOC
  Components/
    Auth/                Login, Signup, Forgot/Reset, Verify screens
    modal/               Group, Invite, ProfileEdit, ImageEdit, NetworkError
    Welcome, HeroSection, Features, Technologies, Contact, Footer, Nav, Header
    Chat, ChatWindow, ChatMenu, SideMenu, UserList, Contacts, Setting, ...
    Themes.js            Theme token factory
  Styles/                Button, Input, Card, Skeleton, Spinner, motion presets
  GlobalStyle/           createGlobalStyle theme-aware globals
  Redux/                 Store, reducers/actions (Auth, User, Chat, Message,
                         Theme, SetColor, Tab, ProfileImage)
  config/serverConfig.js Backend base URL (env-driven)
```

## Features

- Email/password auth with signup, login, email verification, and password reset.
- Real-time 1-to-1 and group messaging over socket.io, with emoji, media/file
  sharing, reactions, and a typing indicator.
- Contacts, search, group management, and profile/avatar editing.
- Light/dark themes with a customizable accent color.
- Responsive layout for mobile, tablet, and desktop.
