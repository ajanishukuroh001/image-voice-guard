# Verity — AI content intelligence

Verity is an image, text, and video authenticity checker with a Node.js backend connected to Hive AI's content-detection API.

## Run locally

1. Create a Hive AI project and API key.
2. Set the key without putting it in the repository:

```bash
export HIVE_API_KEY="your_hive_api_key"
```

On Windows PowerShell:

```powershell
$env:HIVE_API_KEY="your_hive_api_key"
```

3. Install and start:

```bash
npm install
npm start
```

4. Open `http://localhost:3000`.

## API

- `GET /api/health` checks the server and whether the Hive key is configured.
- `POST /api/analyze` accepts `type=image|text|video`, an uploaded `file`, and/or a public `url`.

Example:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "type=image" \
  -F "file=@example.png"
```

For a hosted deployment, add `HIVE_API_KEY` in the hosting provider's environment-variable settings. Do not place it in `app.js`, HTML, or a committed `.env` file.

## Important

The frontend is hosted on GitHub Pages, which cannot run this Node.js server. Deploy the backend to Render, Railway, Fly.io, or another Node-compatible host, then change the frontend API base URL from `/api/analyze` to the deployed backend URL. Enable CORS on the backend if frontend and backend use different domains.

The API response is normalized into an explainable confidence score and signals. Detection is probabilistic, so results should support human review rather than act as absolute proof.
