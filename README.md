# LearnEase (Mini LMS)

## Overview

LearnEase is a mini-LMS (Learning Management System) built with the MERN stack. It supports instructors, students, and admins—offering course management, assignments, lectures (including Cloudinary video upload), real-time chat, Google Meet scheduling for live classes, and more.

## Features

- Secure, token-based login system supporting student, instructor, and admin access levels
- Full-featured course administration (add, update, remove courses; join and register for classes)
- Media uploads for lessons and assignments via integrated Cloudinary storage (supports videos and documents)
- Assignment workflow, enabling learners to submit work and receive feedback/grades from teaching staff or admins
- Automated scheduling for live lessons using Google Meet, including instant access links
- Interactive chat functionality within courses, supporting real-time conversation
- Administrative dashboard for managing users and educational content, reviewing and removing inappropriate submissions or data
- Dynamic interface tailored to each role (learners can join and submit, instructors/admins handle course setup, grading, and live scheduling)

## Setup Instructions

### Backend Setup (`/server`)

```bash

cd server


npm install

```

#### Setup the environment variable

```bash

cp .env.example.env

```

#### This is create the .env with this

```env

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/<databaseName>?retry

JWT_SECRET=mystrongsecretkey123

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=


# (Optionally for auto Google Meet):

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REDIRECT_URI=http://localhost:5002/api/google/oauth/callback/

GOOGLE_REFRESH_TOKEN=

GOOGLE_CALENDAR_ID=primary

PORT= 5002


# frontend url

ALLOWED_ORIGIN1=-your-vercel-url

ALLOWED_ORIGIN2= http://localhost:5173/

```

#### Run the server

```bash

npm start

```

### Frontend Setup (`/client`)

```bash

cd client


npm install



```

#### setup for the environment

```env

# If you deploy on the vercel then insert the render url here, not the localhost


VITE_API_URL=your-backend-url

```

## 🐳 Docker Setup (Alternative)

Run the entire application with Docker Compose:

```bash

# From the LearnEase root directory


# First time or after dependency changes(package.json or Dockerfile.dev)

docker compose-f docker-compose.dev.yml up--build


# Regular startup

docker compose-f docker-compose.dev.yml up


# Stop containers

docker compose-f docker-compose.dev.yml down

```

This starts both frontend and backend in containers with hot-reload enabled.

## CI/CD Pipeline (GitHub Actions)

The project uses an automated CI/CD pipeline powered by GitHub Actions to ensure reliable and stable deployments. A backend test suite consisting of five test cases is executed using: 
```bash
# Backend tests
cd server
npm test

# Frontend lint
cd client
npm run lint
```
On every push or pull request to the main branch, the pipeline installs backend dependencies, runs all test cases, and checks for syntax and runtime errors. If any test fails or an error is detected, the deployment is immediately blocked, ensuring that broken code is never deployed. In such cases, the previously deployed version of the application remains live, preventing downtime or service disruption. Additionally, GitHub automatically sends email notifications to alert contributors about the failure. When all tests pass successfully, the backend is deployed automatically while the frontend continues to run without interruption. This process guarantees zero-downtime deployments and protects the production environment from unstable or untested changes.

Demo Credentials

- Admin:
  Email: admin@example.com
  Password: admin123

---

- Instructor:
  Email: i1@gmail.com
  Password: instructor123

---

- Student:
  Email: s1@gmail.com
  Password: student12

(Create users via register or seed manually.)

## 🎯 Key Features by Role

### Students Can:

- Browse and enroll in courses
- Watch video lectures
- Submit assignments
- Participate in course chat
- Join live Google Meet classes
- Track their progress and grades

### Instructors Can:

- Create and manage courses
- Upload video lectures and materials
- Create assignments with due dates
- Grade student submissions
- Schedule live classes with Google Meet
- Communicate with students via chat

### Admins Can:

- Manage all users and roles
- Oversee all courses and content
- Moderate submissions and chat
- View system-wide analytics
- Remove inappropriate content

## Project Layout

-`/server` — Express backend, Mongo models, controllers, routes, configs

-`/client` — React frontend (Vite + TailwindCSS), API helpers, routing, context

- Key env files: `server/.env`, `client/.env` (git-ignored)

## Key Screens

- Login/Register (all roles)
- Course Catalog (students: enroll)
- Instructor Dashboard (manage courses, lectures, assignments, live schedule)
- Admin Dashboard (manage users/courses/content)
- Student Assignment Submissions (with due-date/grade/feedback logic)
- Chat (real-time)
- Live Class: Google Meet auto creation for scheduled lectures

## Additional Notes

- All uploads are via Cloudinary, configure credentials for full video/file support.
- To use Google Meet auto-scheduling, you must set up a Google Cloud project/OAuth and provide the required variables.
- User roles are 'student', 'instructor', 'admin'; controls and visibility change with role.
- All sensitive data is kept out of source—check `.gitignore` for .env handling.
