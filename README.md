# Verity — AI content intelligence

A responsive AI-content checker with a lightweight Node.js backend that serves the website and returns demo analysis result payloads.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start
```

3. Open:

```text
http://localhost:3000
```

## Backend API

- `GET /api/health` → checks service status
- `POST /api/analyze` → analyzes an uploaded file or URL payload

Example:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "type=image" \
  -F "file=@example.png"
```

Or:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"type":"text","url":"https://example.com/article"}'
```

## What the backend does

- Serves the static website
- Accepts image, text, and video requests
- Produces a structured demo detection result
- Returns confidence score, label, recommendation, and signal list

## Production upgrade

Replace the demo logic in `server.js` with calls to your real model or detection service, and store results with privacy-safe retention settings.
