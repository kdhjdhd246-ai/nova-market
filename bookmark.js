/**
 * NOVA MARKET AI - Final Stable Bookmarklet Injector
 */
(function() {
    const BASE_URL = 'https://kdhjdhd246-ai.github.io/nova-market';

    if (document.getElementById('nova-ai-overlay')) {
        alert('NOVA MARKET AI is already active!');
        return;
    }

    // CSS লোড করা
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `${BASE_URL}/style.css?v=` + Date.now();
    document.head.appendChild(styleLink);

    // মূল HTML স্ট্রাকচার তৈরি করা
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'nova-ai-overlay';
    overlayContainer.innerHTML = `
        <div id="nova-scanner-overlay" class="hidden">
            <div class="scan-backdrop"></div>
            <div class="radar-container">
                <div class="radar-ring ring-1"></div>
                <div class="radar-ring ring-2"></div>
                <div class="radar-ring ring-3"></div>
                <div class="radar-crosshair"></div>
                <div class="laser-beam"></div>
            </div>
            <div class="scan-progress-box">
                <div class="scan-text">SCANNING...</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="scan-progress-fill"></div>
                </div>
            </div>
        </div>
        
        <div class="nova-robot-container" id="nova-robot-avatar">
            <div class="drag-tooltip">Drag to move</div>
            <div class="robot-circle">
                <div class="robot-face">
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                    <div class="mouth"></div>
                </div>
                <div class="badge-n">N</div>
            </div>
            <button class="close-robot">×</button>
        </div>

        <div class="nova-panel" id="nova-main-panel">
            <div class="panel-header" id="nova-panel-handle">
                <div class="header-left">
                    <div class="logo-circle">N</div>
                    <div class="header-titles">
                        <h2>NOVA MARKET AI</h2>
                        <p>Smart Scanner & Auto Trade</p>
                    </div>
                </div>
                <button class="btn-close-panel">×</button>
            </div>

            <div class="panel-tabs">
                <button class="tab-btn active" data-tab="tab-scan">Scan</button>
                <button class="tab-btn" data-tab="tab-history">History</button>
                <button class="tab-btn" data-tab="tab-settings">Settings</button>
            </div>

            <div class="panel-content">
                <div id="tab-scan" class="tab-pane active">
                    <div class="input-section">
                        <label>Market</label>
                        <div class="custom-select-wrapper">
                            <div class="custom-select" id="market-select-btn">
                                <div class="select-value" id="current-market"><span>EUR/USD (Auto / Any)</span></div>
                            </div>
                            <div class="dropdown-options hidden" id="market-options">
                                <div class="option-item" data-value="EUR/USD">EUR/USD</div>
                                <div class="option-item" data-value="GBP/USD">GBP/USD</div>
                                <div class="option-item" data-value="AUD/USD">AUD/USD</div>
                                <div class="option-item" data-value="USD/JPY">USD/JPY</div>
                            </div>
                        </div>
                    </div>

                    <div class="input-section">
                        <label>Timeframe</label>
                        <div class="custom-select-wrapper">
                            <div class="custom-select" id="tf-select-btn">
                                <div class="select-value" id="current-timeframe"><span>1 minute</span></div>
                            </div>
                            <div class="dropdown-options hidden" id="tf-options">
                                <div class="option-item" data-value="10 seconds">10 seconds</div>
                                <div class="option-item" data-value="15 seconds">15 seconds</div>
                                <div class="option-item" data-value="30 seconds">30 seconds</div>
                                <div class="option-item" data-value="1 minute">1 minute</div>
                            </div>
                        </div>
                    </div>

                    <button class="btn-start-scan" id="btn-start-scan"><span>START SCAN</span></button>

                    <div class="input-section mt-15">
                        <label>Scan Mode</label>
                        <div class="mode-toggle">
                            <button class="mode-btn active" id="mode-manual">Manual</button>
                            <button class="mode-btn" id="mode-auto">Auto Repeat</button>
                        </div>
                    </div>

                    <div class="status-box" id="ui-status-box">
                        <div class="status-ring" id="ui-status-ring"><div class="ring-inner"></div></div>
                        <div class="status-text">
                            <h3 id="ui-status-title">Ready to scan</h3>
                            <p id="ui-status-desc">Click START SCAN to begin</p>
                        </div>
                    </div>
                </div>

                <div id="tab-history" class="tab-pane hidden">
                    <div class="history-actions">
                        <span class="history-count" id="history-count">0 Scans</span>
                        <button class="btn-small" id="btn-clear-history">Clear</button>
                    </div>
                    <div class="history-list" id="history-list-container">
                        <div class="empty-state">No history.</div>
                    </div>
                </div>

                <div id="tab-settings" class="tab-pane hidden">
                    <div class="input-section">
                        <label>Quality Score <span id="val-threshold">75</span></label>
                        <input type="range" id="setting-threshold" min="50" max="95" value="75" style="width:100%;">
                    </div>
                    <div class="input-section mt-15">
                        <label>Auto Interval</label>
                        <select id="setting-interval" class="styled-select" style="width:100%; padding:8px; background:#070c19; color:#fff; border:1px solid rgba(255,255,255,0.2);">
                            <option value="15000">15 Seconds</option>
                            <option value="30000" selected>30 Seconds</option>
                            <option value="60000">1 Minute</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="nova-minimized hidden" id="nova-minimized-launcher">
            <div class="mini-robot-avatar"></div>
            <div class="minimized-text"><h4>NOVA</h4><p>Open</p></div>
        </div>
    `;
    document.body.appendChild(overlayContainer);

    // মডিউলগুলো সিকোয়েন্স অনুযায়ী লোড করা
    const scripts = ['data-adapter.js', 'indicator-engine.js', 'scanner-engine.js', 'settings-manager.js', 'history-manager.js', 'app.js'];
    let idx = 0;
    function loadScript() {
        if (idx < scripts.length) {
            const sc = document.createElement('script');
            sc.src = `${BASE_URL}/${scripts[idx++]}?v=` + Date.now();
            sc.onload = loadScript;
            document.body.appendChild(sc);
        }
    }
    loadScript();
})();
