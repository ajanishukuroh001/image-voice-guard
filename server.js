const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

function getScoreByType(type) {
  const baseScores = {
    image: 68,
    text: 57,
    video: 73,
  };

  return baseScores[type] || 60;
}

function generateAnalysis(type, payload = {}) {
  const score = getScoreByType(type) + (payload.url ? 6 : 0) + (payload.file ? 4 : 0);
  const cappedScore = Math.min(score, 96);
  const isLikelyAi = cappedScore >= 64;

  const signalMap = {
    image: [
      'Metadata and provenance: not verified',
      'Texture / pattern anomalies: moderate signal',
      'Compression artifacts: present',
      'Source history: unavailable',
    ],
    text: [
      'Language consistency: moderate signal',
      'Prompt leakage / generic phrasing: detected',
      'Source attribution: missing',
      'Context consistency: partially verified',
    ],
    video: [
      'Frame-to-frame consistency: irregular',
      'Motion and face artifacts: moderate signal',
      'Metadata provenance: unavailable',
      'Playback continuity: partially suspicious',
    ],
  };

  return {
    type,
    confidence: Math.round(cappedScore),
    label: isLikelyAi ? 'Likely AI-generated' : 'Needs human review',
    recommendation: isLikelyAi
      ? 'Human review recommended before publishing or sharing.'
      : 'No clear synthetic signal detected, but verify source history and context.',
    summary: `${type.charAt(0).toUpperCase() + type.slice(1)} content is ${isLikelyAi ? 'showing a likely AI-generation signal' : 'not clearly showing AI-generation behavior'}, based on available evidence.`,
    signals: signalMap[type] || signalMap.image,
  };
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'verity-api', status: 'running' });
});

app.post('/api/analyze', upload.single('file'), (req, res) => {
  const payload = {
    file: !!req.file,
    url: req.body.url || '',
    text: req.body.text || '',
    type: req.body.type || 'image',
  };

  const analysis = generateAnalysis(payload.type, payload);

  res.json({
    ok: true,
    data: analysis,
    note: 'This is a backend demo. Connect a real AI detector for production-grade classification.',
  });
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Verity API running at http://localhost:${port}`);
});
