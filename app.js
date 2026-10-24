/**
 * NOVA MARKET AI - Advanced UI Controller & Trading Engine v4.0
 * Optimized for maximum stability, fast DOM interaction, and auto-execution.
 */

class NovaUIController {
    constructor() {
        this.selectors = {
            robot: 'nova-robot-avatar',
            panel: 'nova-main-panel',
            launcher: 'nova-minimized-launcher',
            handle: 'nova-panel-handle',
            closePanel: '.btn-close-panel',
            closeRobot: '.close-robot',
            startScan: 'btn-start-scan',
            statusBox: 'ui-status-box',
            statusRing: 'ui-status-ring',
            statusTitle: 'ui-status-title',
            statusDesc: 'ui-status-desc',
            tabs: '.tab-btn',
            tabPanes: '.tab-pane',
            historyList: 'history-list-container',
            historyCount: 'history-count',
            clearHistory: 'btn-clear-history',
            exportHistory: 'btn-export-history',
            threshold: 'setting-threshold',
            valThreshold: 'val-threshold',
            interval: 'setting-interval',
            resetApp: 'btn-reset-app',
            manualMode: 'mode-manual',
            autoMode: 'mode-auto',
            marketBtn: 'market-select-btn',
            marketOpts: 'market-options',
            currentMarket: 'current-market',
            tfBtn: 'tf-select-btn',
            tfOpts: 'tf-options',
            currentTf: 'current-timeframe'
        };

        this.state = {
            isAutoRepeat: false,
            autoScanTimer: null,
            isScanning: false
        };

        this.initEngines();
        this.initDOMReferences();
        this.init();
    }

    initEngines() {
        this.scanner = typeof NovaScannerEngine !== 'undefined' ? new NovaScannerEngine() : null;
        this.indicator = window.novaIndicatorEngine || null;
        this.history = window.novaHistoryManager || null;
        this.settings = window.novaSettingsManager || null;
        this.adapter = window.novaDataAdapter || null;
    }

    initDOMReferences() {
        for (let key in this.selectors) {
            const selector = this.selectors[key];
            this[key] = selector.startsWith('.') || selector.startsWith('#') 
                ? document.querySelector(selector) 
                : document.getElementById(selector);
        }
        this.tabBtns = document.querySelectorAll(this.selectors.tabs);
        this.tabPanes = document.querySelectorAll(this.selectors.tabPanes);
    }

    init() {
        if (!this.panel) return;
        this.makeDraggable(this.robot, this.robot, 'nova_robot_pos');
        this.makeDraggable(this.panel, this.handle, 'nova_panel_pos');
        this.bindEvents();
        this.loadSavedState();
        this.initSettingsUI();
        this.renderHistory();
        console.log("NOVA AI: Advanced Controller Initialized Successfully.");
    }

    bindEvents() {
        try {
            if (this.closePanel) {
                this.closePanel.addEventListener('click', () => {
                    this.panel.classList.add('hidden');
                    if (this.launcher) this.launcher.classList.remove('hidden');
                    localStorage.setItem('nova_panel_state', 'minimized');
                    this.stopAutoRepeat();
                });
            }

            if (this.closeRobot && this.robot) {
                this.closeRobot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.robot.classList.add('hidden');
                    localStorage.setItem('nova_robot_state', 'closed');
                });
            }

            if (this.launcher && this.panel) {
                this.launcher.addEventListener('click', () => {
                    this.launcher.classList.add('hidden');
                    this.panel.classList.remove('hidden');
                    localStorage.setItem('nova_panel_state', 'open');
                });
            }

            window.addEventListener('resize', () => {
                this.enforceBoundaries(this.robot);
                this.enforceBoundaries(this.panel);
            });

