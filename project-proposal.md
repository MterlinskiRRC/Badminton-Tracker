# Capstone Project Proposal: Badminton Score Tracker API

## Project Concept

The Badminton Score Tracker API is a lightweight backend application that helps players record match outcomes and track performance over time. The main goal is to provide a simple, structured way to store player statistics, including total wins, total losses, win percentage, and a basic ranking system.

I chose this theme because I play badminton weekly with friends, so this project has practical value for us. It also demonstrates key backend skills from this course, such as CRUD operations, authentication, validation, and layered architecture, while staying within a manageable capstone scope.

## Core Resources

### Players
- `name`
- `totalWins`
- `totalLosses`
- `winPercentage` (calculated automatically)

### Matches
- `playerId`
- `opponentId`
- `result` (`win` or `loss`)

### Rankings
- `playerId`
- `rankingScore` (based on wins/losses)
- `position`

##  Planned Endpoints

| Resource | Endpoints |
| --- | --- |
| Players | `POST /players`, `GET /players`, `GET /players/:id`, `PATCH /players/:id`, `DELETE /players/:id` |
| Matches | `POST /matches`, `GET /matches`, `GET /matches/:id` |
| Rankings | `GET /rankings` |

## Core Features

- Automatic win/loss updates when a match is recorded
- Automatic win percentage calculation
- Basic ranking generation based on total wins
- Protected routes using Firebase Authentication
- Role-based access control (admin vs. regular player)

## Technology Stack

- Node.js, TypeScript, and Express for API development
- Firestore for storing players, matches, and rankings
- Firebase Authentication for secure login and role-based authorization
- Joi for request validation
- Helmet + CORS for API security
- Swagger/OpenAPI for documentation

## Architecture

The project will follow a layered backend structure:

- Routes: Define endpoints
- Controllers: Handle requests and responses
- Services: Implement business logic (win percentage and ranking updates)
- Repositories: Manage Firestore data access

## Analytics Middleware

I will implement analytics middleware to track:

- Number of matches recorded
- Most active players

