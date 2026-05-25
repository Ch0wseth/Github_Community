# Notification Service

## Stack
- Node.js 20 + TypeScript strict
- Express.js
- Jest + supertest pour les tests

## Conventions
- Logs structurés JSON (timestamp, level, correlationId)
- Gestion d'erreur explicite, jamais de catch silencieux
- Un fichier = une responsabilité
- Codes HTTP standards (201, 400, 404, 500)

## Architecture
- src/routes/ → API endpoints
- src/queue/ → Processing async avec retry et dead letter
- src/channels/ → Intégrations (email, slack)
- src/middleware/ → Cross-cutting concerns (logging)

## Patterns
- Retry avec backoff exponentiel (1s, 2s, 4s)
- Dead letter queue pour les messages en échec après 3 tentatives
- Corrélation des logs via correlationId unique par notification
