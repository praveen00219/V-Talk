# V-Talk

## Project Overview

V-Talk is a modern real-time chat application built on the **MERN stack**
(MongoDB, Express, React + Redux, Node.js). Users can chat one-to-one or in
groups in real time, react with emoji, share media, and personalize the app with
light/dark themes and a customizable accent color.

## Live Website

- [V-Talk](https://v-talk.onrender.com)

## Features

- **Secure authentication with JWT**: sign up / sign in, email verification, and forgot/reset password flows
- **Real-time messaging with Socket.IO**: one-to-one and group chats with live updates
- **Group chat management**: create groups (minimum 3 users), rename groups, add/remove members, and admin controls
- **Message interactions**: emoji reactions, delete for me, and delete for everyone (sender-only)
- **Typing indicators** and live message delivery across participants
- **User discovery**: search users by name or email and start chats instantly
- **Profile management**: update avatar (Cloudinary) and profile details; view others' profiles
- **Email invitations**: invite friends via email to join the platform
- **Theming & personalization**: light/dark mode plus a customizable accent color
- **Fully responsive UI** for mobile, tablet, and desktop

## Design & UX

The interface is built on a unified **blue/cyan design system** rather than
scattered ad-hoc styling:

- **Design tokens** — a single theme factory (`client/src/Components/Themes.js`)
  defines color, spacing, radius, motion, and shadow scales for light and dark
  modes. The chosen accent color flows through every token (buttons, gradients,
  focus rings, scrollbars, message bubbles).
- **Reusable primitives** — themed `Button` (variants + loading), `Input`, `Card`,
  `Skeleton`, and shared framer-motion presets in `client/src/Styles/`.
- **Accessible & motion-aware** — app-wide `:focus-visible` rings, ARIA labels on
  icon buttons, and full `prefers-reduced-motion` support.

See [`client/README.md`](client/README.md) for front-end architecture details.

## Tech Stack

**Client:** React 18, React Router, Redux (thunk), Tailwind CSS, styled-components, framer-motion, socket.io-client, axios

**Server:** Node.js, Express, Socket.IO, MongoDB + Mongoose, JWT, Cloudinary, Nodemailer

**Deployment:** Vercel (frontend) · Render (backend)

## Installation Guide

To run V-Talk on your local machine, follow these steps.

### Step 1 — Clone the repository

```bash
git clone https://github.com/praveen00219/V-Talk.git
cd V-Talk
```

### Step 2 — Install dependencies

Install for the client and the server (in separate terminals or one after the other):

```bash
# client
cd client
npm install

# server
cd ../server
npm install
```

### Step 3 — Add environment variables

Create a `.env` file in each package. Templates and setup instructions live in
[`server/.env.example`](server/.env.example).

**Client** (`client/.env`) — defaults to `http://localhost:4000` if omitted:

| Variable | Description |
| --- | --- |
| `REACT_APP_SERVER_ACCESS_BASE_URL` | Backend base URL for REST + sockets |

**Server** (`server/.env`):

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default `4000`) |
| `DB_NAME` | Database name (e.g. `V-Talk`) |
| `MONGO_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMPT_SERVICES` | Mail service (e.g. `gmail`) |
| `SMPT_MAIL` | Sender email address |
| `SMPT_PASSWORD` | Mail app password (not the account password) |
| `SMPT_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `SMPT_PORT` | SMTP port (e.g. `587`) |
| `CLIENT_ACCESS_URL` | Allowed client origin for CORS + sockets |

> Never commit real secrets. If a secret is ever exposed, rotate it in the
> provider dashboard.

### Step 4 — Start the application

**Frontend (client):**

```bash
cd client
npm start
```

The client runs at [http://localhost:3000](http://localhost:3000).

**Backend (server):**

```bash
cd server
npm start        # or: npm run dev  (auto-restart on changes)
```

With both servers running, open the client in your browser to use the app.

## Screenshots

![image]()

![image]()

## Authors

- [@praveen00219](https://github.com/praveen00219)

## Feedback

If you have any feedback or suggestions, please reach out at praveen2192000@gmail.com
