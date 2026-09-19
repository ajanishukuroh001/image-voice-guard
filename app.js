const tabs = document.querySelectorAll('.tab');
const dropzone = document.querySelector('#dropzone');
const fileInput = document.querySelector('#file-input');
const browseButton = document.querySelector('#browse-button');
const analyzeButton = document.querySelector('#analyze-button');
const urlInput = document.querySelector('#url-input');
const resultCard = document.querySelector('#result-card');
const resultTitle = document.querySelector('#result-title');
const resultCopy = document.querySelector('#result-copy');
const resultConfidence = document.querySelector('#result-confidence');
const resultLabel = document.querySelector('#result-label');
const resultSignals = document.querySelector('#result-signals');
const resetButton = document.querySelector('#reset-button');

let activeType = 'image';

const config = {
  image: {
    title: 'Drop an image here',
    copy: 'browse your files',
    hint: 'JPG, PNG, WEBP up to 25 MB',
    accept: 'image/*',
    placeholder: 'https://example.com/image.jpg',
  },
  text: {
    title: 'Paste text to analyze',
    copy: 'upload a TXT file',
    hint: 'TXT, DOCX up to 5 MB',
    accept: '.txt,.doc,.docx',
    placeholder: 'Paste your article text or URL',
  },
  video: {
    title: 'Drop a video here',
    copy: 'browse your files',
    hint: 'MP4, MOV, WEBM up to 100 MB',
    accept: 'video/*',
    placeholder: 'https://example.com/video.mp4',
  },
};

function bindBrowseButton() {
  const button = document.querySelector('#browse-button');
  if (!button) return;

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    fileInput.click();
  });
}

function resetDropzone() {
  const current = config[activeType];
  document.querySelector('#upload-icon').textContent = '↑';
  document.querySelector('#drop-title').textContent = current.title;
  document.querySelector('#drop-copy').innerHTML = `or <button class="inline-button" id="browse-button">${current.copy}</button>`;
  document.querySelector('#file-hint').textContent = current.hint;
  fileInput.accept = current.accept;
  urlInput.placeholder = current.placeholder;
  bindBrowseButton();
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    activeType = tab.dataset.type;
    resetDropzone();
  });
});

browseButton.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('click', (event) => {
  if (event.target.id !== 'browse-button') {
    fileInput.click();
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) {
    showReady(fileInput.files[0].name);
  }
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add('dragging');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove('dragging');
  });
});

dropzone.addEventListener('drop', (event) => {
  const file = event.dataTransfer.files[0];
  if (!file) return;

  const transfer = new DataTransfer();
  transfer.items.add(file);
  fileInput.files = transfer.files;
  showReady(file.name);
});

function showReady(name) {
  document.querySelector('#upload-icon').textContent = '✓';
  document.querySelector('#drop-title').textContent = 'Ready to analyze';
  document.querySelector('#drop-copy').textContent = name;
  document.querySelector('#file-hint').textContent = 'Click Analyze to send the file to the backend';
  urlInput.value = '';
}

function renderResult(data) {
  const cleanedLabel = data.label || 'Needs review';
  const recommendation = data.recommendation || 'Review this content with context and source history.';

  resultTitle.textContent = `${activeType.charAt(0).toUpperCase() + activeType.slice(1)} analysis is ready`;
  resultCopy.textContent = data.summary || recommendation;
  resultConfidence.textContent = `${data.confidence || 0}%`;
  resultLabel.textContent = cleanedLabel;

  resultSignals.innerHTML = '';
  (data.signals || []).forEach((signal) => {
    const li = document.createElement('li');
    li.textContent = signal;
    resultSignals.appendChild(li);
  });

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function callBackend() {
  const formData = new FormData();
  formData.append('type', activeType);

  if (fileInput.files.length) {
    formData.append('file', fileInput.files[0]);
  }

  if (urlInput.value.trim()) {
    formData.append('url', urlInput.value.trim());
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to reach detection backend');
  }

  const json = await response.json();
  return json.data;
}

analyzeButton.addEventListener('click', async () => {
  const hasInput = fileInput.files.length || urlInput.value.trim();

  if (!hasInput) {
    dropzone.animate(
      [
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 220 }
    );
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.innerHTML = 'Analyzing…';

  try {
    const data = await callBackend();
    renderResult(data);
  } catch (error) {
    resultTitle.textContent = 'Backend connection issue';
    resultCopy.textContent = 'The site is running, but the detection backend needs to be connected to a real model or service.';
    resultConfidence.textContent = '—';
    resultLabel.textContent = 'Retry';
    resultSignals.innerHTML = '<li>Backend error while processing request</li>';
    resultCard.classList.remove('hidden');
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.innerHTML = 'Analyze <span>→</span>';
  }
});

resetButton.addEventListener('click', () => {
  resultCard.classList.add('hidden');
  fileInput.value = '';
  urlInput.value = '';
  resetDropzone();
});

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
  });
});

resetDropzone();
