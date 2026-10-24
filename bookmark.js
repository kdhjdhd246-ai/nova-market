/**
 * NOVA MARKET AI - Ultimate Bookmarklet Injector v3.0
 * Bypasses CORS and loads the modular interface securely.
 */

(function() {
    // আপনার GitHub Pages-এর লাইভ বেস ইউআরএল (শেষের ব্যাকস্ল্যাশ `/` বাদ দিয়ে)
    const BASE_URL = 'https://kdhjdhd246-ai.github.io/nova-market';

    // ১. ডুপ্লিকেট রান হওয়া রোধ করা
    if (document.getElementById('nova-ai-overlay')) {
        alert('NOVA MARKET AI is already running on this page!');
        return;
    }

    console.log('NOVA AI: Injecting master interface...');

    // ২. স্টাইলসিট (CSS) লোড করা
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `${BASE_URL}/style.css?v=${Date.now()}`;
    document.head.appendChild(styleLink);

    // ৩. মূল কন্ট্রোল প্যানেল এবং রোবটের HTML স্ট্রাকচার তৈরি করে ইনজেক্ট করা
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'nova-ai-overlay';
    overlayContainer.innerHTML = `
        <!-- Scanning Animation Overlay -->
        <div id="nova-scanner-overlay" class="hidden">
            <div class="scan-backdrop"></div>
            <div class="radar-container">
                <div class="radar-ring ring-1"></div>
                <div class="radar-ring ring-2"></div>
                <div class="radar-ring ring-3"></div>
                <div class="radar-crosshair"></div>
                <div class="laser-beam"></div>
                <div class="particles-container" id="nova-particles"></div>
            </div>
            <div class="scan-progress-box">
                <div class="scan-text">SCANNING...</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="scan-progress-fill"></div>
                </div>
            </div>
        </div>
        
        <!-- Floating Robot Avatar -->
        <div class="nova-robot-container" id="nova-robot-avatar">
            <div class="drag-tooltip">
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 5v14M5 12h14M12 5l-3 3M12 5l3 3M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3"/></svg>
                Drag to move
            </div>
            <div class="robot-circle">
                <div class="robot-face">
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                    <div class="mouth"></div>
                </div>
                <div class="badge-n">N</div>
            </div>
            <button class="close-robot" aria-label="Close Robot">
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
        </div>

        <!-- Glassmorphism Control Panel -->
        <div class="nova-panel" id="nova-main-panel">
            <div class="panel-header" id="nova-panel-handle">
                <div class="header-left">
                    <div class="logo-circle">N</div>
                    <div class="header-titles">
                        <h2>NOVA MARKET AI</h2>
                        <p>Smart Market Scanner</p>
                    </div>
                </div>
                <button class="btn-close-panel" aria-label="Minimize Panel">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>

            <div class="panel-tabs">
                <button class="tab-btn active" data-tab="tab-scan">Scan</button>
                <button class="tab-btn" data-tab="tab-history">History</button>
                <button class="tab-btn" data-tab="tab-settings">Settings</button>
            </div>

            <div class="panel-content">
                <!-- SCAN TAB -->
                <div id="tab-scan" class="tab-pane active">
                    <div class="input-section">
                        <label><span class="dot cyan"></span> Market</label>
                        <div class="custom-select"><div class="select-value" id="current-market"><span class="flag-icon">🇺🇸/🇪🇺</span> EUR/USD</div><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 9l6 6 6-6"/></svg></div>
                    </div>
                    <div class="input-section">
                        <label><span class="dot green"></span> Timeframe</label>
                        <div class="custom-select"><div class="select-value" id="current-timeframe"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> 1 minute</div><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 9l6 6 6-6"/></svg></div>
                    </div>
                    <button class="btn-start-scan" id="btn-start-scan">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        <span>START SCAN</span>
                    </button>
                    <div class="input-section mt-15">
                        <label><span class="dot green"></span> Scan Mode</label>
                        <div class="mode-toggle">
                            <button class="mode-btn active" id="mode-manual"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Manual</button>
                            <button class="mode-btn" id="mode-auto"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.63-6.37L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 1 0-2.63 6.37L3 16"/></svg> Auto Repeat</button>
                        </div>
                    </div>
                    <div class="status-box" id="ui-status-box">
                        <div class="status-ring" id="ui-status-ring"><div class="ring-inner" id="ui-ring-inner"></div></div>
                        <div class="status-text">
                            <h3 id="ui-status-title">Ready to scan</h3>
                            <p id="ui-status-desc">Click START SCAN to begin analysis</p>
                        </div>
                    </div>
                </div>

                <!-- HISTORY TAB -->
                <div id="tab-history" class="tab-pane hidden">
                    <div class="history-actions">
                        <span class="history-count" id="history-count">0 Scans</span>
                        <div class="action-btns">
                            <button class="btn-small" id="btn-export-history">Export</button>
                            <button class="btn-small btn-danger-outline" id="btn-clear-history">Clear</button>
                        </div>
                    </div>
                    <div class="history-list" id="history-list-container">
                        <div class="empty-state">No scan history available.</div>
                    </div>
                </div>

                <!-- SETTINGS TAB -->
                <div id="tab-settings" class="tab-pane hidden">
                    <div class="input-section">
                        <label>Minimum Quality Score <span id="val-threshold" class="val-badge">75</span></label>
                        <input type="range" id="setting-threshold" class="styled-slider" min="50" max="95" value="75">
                        <p class="setting-desc">Ignore signals below this quality score.</p>
                    </div>
                    <div class="input-section mt-15">
                        <label>Auto-Scan Interval</label>
                        <select id="setting-interval" class="styled-select">
                            <option value="30000">30 Seconds</option>
                            <option value="60000" selected>1 Minute</option>
                            <option value="300000">5 Minutes</option>
                        </select>
                    </div>
                    <div class="input-section mt-15">
                        <label>Safe Storage</label>
                        <p class="setting-desc" style="margin-bottom: 8px;">Settings and history are saved locally.</p>
                        <button class="btn-danger-outline w-100" id="btn-reset-app">Reset Factory Settings</button>
                    </div>
                </div>
            </div>

            <div class="panel-footer">
                <div class="footer-logo">
                    <div class="mini-robot"></div>
                    <span>NOVA AI • Trade Smarter</span>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 20V10M12 20V4M6 20v-4"/></svg>
            </div>
        </div>

        <!-- Compact Minimized Launcher -->
        <div class="nova-minimized hidden" id="nova-minimized-launcher">
            <div class="mini-robot-avatar">
                <div class="robot-face-mini"><div class="eye left"></div><div class="eye right"></div><div class="mouth"></div></div>
            </div>
            <div class="minimized-text">
                <h4>NOVA</h4>
                <p>Tap to open</p>
            </div>
            <div class="expand-icon"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 15l-6-6-6 6"/></svg></div>
        </div>
    `;
    document.body.appendChild(overlayContainer);

    // ৪. জাভাস্ক্রিপ্ট মডিউলগুলো ক্রমানুসারে লোড করা
    const scripts = [
        'data-adapter.js',
        'indicator-engine.js',
        'scanner-engine.js',
        'settings-manager.js',
        'history-manager.js',
        'app.js'
    ];

    let index = 0;
    function loadNextScript() {
        if (index < scripts.length) {
            const scriptName = scripts[index++];
            const scriptEl = document.createElement('script');
            scriptEl.src = `${BASE_URL}/${scriptName}?v=${Date.now()}`;
            scriptEl.onload = loadNextScript;
            scriptEl.onerror = () => console.error(`NOVA AI: Failed to load ${scriptName}`);
            document.body.appendChild(scriptEl);
        } else {
            console.log('NOVA AI: All modules loaded successfully!');
        }
    }

    loadNextScript();
})();
