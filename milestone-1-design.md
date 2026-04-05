# Milestone 1 Design Summary

## Theme
Badminton Score Tracker API for recording match outcomes and tracking player performance.

## Architecture (Layered)
- Routes layer: endpoint definitions and middleware wiring.
- Controllers layer: request/response handling.
- Services layer: match processing, stat calculation, ranking generation.
- Repository layer: data access abstraction.

## Resource Schema Draft

### players collection
- id: string
- name: string
- totalWins: number
- totalLosses: number
- winPercentage: number
- createdAt: ISO date string
- updatedAt: ISO date string

### matches collection
- id: string
- playerId: string
- opponentId: string
- result: win | loss
- playedAt: ISO date string
- createdAt: ISO date string

### rankings response
- playerId: string
- playerName: string
- rankingScore: number
- position: number
- totalWins: number
- totalLosses: number
- winPercentage: number

## API Endpoints (Milestone 1)
- GET /health
- POST /api/v1/players
- GET /api/v1/players
- GET /api/v1/players/:id
- PATCH /api/v1/players/:id
- DELETE /api/v1/players/:id
- POST /api/v1/matches
- GET /api/v1/matches
- GET /api/v1/matches/:id
- GET /api/v1/rankings
- GET /api/v1/analytics

## Business Rules Implemented
- Match recording updates both players' win/loss totals.
- Win percentage is automatically recalculated for each affected player.
- Rankings are generated from player records by ranking score.
- Analytics tracks total matches and most active players.

## Security Notes
- Firebase Authentication token verification middleware added.
- Role-based checks for admin-only endpoints.
- Local development can use BYPASS_AUTH=true.

## Notes
- Repository implementation uses in-memory storage for Milestone 1.
- Repository interfaces are structured to swap to Firestore in Milestone 2.
- OpenAPI starter docs are available at /docs.
