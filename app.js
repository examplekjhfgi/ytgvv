/**
 * TubeGrab — Frontend Logic
 *
 * NOTE: This is a static frontend demo. Real video downloading requires a
 * backend service (e.g. yt-dlp, youtube-dl API). This demo simulates the
 * fetch + quality-selection flow with placeholder data.
 */

(function () {
  'use strict';

  const form = document.getElementById('download-form');
  const urlInput = document.getElementById('video-url');
  const urlError = document.getElementById('url-error');
  const fetchBtn = document.getElementById('fetch-btn');
  const resultsSection = document.getElementById('results-section');
  const qualityGrid = document.getElementById('quality-grid');
  const downloadStatus = document.getElementById('download-status');
  const statusText = document.getElementById('status-text');
  const videoThumb = document.getElementById('video-thumb');
  const videoTitle = document.getElementById('video-title');
  const videoChannel = document.getElementById('video-channel');
  const videoDuration = document.getElementById('video-duration');

  // Simulated resolutions
  const RESOLUTIONS = [
    { label: '2160p', desc: '4K Ultra HD', size: 'varies' },
    { label: '1440p', desc: '2K Quad HD', size: 'varies' },
    { label: '1080p', desc: 'Full HD', size: 'varies' },
    { label: '720p', desc: 'HD', size: 'varies' },
    { label: '480p', desc: 'SD', size: 'varies' },
    { label: '360p', desc: 'SD', size: 'varies' },
    { label: '240p', desc: 'Low', size: 'varies' },
    { label: '144p', desc: 'Lowest', size: 'varies' },
  ];

  // Validate YouTube URL
  function isValidYouTubeUrl(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');
      return host === 'youtube.com' || host === 'youtu.be';
    } catch {
      return false;
    }
  }

  // Extract video ID
  function extractVideoId(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.slice(1).split('/')[0];
      }
      return parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
    } catch {
      return null;
    }
  }

  // Validate on blur
  urlInput.addEventListener('blur', function () {
    const val = urlInput.value.trim();
    if (val && !isValidYouTubeUrl(val)) {
      urlInput.setAttribute('aria-invalid', 'true');
      urlError.textContent = 'Please enter a valid YouTube URL.';
    } else {
      urlInput.removeAttribute('aria-invalid');
      urlError.textContent = '';
    }
  });

  // Clear error on input
  urlInput.addEventListener('input', function () {
    if (urlInput.hasAttribute('aria-invalid')) {
      urlInput.removeAttribute('aria-invalid');
      urlError.textContent = '';
    }
  });

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const url = urlInput.value.trim();

    if (!url) {
      urlInput.setAttribute('aria-invalid', 'true');
      urlError.textContent = 'Please paste a YouTube video URL.';
      urlInput.focus();
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      urlInput.setAttribute('aria-invalid', 'true');
      urlError.textContent = 'Please enter a valid YouTube URL (youtube.com or youtu.be).';
      urlInput.focus();
      return;
    }

    fetchVideo(url);
  });

  // Simulate fetching video info
  function fetchVideo(url) {
    fetchBtn.disabled = true;
    fetchBtn.querySelector('.btn-label').textContent = 'Fetching...';
    resultsSection.hidden = true;

    // Simulate network delay
    setTimeout(function () {
      populateResults(url);
      fetchBtn.disabled = false;
      fetchBtn.querySelector('.btn-label').textContent = 'Fetch';
      resultsSection.hidden = false;
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 800);
  }

  // Populate results with mock data
  function populateResults(url) {
    const videoId = extractVideoId(url);

    // Use YouTube thumbnail
    videoThumb.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    videoThumb.alt = 'Video thumbnail';

    videoTitle.textContent = 'Video Title (demo)';
    videoChannel.textContent = 'Channel Name (demo)';
    videoDuration.textContent = '3:42';

    // Build quality buttons
    qualityGrid.innerHTML = '';
    RESOLUTIONS.forEach(function (res) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quality-btn';
      btn.innerHTML = `
        <span class="res-label">${res.label}</span>
        <span class="res-desc">${res.desc}</span>
        <span class="res-size">${res.size}</span>
      `;
      btn.addEventListener('click', function () {
        startDownload(res.label);
      });
      qualityGrid.appendChild(btn);
    });
  }

  // Simulate download
  function startDownload(resLabel) {
    downloadStatus.hidden = false;
    statusText.textContent = `Preparing ${resLabel} download...`;

    // Disable all quality buttons
    qualityGrid.querySelectorAll('button').forEach(function (b) {
      b.disabled = true;
      b.style.opacity = '0.5';
      b.style.cursor = 'not-allowed';
    });

    setTimeout(function () {
      statusText.textContent = `${resLabel} download ready! (demo — connect a backend for real downloads)`;
      downloadStatus.querySelector('.spinner').style.display = 'none';

      // Re-enable after 3s
      setTimeout(function () {
        downloadStatus.hidden = true;
        downloadStatus.querySelector('.spinner').style.display = '';
        qualityGrid.querySelectorAll('button').forEach(function (b) {
          b.disabled = false;
          b.style.opacity = '';
          b.style.cursor = '';
        });
      }, 3000);
    }, 1500);
  }

})();