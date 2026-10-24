/**
 * NOVA MARKET AI - Main UI Controller
 */

class NovaUIController {
    constructor() {
        this.robotAvatar = document.getElementById('nova-robot-avatar');
        this.mainPanel = document.getElementById('nova-main-panel');
        this.minimizedLauncher = document.getElementById('nova-minimized-launcher');
        this.panelHandle = document.getElementById('nova-panel-handle');
        this.closePanelBtn = document.querySelector('.btn-close-panel');
        this.closeRobotBtn = document.querySelector('.close-robot');
        this.startScanBtn = document.getElementById('btn-start-scan');
        
        this.statusBox = document.getElementById('ui-status-box');
        this.statusRing = document.getElementById('ui-status-ring');
        this.statusTitle = document.getElementById('ui-status-title');
        this.statusDesc = document.getElementById('ui-status-desc');

        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');

        this.historyList = document.getElementById('history-list-container');
        this.historyCount = document.getElementById('history-count');
        this.btnClearHistory = document.getElementById('btn-clear-history');
        this.btnExportHistory = document.getElementById('btn-export-history');

        this.inputThreshold = document.getElementById('setting-threshold');
        this.valThreshold = document.getElementById('val-threshold');
        this.inputInterval = document.getElementById('setting-interval');
        this.btnResetApp = document.getElementById('btn-reset-app');

        // Mode toggles
        this.modeManualBtn = document.getElementById('mode-manual');
        this.modeAutoBtn = document.getElementById('mode-auto');
        this.isAutoRepeat = false;
        this.autoScanTimer = null;

        // Dropdowns
        this.marketSelectBtn = document.getElementById('market-select-btn');
        this.marketOptions = document.getElementById('market-options');
        this.currentMarketEl = document.getElementById('current-market');

        this.tfSelectBtn = document.getElementById('tf-select-btn');
        this.tfOptions = document.getElementById('tf-options');
        this.currentTimeframeEl = document.getElementById('current-timeframe');

        // Engines
        this.scanner = typeof NovaScannerEngine !== 'undefined' ? new NovaScannerEngine() : null;
        this.indicator = window.novaIndicatorEngine || null;
        this.history = window.novaHistoryManager || null;
        this.settings = window.novaSettingsManager || null;
        this.adapter = window.novaDataAdapter || null;

        this.init();
    }

    init() {
        if (!this.mainPanel) return;
        this.makeDraggable(this.robotAvatar, this.robotAvatar, 'nova_robot_pos');
        this.makeDraggable(this.mainPanel, this.panelHandle, 'nova_panel_pos');
        this.bindEvents();
        this.loadSavedState();
        
        this.initSettingsUI();
        this.renderHistory();
    }

