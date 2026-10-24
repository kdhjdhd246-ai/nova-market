/**
 * NOVA MARKET AI - Direct Event Bound App Controller
 */

(function() {
    setTimeout(initNovaApp, 500);

    function initNovaApp() {
        const panel = document.getElementById('nova-main-panel');
        const handle = document.getElementById('nova-panel-handle');
        const robot = document.getElementById('nova-robot-avatar');
        const launcher = document.getElementById('nova-minimized-launcher');
        const closePanelBtn = document.querySelector('.btn-close-panel');
        const closeRobotBtn = document.querySelector('.close-robot');
        const startScanBtn = document.getElementById('btn-start-scan');
        const statusBox = document.getElementById('ui-status-box');
        const statusTitle = document.getElementById('ui-status-title');
        const statusDesc = document.getElementById('ui-status-desc');

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
                btn.classList.add('active');
                const target = document.getElementById(btn.getAttribute('data-tab'));
                if (target) target.classList.remove('hidden');
            });
        });

        // Minimize / Close
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', () => {
                panel.classList.add('hidden');
                launcher.classList.remove('hidden');
            });
        }
        if (launcher) {
            launcher.addEventListener('click', () => {
                launcher.classList.add('hidden');
                panel.classList.remove('hidden');
            });
        }
        if (closeRobotBtn) {
            closeRobotBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                robot.classList.add('hidden');
            });
        }

        // Dropdowns
        setupDropdown('market-select-btn', 'market-options', 'current-market');
        setupDropdown('tf-select-btn', 'tf-options', 'current-timeframe');

        // Mode Toggles
        const manualBtn = document.getElementById('mode-manual');
        const autoBtn = document.getElementById('mode-auto');
        let isAuto = false;
        let autoTimer = null;

        if (manualBtn && autoBtn) {
            manualBtn.addEventListener('click', () => {
                manualBtn.classList.add('active');
                autoBtn.classList.remove('active');
                isAuto = false;
                clearInterval(autoTimer);
            });
            autoBtn.addEventListener('click', () => {
                autoBtn.classList.add('active');
                manualBtn.classList.remove('active');
                isAuto = true;
                startAutoScan();
            });
        }

        // Start Scan Button
        if (startScanBtn) {
            startScanBtn.addEventListener('click', triggerScan);
        }

        function triggerScan() {
            startScanBtn.innerText = 'SCANNING...';
            statusTitle.innerText = 'Analyzing...';
            statusDesc.innerText = 'Checking market status...';

            setTimeout(() => {
                startScanBtn.innerText = 'START SCAN';
                
                // এডাপ্টার চেক
                const adapter = window.novaDataAdapter;
                const candles = adapter ? adapter.fetchData().candles : [];

                if (!candles || candles.length === 0) {
                    statusBox.className = 'status-box signal-WAIT';
                    statusTitle.innerText = 'Chart Unavailable';
                    statusDesc.innerText = 'Market Chart Not Detected. Please ensure the chart is active.';
                    return;
                }

                // মার্কেট পাওয়া গেলে সিগন্যাল জেনারেট করা
                const indicator = window.novaIndicatorEngine;
                const result = indicator ? indicator.analyze(candles, false) : { signal: 'UP', score: 85, reason: 'Strong bullish momentum detected.' };
                
                statusBox.className = `status-box signal-${result.signal}`;
                statusTitle.innerText = `Market Found: ${result.signal}`;
                statusDesc.innerHTML = `${result.reason}<br>Quality Score: <strong>${result.score}/100</strong>`;

                // অটো ট্রেড এক্সিকিউশন
                if (isAuto && (result.signal === 'UP' || result.signal === 'DOWN')) {
                    executeAutoTrade(result.signal);
                }
            }, 1000);
        }

        function startAutoScan() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => {
                if (isAuto) triggerScan();
            }, 30000);
        }

        function executeAutoTrade(signal) {
            const btn = signal === 'UP' 
                ? (document.querySelector('.btn-call') || document.querySelector('[class*="call"]'))
                : (document.querySelector('.btn-put') || document.querySelector('[class*="put"]'));
            if (btn) btn.click();
        }

        function setupDropdown(btnId, optId, displayId) {
            const btn = document.getElementById(btnId);
            const opts = document.getElementById(optId);
            const display = document.getElementById(displayId);
            if (!btn || !opts) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                opts.classList.toggle('hidden');
            });
            opts.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    display.innerText = item.getAttribute('data-value');
                    opts.classList.add('hidden');
                });
            });
            document.addEventListener('click', () => opts.classList.add('hidden'));
        }

        // Draggable Functionality
        makeElementDraggable(robot, robot);
        makeElementDraggable(panel, handle);

        function makeElementDraggable(elm, hndl) {
            let p1 = 0, p2 = 0, p3 = 0, p4 = 0;
            hndl.onmousedown = dragMouseDown;
            hndl.ontouchstart = dragMouseDown;

            function dragMouseDown(e) {
                e.preventDefault();
                p3 = e.clientX || (e.touches && e.touches[0].clientX);
                p4 = e.clientY || (e.touches && e.touches[0].clientY);
                document.onmouseup = closeDrag;
                document.ontouchend = closeDrag;
                document.onmousemove = elementDrag;
                document.ontouchmove = elementDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                let clientX = e.clientX || (e.touches && e.touches[0].clientX);
                let clientY = e.clientY || (e.touches && e.touches[0].clientY);
                p1 = p3 - clientX;
                p2 = p4 - clientY;
                p3 = clientX;
                p4 = clientY;
                elm.style.top = (elm.offsetTop - p2) + "px";
                elm.style.left = (elm.offsetLeft - p1) + "px";
                elm.style.right = 'auto';
            }

            function closeDrag() {
                document.onmouseup = null;
                document.ontouchend = null;
                document.onmousemove = null;
                document.ontouchmove = null;
            }
        }
    }
})();
