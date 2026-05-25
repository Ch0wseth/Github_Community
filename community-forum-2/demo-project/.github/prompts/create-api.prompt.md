---
name: create-api
description: Template pour créer un nouvel endpoint API REST dans le microservice
---

Crée un nouvel endpoint dans src/routes/ avec :

- Validation des inputs (retourner 400 si invalide)
- Logs structurés JSON avec correlationId
- Gestion d'erreur explicite (try/catch, pas de silencieux)
- Codes HTTP standards (200, 201, 400, 404, 500)
- Tests correspondants dans tests/

Conventions :
- Un fichier = une responsabilité
- TypeScript strict
- Export du router pour intégration dans index.ts
