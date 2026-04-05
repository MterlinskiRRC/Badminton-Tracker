# New Component Plan: Analytics Middleware

## Selected Component
Analytics middleware to track API usage metrics relevant to badminton match activity.

## Why This Component
- Adds practical value for users and admins by surfacing activity insights.
- Fits naturally with the domain and existing match workflow.
- Is manageable in scope for Milestone 1 and can be expanded later.

## Milestone 1 Implementation Scope
- Track the number of matches recorded.
- Track player activity counts based on match participation.
- Expose an admin-only analytics endpoint.

## Integration Plan
1. Add an AnalyticsService singleton to maintain in-memory counters.
2. Update MatchController to record analytics only after successful match creation.
3. Add GET /api/v1/analytics route.
4. Protect analytics route with Firebase token verification and admin role checks.
5. Document endpoint in OpenAPI spec.

## Data Points Collected
- matchesRecorded: total successful match records
- mostActivePlayers: top 5 player IDs by participation count

## Security and Privacy
- Analytics endpoint is restricted to admin role.
- No sensitive personal data is collected in analytics payloads.

## Future Expansion (Milestone 2-3)
- Persist analytics in Firestore instead of in-memory state.
- Add date range filtering and trend summaries.
- Track endpoint hit counts and error-rate metrics.
