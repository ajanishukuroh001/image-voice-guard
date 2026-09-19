# Verity — AI content intelligence

A responsive prototype for an AI-content authenticity checker covering images, text, and video.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Included production-ready product direction

- **Multimodal detection API:** Put image, text, and video analyzers behind a secure backend. Return calibrated confidence intervals, model version, and an uncertainty label—not a binary verdict.
- **Provenance verification:** Add C2PA / Content Credentials parsing and display the source and edit history when present.
- **Evidence panel:** Explain metadata, compression patterns, face/hand artifacts, frame consistency, language signals, and source history in plain language.
- **Privacy controls:** Encrypt uploads in transit and at rest, auto-delete raw media, publish retention rules, and offer user-controlled deletion.
- **Human review workflow:** Add reviewer assignment, notes, side-by-side comparisons, audit logs, calibrated thresholds, and an appeal path.
- **Batch and team tools:** Add folders, CSV/PDF exports, API keys, webhooks, rate limits, usage dashboards, and role-based access.
- **Accessibility and localization:** Support keyboard navigation, screen readers, reduced motion, strong contrast, and translated explanations.
- **Evaluation dashboard:** Track false positives and false negatives by media type and model version against a representative labeled set.

## Important product principle

AI detectors can be wrong and can be defeated by editing or compression. Results should communicate uncertainty and support human judgment, never silently replace it in moderation, education, employment, or publishing decisions.
