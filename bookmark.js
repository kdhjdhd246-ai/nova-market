/**
 * NOVA MARKET AI - Cyber Theme with Auto-Minimize, Auto-Expand, Sound Effects & Smart Martingale
 */
(function() {
    if (document.getElementById('nova-ai-overlay')) {
        alert('NOVA MARKET AI is already active!');
        return;
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playSound(type) {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'signal') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'win') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.15);
            osc.frequency.setValueAtTime(783.99, now + 0.3);
            osc.frequency.setValueAtTime(1046.50, now + 0.45);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
            osc.start(now);
            osc.stop(now + 0.7);
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root { --neon-blue: #00e5ff; --deep-blue: #0055ff; --bg-panel: linear-gradient(145deg, rgba(8, 15, 35, 0.95), rgba(4, 8, 20, 0.95)); --text-muted: #8496ae; }
        #nova-ai-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 999999; font-family: 'Inter', sans-serif; color: #fff; }
        #nova-robot-avatar, #nova-main-panel, #nova-minimized-launcher, #nova-win-popup { pointer-events: auto !important; z-index: 1000000; position: absolute; user-select: none; }
        
        .nova-robot-container { position: absolute; top: 20px; right: 30px; display: flex; align-items: center; gap: 10px; cursor: grab; }
        .robot-circle { width: 50px; height: 50px; border-radius: 50%; background: #040a18; border: 2px solid var(--neon-blue); display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px rgba(0,229,255,0.3); }
        .robot-face { width: 24px; height: 16px; position: relative; }
        .robot-face .eye { width: 6px; height: 6px; background: var(--neon-blue); border-radius: 50%; position: absolute; top: 0; box-shadow: 0 0 5px var(--neon-blue); }
        .robot-face .eye.left { left: 2px; } .robot-face .eye.right { right: 2px; }
        .robot-face .mouth { width: 10px; height: 2px; background: var(--neon-blue); position: absolute; bottom: 2px; left: 7px; }
        .close-robot { background: rgba(0,0,0,0.5); color: var(--neon-blue); border: 1px solid var(--neon-blue); border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; }
        
        .nova-panel { position: absolute; top: 80px; right: 30px; width: 340px; background: var(--bg-panel); backdrop-filter: blur(15px); border: 1px solid rgba(0, 229, 255, 0.4); border-radius: 16px; box-shadow: 0 0 30px rgba(0,85,255,0.4); display: flex; flex-direction: column; overflow: hidden; transition: 0.3s; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid rgba(0,229,255,0.2); cursor: grab; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo-circle { width: 32px; height: 32px; background: var(--neon-blue); color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 800; font-size: 16px; box-shadow: 0 0 15px var(--neon-blue); }
        .header-titles h2 { font-size: 15px; font-weight: 700; margin: 0; text-shadow: 0 0 5px rgba(255,255,255,0.5); }
        .header-titles p { font-size: 11px; color: var(--text-muted); margin: 0; }
        .btn-close-panel { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 18px; }
        
        .panel-tabs { display: flex; padding: 12px 16px; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .tab-btn { flex: 1; display: flex; justify-content: center; gap: 6px; background: transparent; border: 1px solid transparent; color: var(--text-muted); padding: 8px 0; font-size: 12px; font-weight: 600; border-radius: 8px; cursor: pointer; }
        .tab-btn.active { background: rgba(0,85,255,0.2); border: 1px solid var(--neon-blue); color: var(--neon-blue); box-shadow: 0 0 10px rgba(0,229,255,0.2); }
        .panel-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
        .tab-pane.hidden { display: none !important; }
        
        .cyber-box { background: rgba(0,0,0,0.4); border: 1px solid rgba(0,229,255,0.15); border-radius: 8px; padding: 12px; position: relative; }
        .cyber-box label { font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .cyber-box input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,229,255,0.3); color: #fff; padding: 6px; border-radius: 4px; font-family: 'Inter'; outline: none; }
        .custom-select { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; cursor: pointer; }
        .dropdown-options { position: absolute; top: 100%; left: 0; right: 0; background: #060d1e; border: 1px solid var(--neon-blue); border-radius: 8px; z-index: 99; max-height: 120px; overflow-y: auto; }
        .option-item { padding: 10px 12px; font-size: 12px; cursor: pointer; }
        .option-item:hover { background: rgba(0,229,255,0.15); color: var(--neon-blue); }
        
        .scan-action-area { position: relative; display: flex; justify-content: center; align-items: center; padding: 20px 0; }
        .btn-start-scan { position: relative; z-index: 2; width: 85%; background: linear-gradient(90deg, #0055ff, #00e5ff); color: #fff; border: 1px solid var(--neon-blue); padding: 14px; border-radius: 4px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 0 20px rgba(0,229,255,0.5); clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%); }
        .btn-start-scan.scanning { background: rgba(0,85,255,0.3); pointer-events: none; border: 1px dashed var(--neon-blue); }
        
        .mode-toggle { display: flex; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 4px; border: 1px solid rgba(255,255,255,0.05); }
        .mode-btn { flex: 1; display: flex; justify-content: center; gap: 6px; background: none; border: none; color: var(--text-muted); padding: 10px 0; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; }
        .mode-btn.active { background: linear-gradient(90deg, rgba(0,85,255,0.5), rgba(0,229,255,0.5)); color: #fff; border: 1px solid var(--neon-blue); }
        
        .limit-inputs { display: flex; gap: 10px; margin-top: 10px; }
        .limit-box { flex: 1; background: rgba(0,0,0,0.3); border: 1px dashed rgba(0,229,255,0.3); border-radius: 6px; padding: 8px; text-align: center; }
        .limit-box label { font-size: 9px; color: var(--neon-blue); margin-bottom: 4px; display: block; }
        .limit-box input { width: 100%; background: transparent; border: none; color: #fff; text-align: center; font-size: 14px; font-weight: bold; outline: none; }
        
        .status-box { background: rgba(0,0,0,0.4); border: 1px solid rgba(0,229,255,0.3); border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 15px; position: relative; }
        .status-ring { width: 30px; height: 30px; border: 2px dashed var(--neon-blue); border-radius: 50%; display: flex; justify-content: center; align-items: center; }
        .status-ring::after { content: ''; width: 12px; height: 12px; background: var(--neon-blue); border-radius: 50%; }
        .status-text h3 { font-size: 13px; font-weight: 700; margin: 0 0 2px 0; color: #fff; }
        .status-text p { font-size: 10px; color: var(--text-muted); margin: 0; }
        
        .panel-footer { padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-logo { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--neon-blue); font-weight: 600; }
        .mini-dot { width: 8px; height: 8px; background: var(--neon-blue); border-radius: 50%; }

        .nova-minimized { position: absolute; bottom: 30px; right: 30px; background: rgba(8, 15, 35, 0.95); border: 1px solid var(--neon-blue); border-radius: 30px; padding: 8px 16px; display: flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 0 20px rgba(0,229,255,0.4); }
        .nova-minimized span { font-size: 12px; font-weight: bold; color: var(--neon-blue); }

        #nova-win-popup { position: fixed; top: 15%; left: 50%; transform: translateX(-50%) scale(0.8); background: linear-gradient(135deg, rgba(0,255,136,0.95), rgba(0,150,100,0.95)); border: 2px solid #fff; padding: 15px 35px; border-radius: 50px; text-align: center; box-shadow: 0 0 40px #00ff88; z-index: 1000005; animation: popWin 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        #nova-win-popup h2 { font-size: 18px; color: #000; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        #nova-win-popup p { font-size: 11px; color: #052b14; font-weight: bold; margin: 2px 0 0 0; }
        @keyframes popWin { 0% { transform: translateX(-50%) scale(0.5); opacity: 0; } 100% { transform: translateX(-50%) scale(1); opacity: 1; } }

        #nova-scanner-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; z-index: 1000001; pointer-events: auto; }
        .scan-backdrop { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(2,6,18,0.85); backdrop-filter: blur(5px); }
        .full-radar-container { position: relative; width: 350px; height: 350px; display: flex; justify-content: center; align-items: center; }
        .radar-circle-1 { position: absolute; width: 250px; height: 250px; border-radius: 50%; border: 1px solid rgba(0,229,255,0.2); animation: pulseRadar 2s infinite; }
        .radar-beam { position: absolute; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, #fff, var(--neon-blue)); top: 50%; right: 50%; transform-origin: right center; animation: radarBeamSpin 2s linear infinite; box-shadow: 0 0 20px var(--neon-blue); }
        .scan-msg { position: absolute; bottom: 25%; font-size: 15px; font-weight: 700; color: var(--neon-blue); letter-spacing: 2px; z-index: 2; text-shadow: 0 0 10px var(--neon-blue); }
        @keyframes pulseRadar { 0% { transform: scale(0.8); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }
        @keyframes radarBeamSpin { 100% { transform: rotate(360deg); } }
        .hidden { display: none !important; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'nova-ai-overlay';
    container.innerHTML = `
        <div id="nova-scanner-overlay" class="hidden">
            <div class="scan-backdrop"></div>
            <div class="full-radar-container"><div class="radar-circle-1"></div><div class="radar-beam"></div></div>
            <div class="scan-msg">SCANNING MARKET DATA...</div>
        </div>

        <div id="win-popup-container"></div>

        <div class="nova-robot-container" id="nova-robot-avatar">
            <div class="robot-circle"><div class="robot-face"><div class="eye left"></div><div class="eye right"></div><div class="mouth"></div></div></div>
            <button class="close-robot">×</button>
        </div>

        <div class="nova-minimized hidden" id="nova-minimized-launcher">
            <div class="mini-dot"></div>
            <span>NOVA AI (Active)</span>
        </div>

        <div class="nova-panel" id="nova-main-panel">
            <div class="panel-header" id="nova-panel-handle">
                <div class="header-left"><div class="logo-circle">N</div><div class="header-titles"><h2>NOVA MARKET AI</h2><p>Smart Market Scanner</p></div></div>
                <button class="btn-close-panel">✕</button>
            </div>
            <div class="panel-tabs">
                <button class="tab-btn active" data-tab="tab-scan">◎ Scan</button>
                <button class="tab-btn" data-tab="tab-settings">⚙ Settings</button>
            </div>
            <div class="panel-content">
                <div id="tab-scan" class="tab-pane active">
                    <div class="cyber-box">
                        <label>📈 Market</label>
                        <div class="custom-select" id="market-select-btn"><span id="current-market">EUR/USD (Auto)</span> <span>▼</span></div>
                        <div class="dropdown-options hidden" id="market-options">
                            <div class="option-item" data-value="EUR/USD">EUR/USD</div>
                            <div class="option-item" data-value="GBP/USD">GBP/USD</div>
                        </div>
                    </div>
                    <div class="scan-action-area">
                        <button class="btn-start-scan" id="btn-start-scan">◎ START SCAN ≫</button>
                    </div>
                    <div>
                        <label style="font-size:11px; color:#8496ae; margin-bottom:5px; display:block;">Scan Mode</label>
                        <div class="mode-toggle">
                            <button class="mode-btn active" id="mode-manual">↺ Manual</button>
                            <button class="mode-btn" id="mode-auto">↻ Auto Repeat</button>
                        </div>
                        <div id="auto-limits" class="limit-inputs hidden">
                            <div class="limit-box"><label>MAX SCANS</label><input type="number" id="limit-scans" value="0" min="0"></div>
                            <div class="limit-box"><label>MAX TRADES</label><input type="number" id="limit-trades" value="0" min="0"></div>
                        </div>
                    </div>
                    <div class="status-box" id="ui-status-box">
                        <div class="status-ring" id="status-ring-color"></div>
                        <div class="status-text">
                            <h3 id="ui-status-title">WAIT</h3>
                            <p id="ui-status-desc">Ready to scan. Click START SCAN to begin.</p>
                        </div>
                    </div>
                </div>
                <div id="tab-settings" class="tab-pane hidden">
                    <div class="cyber-box" style="margin-bottom:10px;">
                        <label>Base Trade Amount ($)</label>
                        <input type="number" id="base-amount" value="1" min="1">
                    </div>
                    <div class="cyber-box">
                        <label>Smart Martingale Multiplier</label>
                        <input type="number" id="martingale-multiplier" value="2" min="1" step="0.5">
                    </div>
                </div>
            </div>
            <div class="panel-footer"><div class="footer-logo"><div class="mini-dot"></div> NOVA AI • Trade Smarter</div></div>
        </div>
    `;
    document.body.appendChild(container);

    const panel = document.getElementById('nova-main-panel');
    const robot = document.getElementById('nova-robot-avatar');
    const launcher = document.getElementById('nova-minimized-launcher');
    const handle = document.getElementById('nova-panel-handle');
    const scannerOverlay = document.getElementById('nova-scanner-overlay');
    const winContainer = document.getElementById('win-popup-container');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.remove('hidden');
        });
    });

    document.querySelector('.btn-close-panel').addEventListener('click', () => {
        panel.classList.add('hidden');
        launcher.classList.remove('hidden');
    });
    
    launcher.addEventListener('click', () => {
        launcher.classList.add('hidden');
        panel.classList.remove('hidden');
    });

    document.querySelector('.close-robot').addEventListener('click', (e) => { e.stopPropagation(); robot.classList.add('hidden'); });

    setupDropdown('market-select-btn', 'market-options', 'current-market');
    function setupDropdown(bId, oId, dId) {
        const btn = document.getElementById(bId), opts = document.getElementById(oId), disp = document.getElementById(dId);
        btn.addEventListener('click', (e) => { e.stopPropagation(); opts.classList.toggle('hidden'); });
        opts.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', (e) => { e.stopPropagation(); disp.innerText = item.getAttribute('data-value'); opts.classList.add('hidden'); });
        });
        document.addEventListener('click', () => opts.classList.add('hidden'));
    }

    let isAuto = false, autoTimer = null, scansDone = 0, tradesDone = 0;
    let recoveryMode = false, currentAmount = 1;

    const limitUI = document.getElementById('auto-limits');
    const manualBtn = document.getElementById('mode-manual');
    const autoBtn = document.getElementById('mode-auto');

    manualBtn.addEventListener('click', stopAutoScan);
    autoBtn.addEventListener('click', startAutoScan);

    function stopAutoScan() {
        manualBtn.classList.add('active');
        autoBtn.classList.remove('active');
        limitUI.classList.add('hidden');
        isAuto = false;
        clearInterval(autoTimer);
    }

    function startAutoScan() {
        autoBtn.classList.add('active');
        manualBtn.classList.remove('active');
        limitUI.classList.remove('hidden');
        isAuto = true; scansDone = 0; tradesDone = 0;
        currentAmount = parseFloat(document.getElementById('base-amount').value) || 1;
        recoveryMode = false;
        
        clearInterval(autoTimer);
        autoTimer = setInterval(() => { if (isAuto) executeScan(); }, 15000);
    }

    document.getElementById('btn-start-scan').addEventListener('click', () => {
        // ১. স্টার্ট বাটনে চাপ দিলেই প্যানেল মিনিমাইজ হয়ে যাবে
        panel.classList.add('hidden');
        launcher.classList.remove('hidden');
        executeScan();
    });

    function showWinPopup() {
        playSound('win');
        winContainer.innerHTML = `
            <div id="nova-win-popup">
                <h2>🎉 CONGRATULATIONS! 🎉</h2>
                <p>TRADE WON SUCCESSFULLY!</p>
            </div>
        `;
        setTimeout(() => {
            winContainer.innerHTML = '';
        }, 3500);
    }

    function setPlatformAmount(amount) {
        const inputField = document.querySelector('input[type="number"]') || document.querySelector('.investment-field input');
        if (inputField) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(inputField, amount);
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function executeScan() {
        scannerOverlay.classList.remove('hidden');

        setTimeout(() => {
            scannerOverlay.classList.add('hidden');
            
            const signals = ['UP', 'DOWN'];
            const chosenSignal = signals[Math.floor(Math.random() * signals.length)];
            const score = Math.floor(Math.random() * 20) + 75;
            const color = chosenSignal === 'UP' ? '#00ff88' : '#ff4d4d';

            if (recoveryMode && score < 86) {
                document.getElementById('ui-status-title').innerText = 'WAITING...';
                document.getElementById('ui-status-title').style.color = '#ffcc00';
                document.getElementById('ui-status-desc').innerText = `Recovery Active. Score (${score}) low. Waiting...`;
                
                // স্ক্যান ও সিগন্যাল প্রসেস শেষ হওয়ায় প্যানেল আবার অটো বড় হয়ে যাবে
                launcher.classList.add('hidden');
                panel.classList.remove('hidden');
                return; 
            }
            
            playSound('signal');

            document.getElementById('ui-status-title').innerText = `Market Found: ${chosenSignal}`;
            document.getElementById('ui-status-title').style.color = color;
            document.getElementById('status-ring-color').style.borderColor = color;
            
            let targetScans = parseInt(document.getElementById('limit-scans').value) || 0;
            let targetTrades = parseInt(document.getElementById('limit-trades').value) || 0;

            if (isAuto) scansDone++;

            if (isAuto) {
                const btn = chosenSignal === 'UP' 
                    ? (document.querySelector('.button--success') || document.querySelector('.btn-call')) 
                    : (document.querySelector('.button--danger') || document.querySelector('.btn-put'));
                
                if (btn) {
                    setPlatformAmount(currentAmount);
                    ['mousedown','mouseup','click'].forEach(ev => btn.dispatchEvent(new MouseEvent(ev, {bubbles:true, cancelable:true, view:window})));
                    tradesDone++;
                    
                    setTimeout(() => {
                        const tradeWon = Math.random() > 0.4;
                        if (tradeWon) {
                            recoveryMode = false;
                            currentAmount = parseFloat(document.getElementById('base-amount').value) || 1;
                            showWinPopup();
                        } else {
                            recoveryMode = true;
                            const multi = parseFloat(document.getElementById('martingale-multiplier').value) || 2;
                            currentAmount = currentAmount * multi;
                        }
                    }, 5000); 
                }
                
                document.getElementById('ui-status-desc').innerHTML = `Amount: <strong>$${currentAmount}</strong> | Target: <strong>${chosenSignal}</strong> <br> (Scans: ${scansDone} | Trades: ${tradesDone})`;

                if ((targetScans > 0 && scansDone >= targetScans) || (targetTrades > 0 && tradesDone >= targetTrades)) {
                    stopAutoScan();
                    document.getElementById('ui-status-title').innerText = 'AUTO STOPPED';
                    document.getElementById('ui-status-title').style.color = '#ffcc00';
                }
            } else {
                document.getElementById('ui-status-desc').innerHTML = `Target direction: <strong>${chosenSignal}</strong>`;
            }

            // ২. স্ক্যান ও ট্রেড প্লেস করার কাজ শেষ হওয়া মাত্রই বট নিজে থেকে আগের মতো বড় হয়ে যাবে
            launcher.classList.add('hidden');
            panel.classList.remove('hidden');

        }, 3000);
    }

    makeDraggable(robot, robot);
    makeDraggable(panel, handle);
    function makeDraggable(elm, hndl) {
        let p1=0, p2=0, p3=0, p4=0;
        hndl.onmousedown = dm; hndl.ontouchstart = dm;
        function dm(e) { e.preventDefault(); p3 = e.clientX||(e.touches && e.touches[0].clientX); p4 = e.clientY||(e.touches && e.touches[0].clientY); document.onmouseup = cl; document.ontouchend = cl; document.onmousemove = ed; document.ontouchmove = ed; }
        function ed(e) { e.preventDefault(); let cx = e.clientX||(e.touches && e.touches[0].clientX), cy = e.clientY||(e.touches && e.touches[0].clientY); p1=p3-cx; p2=p4-cy; p3=cx; p4=cy; elm.style.top=(elm.offsetTop-p2)+"px"; elm.style.left=(elm.offsetLeft-p1)+"px"; elm.style.right='auto'; }
        function cl() { document.onmouseup=null; document.ontouchend=null; document.onmousemove=null; document.ontouchmove=null; }
    }
})();
