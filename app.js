/**
 * NOVA MARKET AI - UI Controller
 * Handles Draggable Elements, Minimize/Restore, Settings, and Scanner wiring.
 */

class NovaUIController {
    constructor() {
        // Elements
        this.robotAvatar = document.getElementById('nova-robot-avatar');
        this.mainPanel = document.getElementById('nova-main-panel');
        this.minimizedLauncher = document.getElementById('nova-minimized-launcher');
        
        // Handles/Buttons
        this.panelHandle = document.getElementById('nova-panel-handle');
        this.closePanelBtn = document.querySelector('.btn-close-panel');
        this.closeRobotBtn = document.querySelector('.close-robot');
        this.startScanBtn = document.getElementById('btn-start-scan');
        
        // Status UI
        this.statusRing = document.getElementById('ui-status-ring');
        this.statusTitle = document.getElementById('ui-status-title');
        this.statusDesc = document.getElementById('ui-status-desc');

        // Initialize Scanner Engine
        if (typeof NovaScannerEngine !== 'undefined') {
            this.scanner = new NovaScannerEngine();
        }

        this.init();
    }

    init() {
        if (!this.mainPanel || !this.robotAvatar) return;

        this.makeDraggable(this.robotAvatar, this.robotAvatar, 'nova_robot_pos');
        this.makeDraggable(this.mainPanel, this.panelHandle, 'nova_panel_pos');

        this.bindEvents();
        this.loadSavedState();
    }

    bindEvents() {
        this.closePanelBtn.addEventListener('click', () => {
            this.mainPanel.classList.add('hidden');
            this.minimizedLauncher.classList.remove('hidden');
            localStorage.setItem('nova_panel_state', 'minimized');
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

        if (this.startScanBtn && this.scanner) {
            this.startScanBtn.addEventListener('click', () => this.handleScanTrigger());
        }
    }

    handleScanTrigger() {
        if (this.scanner.isScanning) return;

        this.startScanBtn.classList.add('scanning');
        this.startScanBtn.querySelector('span').innerText = 'SCANNING...';
        this.statusRing.classList.add('scanning');
        this.statusTitle.innerText = 'Analyzing Market...';
        this.statusDesc.innerText = 'Extracting real-time parameters';

        this.scanner.startScan(() => {
            this.startScanBtn.classList.remove('scanning');
            this.startScanBtn.querySelector('span').innerText = 'START SCAN';
            this.statusRing.classList.remove('scanning');
            
            this.statusTitle.innerText = 'Analysis Complete';
            this.statusDesc.innerText = 'Waiting for data validation rules (Step 5)';
        });
    }

    makeDraggable(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = (e) => {
            if (['BUTTON', 'INPUT', 'SVG', 'PATH', 'SPAN'].includes(e.target.tagName.toUpperCase())) {
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
            
            localStorage.setItem(storageKey, JSON.stringify({
                top: element.style.top,
                left: element.style.left
            }));
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

            if (localStorage.getItem('nova_panel_state') === 'minimized') {
                this.mainPanel.classList.add('hidden');
                this.minimizedLauncher.classList.remove('hidden');
            }
            if (localStorage.getItem('nova_robot_state') === 'closed') {
                this.robotAvatar.classList.add('hidden');
            }
            
            this.enforceBoundaries(this.mainPanel);
            this.enforceBoundaries(this.robotAvatar);
        } catch (e) { console.error("NOVA AI State Error:", e); }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.novaApp = new NovaUIController();
});
