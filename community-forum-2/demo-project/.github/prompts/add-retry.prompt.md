---
name: Add Retry Pattern
description: 'Add retry with exponential backoff to any function'
mode: agent
model: claude-sonnet-4-20250514
tools:
  - filesystem
---

# Add Retry Pattern

Add retry logic to: {{ function_name }} in {{ file_path }}

## Implementation:
- Max retries: {{ max_retries | default: 3 }}
- Backoff: exponential (1s, 2s, 4s...)
- On final failure: log error + move to dead letter / throw
- Log each attempt with attempt number and correlationId
- Add corresponding test in tests/

## Constraints:
- Use async/await (no callbacks)
- Structured JSON logging for each retry attempt
- Make backoff delays configurable for testing
- Never swallow errors silently
