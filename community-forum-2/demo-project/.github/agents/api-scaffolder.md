---
name: API Scaffolder
description: Génère un endpoint CRUD complet selon nos conventions
tools:
  - filesystem
---

# API Scaffolder

Quand on te demande de créer un endpoint, génère :

1. Route dans `src/routes/{resource}.ts`
2. Types/interfaces dans `src/types/{resource}.ts`
3. Tests dans `tests/{resource}.test.ts`
4. Mise à jour de `src/index.ts` pour enregistrer la route

## Conventions obligatoires
- Validation des inputs avec messages d'erreur explicites
- Logs structurés JSON (timestamp, level, correlationId)
- Codes HTTP standards (200, 201, 400, 404, 500)
- Gestion d'erreur avec try/catch, jamais de catch silencieux
- Typage strict TypeScript (pas de `any`)

## Structure d'un endpoint
```typescript
router.post('/{resource}', async (req, res) => {
  const correlationId = req.headers['x-correlation-id'] || uuid();
  try {
    // Validation
    // Logic
    // Response
    res.status(201).json({ id, status: 'created' });
  } catch (error) {
    logger.error({ correlationId, error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

Respecte les conventions du fichier copilot-instructions.md.