    bindEvents() {
        this.closePanelBtn.addEventListener('click', () => {
            this.mainPanel.classList.add('hidden');
            this.minimizedLauncher.classList.remove('hidden');
            localStorage.setItem('nova_panel_state', 'minimized');
            this.stopAutoRepeat();
        });

        this.closeRobotBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.robotAvatar.classList.add('hidden');
            localStorage.setItem('nova_robot_state', 'closed');
        });

        this.minimizedLauncher.addEventListener('click', () => {
            this.minimizedLauncher.classList.add('hidden');
            this.mainPanel.classList.remove('hidden');
            localStorage.setItem('nova_panel_state', 'open');
        });

        window.addEventListener('resize', () => {
            this.enforceBoundaries(this.robotAvatar);
            this.enforceBoundaries(this.mainPanel);
        });

        // Tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.tabBtns.forEach(b => b.classList.remove('active'));
                this.tabPanes.forEach(p => p.classList.add('hidden'));
                btn.classList.add('active');
                document.getElementById(btn.getAttribute('data-tab')).classList.remove('hidden');
            });
        });

        // Market Dropdown Toggle
        if (this.marketSelectBtn && this.marketOptions) {
            this.marketSelectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.marketOptions.classList.toggle('hidden');
                if (this.tfOptions) this.tfOptions.classList.add('hidden');
            });
            this.marketOptions.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = item.getAttribute('data-value');
                    this.currentMarketEl.innerHTML = `<span>${val}</span>`;
                    this.marketOptions.classList.add('hidden');
                });
            });
        }

        // Timeframe Dropdown Toggle
        if (this.tfSelectBtn && this.tfOptions) {
            this.tfSelectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.tfOptions.classList.toggle('hidden');
                if (this.marketOptions) this.marketOptions.classList.add('hidden');
            });
            this.tfOptions.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = item.getAttribute('data-value');
                    this.currentTimeframeEl.innerHTML = `
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span>${val}</span>
                    `;
                    this.tfOptions.classList.add('hidden');
                });
            });
        }

        document.addEventListener('click', () => {
            if (this.marketOptions) this.marketOptions.classList.add('hidden');
            if (this.tfOptions) this.tfOptions.classList.add('hidden');
        });

        // Scan Modes
        if (this.modeManualBtn && this.modeAutoBtn) {
            this.modeManualBtn.addEventListener('click', () => {
                this.modeManualBtn.classList.add('active');
                this.modeAutoBtn.classList.remove('active');
                this.isAutoRepeat = false;
                this.stopAutoRepeat();
            });

            this.modeAutoBtn.addEventListener('click', () => {
                this.modeAutoBtn.classList.add('active');
                this.modeManualBtn.classList.remove('active');
                this.isAutoRepeat = true;
                this.startAutoRepeat();
            });
        }

        if (this.startScanBtn && this.scanner) {
            this.startScanBtn.addEventListener('click', () => this.handleScanTrigger());
        }

        if (this.btnClearHistory && this.history) {
            this.btnClearHistory.addEventListener('click', () => {
                if(confirm("Clear all scan history?")) {
                    this.history.clearHistory();
                    this.renderHistory();
                }
            });
        }

        if (this.btnExportHistory && this.history) {
            this.btnExportHistory.addEventListener('click', () => this.history.exportToCSV());
        }

        if (this.settings) {
            this.inputThreshold.addEventListener('input', (e) => {
                const val = e.target.value;
                this.valThreshold.innerText = val;
                this.settings.updateSetting('threshold', parseInt(val));
            });
            this.inputInterval.addEventListener('change', (e) => {
                this.settings.updateSetting('autoScanInterval', parseInt(e.target.value));
                if (this.isAutoRepeat) {
                    this.restartAutoRepeat();
                }
            });
            this.btnResetApp.addEventListener('click', () => this.settings.resetAll());
        }
    }

    initSettingsUI() {
        if (!this.settings) return;
        const thres = this.settings.get('threshold');
        const interv = this.settings.get('autoScanInterval');
        this.inputThreshold.value = thres;
        this.valThreshold.innerText = thres;
        this.inputInterval.value = interv.toString();
    }

    startAutoRepeat() {
        this.stopAutoRepeat();
        const intervalMs = this.settings ? this.settings.get('autoScanInterval') : 30000;
        this.autoScanTimer = setInterval(() => {
            if (!this.scanner.isScanning && this.isAutoRepeat) {
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
        if (this.scanner.isScanning) return;

        this.statusBox.className = 'status-box';
        this.startScanBtn.classList.add('scanning');
        this.startScanBtn.querySelector('span').innerText = 'SCANNING...';
        this.statusRing.className = 'status-ring scanning';
        this.statusTitle.innerText = 'Scanning Market...';
        this.statusTitle.style.color = 'var(--text-main)';
        this.statusDesc.innerHTML = 'Searching for active price action...';

        this.scanner.startScan(() => {
            this.startScanBtn.classList.remove('scanning');
            this.startScanBtn.querySelector('span').innerText = 'START SCAN';
            
            if (!this.adapter || !this.indicator) {
                this.updateUIWithResult({ signal: 'WAIT', score: 0, reason: 'Market Not Found: System engines failed to load.', isDemo: false });
                return;
            }

            const marketData = this.adapter.fetchData();
            let candles = marketData.candles;

            // যদি প্ল্যাটফর্ম থেকে কোনো ক্যান্ডেল বা মার্কেট ডেটা না পাওয়া যায়
            if (!candles || candles.length === 0) {
                this.updateUIWithResult({
                    signal: 'WAIT',
                    score: 0,
                    reason: 'Market Not Found: Active market candles could not be detected on the page.',
                    isDemo: false
                });
                return;
            }

            // মার্কেট খুঁজে পেলে এনালাইসিস করে আপ বা ডাউন সিগন্যাল জেনারেট করবে
            const analysisResult = this.indicator.analyze(candles, false);
            
            const selectedMarket = this.currentMarketEl.innerText.trim();
            const selectedTf = this.currentTimeframeEl.querySelector('span') ? this.currentTimeframeEl.querySelector('span'].innerText.trim() : "1 minute";

            analysisResult.symbol = (marketData.symbol && marketData.symbol !== 'UNKNOWN') ? marketData.symbol : (selectedMarket || "EUR/USD");
            analysisResult.timeframe = selectedTf;
            
            if (this.history) {
                this.history.addScan(analysisResult);
                this.renderHistory();
            }
            this.updateUIWithResult(analysisResult);
        });
    }

    updateUIWithResult(result) {
        let displaySignal = result.signal;
        let userThreshold = this.settings ? this.settings.get('threshold') : 75;
        
        if ((displaySignal === 'UP' || displaySignal === 'DOWN') && result.score < userThreshold) {
            displaySignal = 'WAIT';
            result.reason = `Signal blocked: Quality score (${result.score}) is below your threshold (${userThreshold}).`;
        }

        this.statusBox.className = `status-box signal-${displaySignal.replace(/\s+/g, '')}`;
        this.statusRing.className = 'status-ring'; 

        this.statusTitle.innerHTML = `${displaySignal}`;

        let detailsHtml = `${result.reason}`;
        if (result.indicators && result.score > 0) {
            detailsHtml += `<br><div class="quality-badge">Quality: <strong>${result.score}/100</strong> | RSI: ${result.indicators.rsi.toFixed(1)}</div>`;
        }
        this.statusDesc.innerHTML = detailsHtml;
    }

    renderHistory() {
        if (!this.history || !this.historyList) return;
        const data = this.history.getHistory();
        this.historyCount.innerText = `${data.length} Scans`;

        if (data.length === 0) {
            this.historyList.innerHTML = `<div class="empty-state">No scan history available.</div>`;
            return;
        }

        this.historyList.innerHTML = data.map(item => {
            const timeStr = new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            let signalClass = `hist-${item.signal.replace(/\s+/g, '')}`;
            
            return `
                <div class="history-item">
                    <div class="hist-left">
                        <span class="hist-time">${timeStr}</span>
                        <span class="hist-pair">${item.symbol} • ${item.timeframe}</span>
                    </div>
                    <div class="hist-right">
                        <span class="hist-signal ${signalClass}">${item.signal}</span>
                        <span class="hist-score">Score: ${item.score}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    makeDraggable(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const dragMouseDown = (e) => {
            if (['BUTTON', 'INPUT', 'SVG', 'PATH', 'SPAN', 'DIV'].includes(e.target.tagName.toUpperCase())) {
                if(!e.target.closest('.panel-header')) return; 
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
            pos1 = pos3 - clientX; pos2 = pos4 - clientY; pos3 = clientX; pos4 = clientY;
            let newTop = element.offsetTop - pos2; let newLeft = element.offsetLeft - pos1;
            const maxLeft = window.innerWidth - element.offsetWidth; const maxTop = window.innerHeight - element.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, maxLeft)); newTop = Math.max(0, Math.min(newTop, maxTop));
            element.style.top = newTop + "px"; element.style.left = newLeft + "px"; element.style.right = 'auto'; element.style.bottom = 'auto';
        };
        const closeDragElement = () => {
            document.removeEventListener('mouseup', closeDragElement); document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('touchend', closeDragElement); document.removeEventListener('touchmove', elementDrag);
            localStorage.setItem(storageKey, JSON.stringify({ top: element.style.top, left: element.style.left }));
        };
        handle.addEventListener('mousedown', dragMouseDown);
        handle.addEventListener('touchstart', dragMouseDown, { passive: false });
    }

    enforceBoundaries(element) {
        if(element.classList.contains('hidden')) return;
        const rect = element.getBoundingClientRect();
        if (rect.right > window.innerWidth) element.style.left = (window.innerWidth - rect.width) + 'px';
        if (rect.bottom > window.innerHeight) element.style.top = (window.innerHeight - rect.height) + 'px';
    }

    loadSavedState() {
        try {
            const panelPos = JSON.parse(localStorage.getItem('nova_panel_pos'));
            if (panelPos) { this.mainPanel.style.top = panelPos.top; this.mainPanel.style.left = panelPos.left; this.mainPanel.style.right = 'auto'; }
            const robotPos = JSON.parse(localStorage.getItem('nova_robot_pos'));
            if (robotPos) { this.robotAvatar.style.top = robotPos.top; this.robotAvatar.style.left = robotPos.left; this.robotAvatar.style.right = 'auto'; }
            if (localStorage.getItem('nova_panel_state') === 'minimized') { this.mainPanel.classList.add('hidden'); this.minimizedLauncher.classList.remove('hidden'); }
            if (localStorage.getItem('nova_robot_state') === 'closed') { this.robotAvatar.classList.add('hidden'); }
            this.enforceBoundaries(this.mainPanel); this.enforceBoundaries(this.robotAvatar);
        } catch (e) { console.error("NOVA AI State Error:", e); }
    }
}

document.addEventListener('DOMContentLoaded', () => { window.novaApp = new NovaUIController(); });
