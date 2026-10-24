/**
 * NOVA MARKET AI - Bookmarklet Injector
 * Injects the Netlify-hosted application into the target trading platform (Quotex).
 * Version: 1.0.0
 */

(function() {
    // 1. Your Netlify Hosted URL (You will replace this after Step 2 below)
    const HOSTED_URL = 'https://your-nova-ai-app.netlify.app';

    // 2. Prevent duplicate launches
    if (document.getElementById('nova-ai-overlay')) {
        alert('NOVA MARKET AI is already running on this page!');
        return;
    }

    console.log('NOVA AI: Initializing injection...');

    // 3. Inject CSS
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `${HOSTED_URL}/style.css?v=${new Date().getTime()}`; // Cache busting
    document.head.appendChild(styleLink);

    // 4. Inject UI Container (Without the Demo Chart)
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'nova-app-mount';
    document.body.appendChild(overlayContainer);

    // Fetch and inject the HTML UI
    fetch(`${HOSTED_URL}/index.html`)
        .then(response => response.text())
        .then(html => {
            // Extract only the #nova-ai-overlay part (skip the demo chart)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const overlay = doc.getElementById('nova-ai-overlay');
            
            if (overlay) {
                overlayContainer.appendChild(overlay);
                loadScripts();
            } else {
                throw new Error('Overlay container not found in fetched HTML');
            }
        })
        .catch(err => {
            console.error('NOVA AI: Failed to load UI', err);
            alert('Failed to load NOVA AI. Check console for details.');
        });

    // 5. Inject JavaScript Files Sequentially
    function loadScripts() {
        const scripts = [
            'data-adapter.js',
            'indicator-engine.js',
            'scanner-engine.js',
            'history-manager.js',
            'settings-manager.js',
            'app.js'
        ];

        let loaded = 0;

        scripts.forEach(scriptName => {
            const scriptEl = document.createElement('script');
            scriptEl.src = `${HOSTED_URL}/${scriptName}?v=${new Date().getTime()}`;
            scriptEl.onload = () => {
                loaded++;
                if (loaded === scripts.length) {
                    console.log('NOVA AI: Successfully loaded all modules.');
                }
            };
            scriptEl.onerror = () => {
                console.error(`NOVA AI: Failed to load script -> ${scriptName}`);
            };
            document.body.appendChild(scriptEl);
        });
    }
})();