            this.tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.tabBtns.forEach(b => b.classList.remove('active'));
                    this.tabPanes.forEach(p => p.classList.add('hidden'));
                    btn.classList.add('active');
                    const target = document.getElementById(btn.getAttribute('data-tab'));
                    if (target) target.classList.remove('hidden');
                });
            });

            this.setupDropdown(this.marketBtn, this.marketOpts, this.currentMarket);
            this.setupDropdown(this.tfBtn, this.tfOpts, this.currentTf, true);

            if (this.manualMode && this.autoMode) {
                this.manualMode.addEventListener('click', () => {
                    this.manualMode.classList.add('active');
                    this.autoMode.classList.remove('active');
                    this.state.isAutoRepeat = false;
                    this.stopAutoRepeat();
                });

                this.autoMode.addEventListener('click', () => {
                    this.autoMode.classList.add('active');
                    this.manualMode.classList.remove('active');
                    this.state.isAutoRepeat = true;
                    this.startAutoRepeat();
                });
            }

            if (this.startScan) {
                this.startScan.addEventListener('click', () => this.handleScanTrigger());
            }

            if (this.clearHistory) {
                this.clearHistory.addEventListener('click', () => {
                    if (confirm("Clear all scan history?")) {
                        if (this.history) this.history.clearHistory();
                        this.renderHistory();
                    }
                });
            }

            if (this.exportHistory) {
                this.exportHistory.addEventListener('click', () => {
                    if (this.history) this.history.exportToCSV();
                });
            }

            if (this.settings) {
                if (this.threshold) {
                    this.threshold.addEventListener('input', (e) => {
                        const val = e.target.value;
                        if (this.valThreshold) this.valThreshold.innerText = val;
                        this.settings.updateSetting('threshold', parseInt(val));
                    });
                }
                if (this.interval) {
                    this.interval.addEventListener('change', (e) => {
                        this.settings.updateSetting('autoScanInterval', parseInt(e.target.value));
                        if (this.state.isAutoRepeat) this.restartAutoRepeat();
                    });
                }
                if (this.resetApp) {
                    this.resetApp.addEventListener('click', () => this.settings.resetAll());
                }
            }
        } catch (e) {
            console.error("NOVA AI Event Binding Error:", e);
        }
    }

    setupDropdown(btn, opts, displayEl, isTimeframe = false) {
        if (!btn || !opts) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            opts.classList.toggle('hidden');
        });
        opts.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.getAttribute('data-value');
                if (displayEl) {
                    displayEl.innerHTML = isTimeframe 
                        ? `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>${val}</span>`
                        : `<span>${val}</span>`;
                }
                opts.classList.add('hidden');
            });
        });
        document.addEventListener('click', () => opts.classList.add('hidden'));
    }

    initSettingsUI() {
        if (!this.settings) return;
        const thres = this.settings.get('threshold');
        const interv = this.settings.get('autoScanInterval');
        if (this.threshold) this.threshold.value = thres;
        if (this.valThreshold) this.valThreshold.innerText = thres;
        if (this.interval) this.interval.value = interv.toString();
    }

    startAutoRepeat() {
        this.stopAutoRepeat();
        const intervalMs = this.settings ? this.settings.get('autoScanInterval') : 30000;
        this.autoScanTimer = setInterval(() => {
            if (!this.state.isScanning && this.state.isAutoRepeat) {
                this.handleScanTrigger();
            }
        }, intervalMs);
    }

    stopAutoRepeat() {
        if (this.autoScanTimer) {
            clearInterval(this.autoScanTimer);
            this.autoScanTimer = null;
        }
    }

    restartAutoRepeat() {
        this.stopAutoRepeat();
        this.startAutoRepeat();
    }

    handleScanTrigger() {
        if (this.state.isScanning) return;
        this.state.isScanning = true;

        if (this.statusBox) this.statusBox.className = 'status-box';
        if (this.startScan) {
            this.startScan.classList.add('scanning');
            const span = this.startScan.querySelector('span');
            if (span) span.innerText = 'SCANNING...';
        }
        if (this.statusRing) this.statusRing.className = 'status-ring scanning';
        if (this.statusTitle) {
            this.statusTitle.innerText = 'Scanning Market...';
            this.statusTitle.style.color = 'var(--text-main)';
        }
        if (this.statusDesc) this.statusDesc.innerHTML = 'Detecting active price candles...';

        setTimeout(() => {
            if (this.startScan) {
                this.startScan.classList.remove('scanning');
                const span = this.startScan.querySelector('span');
                if (span) span.innerText = 'START SCAN';
            }
            this.state.isScanning = false;

            if (!this.adapter || !this.indicator) {
                this.updateUIWithResult({ signal: 'WAIT', score: 0, reason: 'Chart Unavailable: Core modules missing.' });
                return;
            }

            const marketData = this.adapter.fetchData();
            const candles = marketData.candles;

            if (!candles || candles.length === 0) {
                this.updateUIWithResult({
                    signal: 'WAIT',
                    score: 0,
                    reason: 'Chart Unavailable: Please open a valid trading asset chart.'
                });
                return;
            }

            const analysisResult = this.indicator.analyze(candles, false);
            const selMarket = this.currentMarket ? this.currentMarket.innerText.trim() : "EUR/USD";
            const tfSpan = this.currentTf ? this.currentTf.querySelector('span') : null;
            const selTf = tfSpan ? tfSpan.innerText.trim() : "1 minute";

            analysisResult.symbol = (marketData.symbol && marketData.symbol !== 'UNKNOWN') ? marketData.symbol : selMarket;
            analysisResult.timeframe = selTf;
            analysisResult.reason = `Market Found! Analyzing... ${analysisResult.reason}`;

            if (this.history) {
                this.history.addScan(analysisResult);
                this.renderHistory();
            }

            this.updateUIWithResult(analysisResult);

            if (this.state.isAutoRepeat && (analysisResult.signal === 'UP' || analysisResult.signal === 'DOWN')) {
                this.executeAutoTrade(analysisResult.signal);
            }
        }, 800);
    }

    executeAutoTrade(signal) {
        try {
            let targetBtn = null;
            if (signal === 'UP') {
                targetBtn = document.querySelector('.btn-call') || document.querySelector('.higher-deal') || document.querySelector('[class*="call"]');
            } else if (signal === 'DOWN') {
                targetBtn = document.querySelector('.btn-put') || document.querySelector('.lower-deal') || document.querySelector('[class*="put"]');
            }

            if (targetBtn) {
                targetBtn.click();
                console.log(`NOVA AI: Auto Trade Executed -> ${signal}`);
            } else {
                console.warn("NOVA AI: Auto Trade target button not found on page.");
            }
        } catch (e) {
            console.error("NOVA AI Auto Trade Execution Error:", e);
        }
    }

    updateUIWithResult(result) {
        let displaySignal = result.signal;
        let userThreshold = this.settings ? this.settings.get('threshold') : 75;
        
        if ((displaySignal === 'UP' || displaySignal === 'DOWN') && result.score < userThreshold) {
            displaySignal = 'WAIT';
            result.reason = `Signal blocked: Quality score (${result.score}) is below threshold (${userThreshold}).`;
        }

        if (this.statusBox) this.statusBox.className = `status-box signal-${displaySignal}`;
        if (this.statusRing) this.statusRing.className = 'status-ring';
        if (this.statusTitle) this.statusTitle.innerHTML = displaySignal;

        let details = result.reason;
        if (result.indicators && result.score > 0) {
            details += `<br><div class="quality-badge">Quality: <strong>${result.score}/100</strong> | RSI: ${result.indicators.rsi.toFixed(1)}</div>`;
        }
        if (this.statusDesc) this.statusDesc.innerHTML = details;
    }

    renderHistory() {
        if (!this.history || !this.historyList) return;
        const data = this.history.getHistory();
        if (this.historyCount) this.historyCount.innerText = `${data.length} Scans`;

        if (data.length === 0) {
            this.historyList.innerHTML = `<div class="empty-state">No scan history available.</div>`;
            return;
        }

        this.historyList.innerHTML = data.map(item => {
            const timeStr = new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            return `
                <div class="history-item">
                    <div class="hist-left">
                        <span class="hist-time">${timeStr}</span>
                        <span class="hist-pair">${item.symbol} • ${item.timeframe}</span>
                    </div>
                    <div class="hist-right">
                        <span class="hist-signal hist-${item.signal}">${item.signal}</span>
                        <span class="hist-score">Score: ${item.score}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    makeDraggable(element, handle, storageKey) {
        if (!element || !handle) return;
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = (e) => {
            if (['BUTTON', 'INPUT', 'SVG', 'PATH', 'SPAN', 'DIV'].includes(e.target.tagName.toUpperCase())) {
                if (!e.target.closest('.panel-header') && !e.target.closest('.nova-robot-container')) return;
            }
            e.preventDefault();
            pos3 = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            pos4 = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('touchend', closeDragElement, { passive: false });
            document.addEventListener('touchmove', elementDrag, { passive: false });
        };

        const elementDrag = (e) => {
            e.preventDefault();
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        };

        const closeDragElement = () => {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('touchend', closeDragElement);
            document.removeEventListener('touchmove', elementDrag);
            localStorage.setItem(storageKey, JSON.stringify({ top: element.style.top, left: element.style.left }));
        };

        handle.addEventListener('mousedown', dragMouseDown);
        handle.addEventListener('touchstart', dragMouseDown, { passive: false });
    }

    enforceBoundaries(element) {
        if (!element || element.classList.contains('hidden')) return;
        const rect = element.getBoundingClientRect();
        if (rect.right > window.innerWidth) element.style.left = (window.innerWidth - rect.width) + 'px';
        if (rect.bottom > window.innerHeight) element.style.top = (window.innerHeight - rect.height) + 'px';
    }

    loadSavedState() {
        try {
            const panelPos = JSON.parse(localStorage.getItem('nova_panel_pos'));
            if (panelPos && this.panel) { this.panel.style.top = panelPos.top; this.panel.style.left = panelPos.left; this.panel.style.right = 'auto'; }
            const robotPos = JSON.parse(localStorage.getItem('nova_robot_pos'));
            if (robotPos && this.robot) { this.robot.style.top = robotPos.top; this.robot.style.left = robotPos.left; this.robot.style.right = 'auto'; }
            if (localStorage.getItem('nova_panel_state') === 'minimized' && this.panel && this.launcher) { 
                this.panel.classList.add('hidden'); 
                this.launcher.classList.remove('hidden'); 
            }
            if (localStorage.getItem('nova_robot_state') === 'closed' && this.robot) { 
                this.robot.classList.add('hidden'); 
            }
            this.enforceBoundaries(this.panel);
            this.enforceBoundaries(this.robot);
        } catch (e) {
            console.error("NOVA AI State Error:", e);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => { window.novaApp = new NovaUIController(); });
