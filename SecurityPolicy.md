# VirtuElect Security Policy

## Supported Versions

Currently, the `main` branch of VirtuElect is the only branch receiving security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Defensive Coding Practices

VirtuElect strictly adheres to defensive coding practices to ensure the integrity of the civic-tech platform:

1. **Anti-Crash Shields:** The backend implements unhandled exception guards (`process.on('uncaughtException')`) to prevent API downtime from malformed external data.
2. **Environment Variable Security:** Sensitive keys (Gemini AI, Google Civic, Firebase) are strictly separated in `.env` and `.env.production` and are never committed to version control.
3. **API Rate Limiting & Quotas:** Outbound AI API calls gracefully handle `RESOURCE_EXHAUSTED` and return user-friendly fallback text rather than exposing raw server errors.
4. **Input Validation:** User prompts to the AI service are trimmed and checked for empty payloads before dispatching to the Google Generative AI SDK.
5. **No Dangerous Evaluation:** We do not use `eval()` or dynamically execute user-submitted code strings under any circumstance.
6. **XSS Protection:** React handles UI rendering which natively escapes text injection, preventing Cross-Site Scripting (XSS) in the chat and candidate components.

## Reporting a Vulnerability

If you discover a security vulnerability in VirtuElect, please do **NOT** create a public issue. 

Please send an email to security@virtuelect.org.
We will respond within 48 hours with an assessment and timeline for a patch.
