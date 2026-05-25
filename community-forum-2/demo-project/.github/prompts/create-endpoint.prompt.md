---
name: Create REST Endpoint
description: 'Scaffold a complete REST endpoint with our conventions'
mode: agent
model: claude-sonnet-4-20250514
tools:
  - filesystem
---

# Create REST Endpoint

Create a new REST endpoint for the resource: {{ resource }}

## Requirements:
- Route file: `src/routes/{{ resource }}.ts`
- CRUD operations: GET all, GET by id, POST, PUT, DELETE
- Input validation with explicit error messages
- Structured JSON logging on each operation
- Proper HTTP status codes (200, 201, 400, 404, 500)
- CorrelationId tracking through middleware

## Testing:
- Create `tests/{{ resource }}.test.ts`
- Test happy path + error cases for each operation
- Use supertest + jest

## Integration:
- Register the route in `src/index.ts`
- Follow patterns from existing routes in `src/routes/`
