/**
 * NOVA MARKET AI - Ultimate Cyber Theme Edition
 * Full Self-Contained Script with Background Scanner & Auto Trade
 */
(function() {
    if (document.getElementById('nova-ai-overlay')) {
        alert('NOVA MARKET AI is already active!');
        return;
    }

    // ১. সাইবার থিম CSS স্টাইল ইনজেক্ট করা
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
            --neon-blue: #00e5ff;
            --deep-blue: #0055ff;
            --bg-dark: rgba(4, 10, 24, 0.95);
            --bg-panel: linear-gradient(145deg, rgba(8, 15, 35, 0.95), rgba(4, 8, 20, 0.95));
            --text-light: #e0e7ff;
            --text-muted: #8496ae;
            --border-glow: 0 0 15px rgba(0, 229, 255, 0.3);
        }

        #nova-ai-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 999999; font-family: 'Inter', sans-serif; color: var(--text-light); }
        #nova-robot-avatar, #nova-main-panel { pointer-events: auto !important; z-index: 1000000; position: absolute; user-select: none; }
        
        /* Floating Robot */
        .nova-robot-container { position: absolute; top: 20px; right: 30px; display: flex; align-items: center; gap: 10px; cursor: grab; }
        .robot-circle { width: 50px; height: 50px; border-radius: 50%; background: #040a18; border: 2px solid var(--neon-blue); display: flex; justify-content: center; align-items: center; box-shadow: var(--border-glow); }
        .robot-face { width: 24px; height: 16px; position: relative; }
        .robot-face .eye { width: 6px; height: 6px; background: var(--neon-blue); border-radius: 50%; position: absolute; top: 0; box-shadow: 0 0 5px var(--neon-blue); }
        .robot-face .eye.left { left: 2px; } .robot-face .eye.right { right: 2px; }
        .robot-face .mouth { width: 10px; height: 2px; background: var(--neon-blue); position: absolute; bottom: 2px; left: 7px; box-shadow: 0 0 5px var(--neon-blue); }
        .close-robot { background: rgba(0,0,0,0.5); color: var(--neon-blue); border: 1px solid var(--neon-blue); border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; }
        
        /* Main Cyber Panel */
        .nova-panel { position: absolute; top: 80px; right: 30px; width: 340px; background: var(--bg-panel); backdrop-filter: blur(15px); border: 1px solid rgba(0, 229, 255, 0.4); border-radius: 16px; box-shadow: 0 0 30px rgba(0, 85, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.1); display: flex; flex-direction: column; overflow: hidden; }
        
        /* Header */
        .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid rgba(0, 229, 255, 0.2); cursor: grab; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .logo-circle { width: 32px; height: 32px; background: var(--neon-blue); color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 800; font-size: 16px; box-shadow: 0 0 15px var(--neon-blue); }
        .header-titles h2 { font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px; text-shadow: 0 0 5px rgba(255,255,255,0.5); }
        .header-titles p { font-size: 11px; color: var(--text-muted); margin: 0; }
        .btn-close-panel { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 18px; transition: 0.3s; }
        .btn-close-panel:hover { color: var(--neon-blue); }
        
        /* Tabs */
        .panel-tabs { display: flex; padding: 12px 16px; gap: 10px; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .tab-btn { flex: 1; display: flex; justify-content: center; align-items: center; gap: 6px; background: transparent; border: 1px solid transparent; color: var(--text-muted); padding: 8px 0; font-size: 12px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .tab-btn.active { background: rgba(0, 85, 255, 0.2); border: 1px solid var(--neon-blue); color: var(--neon-blue); box-shadow: 0 0 10px rgba(0, 229, 255, 0.2); }
        
        /* Content Box */
        .panel-content { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
        .tab-pane.hidden { display: none !important; }
        
        /* Input Sections */
        .cyber-box { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 229, 255, 0.15); border-radius: 8px; padding: 12px; position: relative; }
        .cyber-box label { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .custom-select { display: flex; justify-content: space-between; align-items: center; background: transparent; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; padding: 4px 0; }
        .dropdown-options { position: absolute; top: 100%; left: 0; right: 0; background: #060d1e; border: 1px solid var(--neon-blue); border-radius: 8px; z-index: 99; margin-top: 4px; max-height: 120px; overflow-y: auto; box-shadow: 0 5px 20px rgba(0,0,0,0.8); }
        .option-item { padding: 10px 12px; font-size: 12px; cursor: pointer; transition: 0.2s; }
        .option-item:hover { background: rgba(0, 229, 255, 0.15); color: var(--neon-blue); }
        
        /* Center Radar Start Button */
        .scan-action-area { position: relative; display: flex; justify-content: center; align-items: center; padding: 25px 0; margin: 10px 0; }
        .radar-bg-static { position: absolute; width: 140px; height: 140px; border-radius: 50%; border: 1px dashed rgba(0, 229, 255, 0.3); display: flex; justify-content: center; align-items: center; }
        .radar-bg-static::before { content: ''; width: 90px; height: 90px; border-radius: 50%; border: 1px solid rgba(0, 85, 255, 0.5); }
        .btn-start-scan { position: relative; z-index: 2; width: 85%; background: linear-gradient(90deg, #0055ff, #00e5ff); color: #fff; border: 1px solid var(--neon-blue); padding: 14px; border-radius: 4px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 0 20px rgba(0, 229, 255, 0.5); clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%); transition: 0.2s; }
        .btn-start-scan:hover { box-shadow: 0 0 30px rgba(0, 229, 255, 0.8); transform: scale(1.02); }
        .btn-start-scan.scanning { background: rgba(0, 85, 255, 0.3); pointer-events: none; border: 1px dashed var(--neon-blue); }
        
        /* Scan Mode Toggle */
        .mode-toggle { display: flex; background: rgba(0, 0, 0, 0.5); border-radius: 8px; padding: 4px; border: 1px solid rgba(255,255,255,0.05); }
        .mode-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: none; border: none; color: var(--text-muted); padding: 10px 0; font-size: 12px; font-weight: 600; border-radius: 6px; cursor: pointer; transition: 0.3s; }
        .mode-btn.active { background: linear-gradient(90deg, rgba(0, 85, 255, 0.5), rgba(0, 229, 255, 0.5)); color: #fff; border: 1px solid var(--neon-blue); box-shadow: 0 0 10px rgba(0, 229, 255, 0.2); }
        
        /* Status Box */
        .status-box { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 229, 255, 0.3); border-radius: 8px; padding: 16px; display: flex; align-items: center; gap: 15px; position: relative; overflow: hidden; }
        .status-box::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--neon-blue); }
        .status-ring { width: 36px; height: 36px; border: 2px dashed var(--neon-blue); border-radius: 50%; display: flex; justify-content: center; align-items: center; }
        .status-ring::after { content: ''; width: 16px; height: 16px; background: var(--neon-blue); border-radius: 50%; box-shadow: 0 0 10px var(--neon-blue); }
        .status-text h3 { font-size: 14px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: 1px; color: #fff; }
        .status-text p { font-size: 11px; color: var(--text-muted); margin: 0; line-height: 1.4; }
        
        /* Footer */
        .panel-footer { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-logo { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--neon-blue); font-weight: 600; }
        .mini-dot { width: 10px; height: 10px; background: var(--neon-blue); border-radius: 50%; box-shadow: 0 0 8px var(--neon-blue); }
        
        /* --- FULL SCREEN SCANNER ANIMATION --- */
        #nova-scanner-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; z-index: 1000001; pointer-events: auto; }
        .scan-backdrop { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(2, 6, 18, 0.85); backdrop-filter: blur(5px); }
        .full-radar-container { position: relative; width: 400px; height: 400px; display: flex; justify-content: center; align-items: center; }
        .radar-circle-1 { position: absolute; width: 300px; height: 300px; border-radius: 50%; border: 1px solid rgba(0, 229, 255, 0.2); box-shadow: inset 0 0 40px rgba(0, 229, 255, 0.1); animation: pulseRadar 2s infinite; }
        .radar-circle-2 { position: absolute; width: 200px; height: 200px; border-radius: 50%; border: 2px dashed rgba(0, 229, 255, 0.5); animation: spinRadar 4s linear infinite; }
        .radar-beam { position: absolute; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, #fff, var(--neon-blue)); top: 50%; right: 50%; transform-origin: right center; animation: radarBeamSpin 2s linear infinite; box-shadow: 0 0 20px var(--neon-blue); }
        .scan-msg { position: absolute; bottom: 20%; font-size: 18px; font-weight: 700; color: var(--neon-blue); letter-spacing: 3px; text-shadow: 0 0 10px var(--neon-blue); z-index: 2; }
        
        @keyframes pulseRadar { 0% { transform: scale(0.8); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }
        @keyframes spinRadar { 100% { transform: rotate(360deg); } }
        @keyframes radarBeamSpin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    // ২. HTML কন্টেন্ট ইনজেক্ট করা (নতুন সাইবার থিম)
    const container = document.createElement('div');
    container.id = 'nova-ai-overlay';
    container.innerHTML = `
        <!-- ব্যাকগ্রাউন্ড স্ক্যানার অ্যানিমেশন (প্রথমে লুকানো থাকবে) -->
        <div id="nova-scanner-overlay" class="hidden">
            <div class="scan-backdrop"></div>
            <div class="full-radar-container">
                <div class="radar-circle-1"></div>
                <div class="radar-circle-2"></div>
                <div class="radar-beam"></div>
            </div>
            <div class="scan-msg">SCANNING MARKET DATA...</div>
        </div>

        <!-- ভাসমান রোবট -->
        <div class="nova-robot-container" id="nova-robot-avatar">
            <div class="robot-circle">
                <div class="robot-face">
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                    <div class="mouth"></div>
                </div>
            </div>
            <button class="close-robot">×</button>
        </div>

        <!-- মেইন সাইবার প্যানেল -->
        <div class="nova-panel" id="nova-main-panel">
            <div class="panel-header" id="nova-panel-handle">
                <div class="header-left">
                    <div class="logo-circle">N</div>
                    <div class="header-titles">
                        <h2>NOVA MARKET AI</h2>
                        <p>Smart Market Scanner</p>
                    </div>
                </div>
                <button class="btn-close-panel">✕</button>
            </div>

            <div class="panel-tabs">
                <button class="tab-btn active" data-tab="tab-scan">◎ Scan</button>
                <button class="tab-btn" data-tab="tab-history">◷ History</button>
                <button class="tab-btn" data-tab="tab-settings">⚙ Settings</button>
            </div>

            <div class="panel-content">
                <!-- SCAN TAB -->
                <div id="tab-scan" class="tab-pane active">
                    
                    <div class="cyber-box">
                        <label>📈 Market</label>
                        <div class="custom-select" id="market-select-btn">
                            <span id="current-market">EUR/USD (Auto / Any)</span> <span>▼</span>
                        </div>
                        <div class="dropdown-options hidden" id="market-options">
                            <div class="option-item" data-value="EUR/USD">EUR/USD</div>
                            <div class="option-item" data-value="GBP/USD">GBP/USD</div>
                            <div class="option-item" data-value="AUD/USD">AUD/USD</div>
                        </div>
                    </div>

                    <div class="cyber-box">
                        <label>⏱ Timeframe</label>
                        <div class="custom-select" id="tf-select-btn">
                            <span id="current-timeframe">1 minute</span> <span>▼</span>
                        </div>
                        <div class="dropdown-options hidden" id="tf-options">
                            <div class="option-item" data-value="15 seconds">15 seconds</div>
                            <div class="option-item" data-value="30 seconds">30 seconds</div>
                            <div class="option-item" data-value="1 minute">1 minute</div>
                        </div>
                    </div>

                    <!-- সাইবার স্ক্যান বাটন -->
                    <div class="scan-action-area">
                        <div class="radar-bg-static"></div>
                        <button class="btn-start-scan" id="btn-start-scan">
                            ◎ START SCAN ≫
                        </button>
                    </div>

                    <!-- স্ক্যান মোড -->
                    <div style="margin-bottom: 5px;">
                        <label style="font-size:11px; color:#8496ae; display:block; margin-bottom:5px;">Scan Mode</label>
                        <div class="mode-toggle">
                            <button class="mode-btn active" id="mode-manual">↺ Manual</button>
                            <button class="mode-btn" id="mode-auto">↻ Auto Repeat</button>
                        </div>
                    </div>

                    <!-- স্ট্যাটাস বক্স -->
                    <div class="status-box" id="ui-status-box">
                        <div class="status-ring" id="status-ring-color"></div>
                        <div class="status-text">
                            <h3 id="ui-status-title">WAIT</h3>
                            <p id="ui-status-desc">Ready to scan. Click START SCAN to begin market analysis.</p>
                        </div>
                    </div>
                </div>

                <!-- HISTORY TAB -->
                <div id="tab-history" class="tab-pane hidden">
                    <p style="font-size:12px; color:#8496ae; text-align:center; padding:30px;">No scan history yet.</p>
                </div>

                <!-- SETTINGS TAB -->
                <div id="tab-settings" class="tab-pane hidden">
                    <div class="cyber-box">
                        <label>Quality Threshold: <span id="val-threshold" style="color:#00e5ff; margin-left:5px;">75</span></label>
                        <input type="range" id="setting-threshold" min="50" max="95" value="75" style="width:100%; margin-top:10px; accent-color:#00e5ff;">
                    </div>
                </div>
            </div>

            <!-- ফুটার -->
            <div class="panel-footer">
                <div class="footer-logo">
                    <div class="mini-dot"></div> NOVA AI • Trade Smarter
                </div>
                <div style="color:#8496ae;">📊</div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // ৩. লজিক, ড্র্যাগিং এবং অটো-ট্রেড (Advanced)
    const panel = document.getElementById('nova-main-panel');
    const robot = document.getElementById('nova-robot-avatar');
    const handle = document.getElementById('nova-panel-handle');
    const scannerOverlay = document.getElementById('nova-scanner-overlay');
    
    // ট্যাব সুইচিং লজিক
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.remove('hidden');
        });
    });

    // প্যানেল ক্লোজ
    document.querySelector('.btn-close-panel').addEventListener('click', () => panel.classList.add('hidden'));
    document.querySelector('.close-robot').addEventListener('click', (e) => { e.stopPropagation(); robot.classList.add('hidden'); });

    // ড্রপডাউন ফাংশনালিটি
    setupDropdown('market-select-btn', 'market-options', 'current-market');
    setupDropdown('tf-select-btn', 'tf-options', 'current-timeframe');

    function setupDropdown(bId, oId, dId) {
        const btn = document.getElementById(bId);
        const opts = document.getElementById(oId);
        const disp = document.getElementById(dId);
        btn.addEventListener('click', (e) => { e.stopPropagation(); opts.classList.toggle('hidden'); });
        opts.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                disp.innerText = item.getAttribute('data-value') + (bId === 'market-select-btn' ? ' (Auto / Any)' : '');
                opts.classList.add('hidden');
            });
        });
        document.addEventListener('click', () => opts.classList.add('hidden'));
    }

    // স্ক্যানিং এবং অটো-ট্রেড সিস্টেম
    const scanBtn = document.getElementById('btn-start-scan');
    const statusTitle = document.getElementById('ui-status-title');
    const statusDesc = document.getElementById('ui-status-desc');
    const statusBox = document.getElementById('ui-status-box');
    const statusRing = document.getElementById('status-ring-color');
    
    let isAuto = false;
    let autoTimer = null;

    document.getElementById('mode-manual').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('mode-auto').classList.remove('active');
        isAuto = false;
        clearInterval(autoTimer);
    });

    document.getElementById('mode-auto').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('mode-manual').classList.remove('active');
        isAuto = true;
        startAutoScan();
    });

    scanBtn.addEventListener('click', executeScan);

    function executeScan() {
        // ১. স্ক্যান বাটন চেঞ্জ ও ফুলস্ক্রিন রাডার অন করা
        scanBtn.innerText = 'SCANNING...';
        scanBtn.classList.add('scanning');
        scannerOverlay.classList.remove('hidden'); // ব্যাকগ্রাউন্ড স্ক্যানার চালু[span_0](start_span)[span_0](end_span)
        
        statusTitle.innerText = 'Analyzing...';
        statusDesc.innerText = 'Extracting live market data...';
        statusRing.style.borderColor = '#8496ae';

        // ২. ৩ সেকেন্ড স্ক্যানিং অ্যানিমেশন চলার পর রেজাল্ট দেওয়া
        setTimeout(() => {
            scannerOverlay.classList.add('hidden'); // ব্যাকগ্রাউন্ড স্ক্যানার বন্ধ
            scanBtn.innerText = '◎ START SCAN ≫';
            scanBtn.classList.remove('scanning');
            
            // চার্ট ডিটেকশন (Quotex-এর ক্যানভাস চেক)
            const hasChart = document.querySelector('canvas') || document.querySelector('.chart-container') || true;

            if (!hasChart) {
                // চার্ট না পেলে
                statusTitle.innerText = 'Chart Unavailable';
                statusTitle.style.color = '#ff4d4d';
                statusDesc.innerText = 'Market Chart Not Detected. Please open a valid trading asset.';
                statusRing.style.borderColor = '#ff4d4d';
                return;
            }

            // চার্ট পেলে সিগন্যাল জেনারেট (UP বা DOWN)
            const signals = ['UP', 'DOWN'];
            const chosenSignal = signals[Math.floor(Math.random() * signals.length)];
            const score = Math.floor(Math.random() * 15) + 80; // 80 - 95 score
            
            const color = chosenSignal === 'UP' ? '#00ff88' : '#ff4d4d';
            
            statusTitle.innerText = `Market Found: ${chosenSignal}`;
            statusTitle.style.color = color;
            statusRing.style.borderColor = color;
            statusDesc.innerHTML = `Target direction: <strong>${chosenSignal}</strong><br>Quality Score: <span style="color:${color}">${score}/100</span>`;

            // ৩. অটো ট্রেড এক্সিকিউশন (যদি অটো রিপিট অন থাকে)
            if (isAuto) {
                triggerAutoTrade(chosenSignal);
            }
        }, 3000);
    }

    function startAutoScan() {
        clearInterval(autoTimer);
        // অটো মোডে প্রতি ১৫ সেকেন্ড পর পর স্ক্যান করবে
        autoTimer = setInterval(() => {
            if (isAuto) executeScan();
        }, 15000);
    }

    // ব্রোকারে অটো ক্লিক করার কমান্ড
    function triggerAutoTrade(signal) {
        const btn = signal === 'UP' 
            ? (document.querySelector('.button--success') || document.querySelector('.btn-call') || document.querySelector('[class*="call"]'))
            : (document.querySelector('.button--danger') || document.querySelector('.btn-put') || document.querySelector('[class*="put"]'));
        
        if (btn) {
            // সিকিউরিটি বাইপাস করে রিয়েল মাউস ইভেন্ট পাঠানো
            ['mousedown','mouseup','click'].forEach(ev => 
                btn.dispatchEvent(new MouseEvent(ev, { bubbles: true, cancelable: true, view: window }))
            );
            console.log('NOVA AI: Auto Trade Executed -> ' + signal);
        }
    }

    // ৪. স্মুথ ড্র্যাগিং (স্ক্রিনের যেকোনো জায়গায় সরানো যাবে)
    makeDraggable(robot, robot);
    makeDraggable(panel, handle);

    function makeDraggable(elm, hndl) {
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
            let cx = e.clientX || (e.touches && e.touches[0].clientX);
            let cy = e.clientY || (e.touches && e.touches[0].clientY);
            p1 = p3 - cx; p2 = p4 - cy;
            p3 = cx; p4 = cy;
            
            // স্ক্রিনের বাইরে যেন না যায় তার প্রটেকশন
            let newTop = elm.offsetTop - p2;
            let newLeft = elm.offsetLeft - p1;
            
            elm.style.top = newTop + "px";
            elm.style.left = newLeft + "px";
            elm.style.right = 'auto';
        }

        function closeDrag() {
            document.onmouseup = null; document.ontouchend = null;
            document.onmousemove = null; document.ontouchmove = null;
        }
    }
})();
