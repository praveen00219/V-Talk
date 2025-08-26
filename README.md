# V-Talk

## Project Overview

V-Talk is a modern chat Application that is build using the MERN Stack stands for MongoDB, ExpressJS, ReactJS, Redux, NodeJS. It is a real-time chat application that allows users to chat with each other in real-time. It also allows users to create groups and chat with multiple users at once.

## Live Website

- [V-Talk](https://v-talk.onrender.com)

## Features

- **Secure authentication with JWT**: Sign up/sign in, email verification, and forgot/reset password flows
- Real-time messaging with **Socket.IO supporting** one-to-one and group chats
- **Group chat management**: Create groups (minimum 3 users), rename groups, add/remove members, and group admin controls
- **Message interactions**: Emoji reactions, delete for me, and delete for everyone (sender-only)
- **Typing indicators and live message updates** across participants
- **User discovery**: Search users by name or email and start chats instantly
- **Profile management**: Update avatar (Cloudinary) and profile details; view others' profiles
- **Theming and personalization**: Global dark/light mode and per-chat chat themes
- **Email invitations**: Invite friends via email to join the platform
- **Fully responsive UI** for mobile, tablet, and desktop

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express

**Deployment:** Vercel(Frontend), Backend(Render)

## Installation Guide

To Run V-Talk project on local system follow the simple steps:

### Step-1

clone this project on your local system

```bash
  git clone https://github.com/praveen00219/V-Talk.git
  cd V-Talk
```

### Step-2 Installing Dependency

Installing Dependency for client and Server both

```bash
  cd V-Talk
```

To Installing Dependency for client

```bash
  cd client
  npm i
```

To Installing Dependency for server

```bash
  cd server
  npm i
```

### Step-3 Adding Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Environment Variables for Client

`REACT_APP_SERVER_ACCESS_BASE_URL`

### Environment Variables for Server

`MONGO_URL`

`JWT_SECRET`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

`SMPT_SERVICES`

`SMPT_MAIL`

`SMPT_PASSWORD`

`SMPT_HOST`

`SMPT_PORT`

`CLIENT_ACCESS_URL`

### Step-4 Start the Application on local machine

#### To Start Frontend Server(or client):

Move into client Directory by

```bash
  cd client
```

start the Frontend server by

```bash
  npm start
```

after ruunning this command, It will start after some time.

#### To Start Backend Server(or server):

Move into server Directory by

```bash
  cd server
```

start the Backend server by

```bash
  npm start
```

To start the server automatic after every changes we have to run this command :

```bash
  npm run dev
```

after starting the both Frontend and Backend server you can access application on the browser.

## Screenshots

![image]()

![image]()

## Authors

- [@praveen00219](https://github.com/praveen00219)

## Feedback

If you have any feedback or Suggestion, please reach out to us at praveen2192000@gmail.com
