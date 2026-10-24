/**
 * NOVA MARKET AI - UI Controller
 * Handles Draggable Elements, Minimize/Restore, and LocalStorage Preferences
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
        
        this.init();
    }

    init() {
        if (!this.mainPanel || !this.robotAvatar) return;

        // Make elements draggable
        this.makeDraggable(this.robotAvatar, this.robotAvatar, 'nova_robot_pos');
        this.makeDraggable(this.mainPanel, this.panelHandle, 'nova_panel_pos');

        // Bind Events
        this.bindEvents();

        // Restore State & Positions
        this.loadSavedState();
    }

    bindEvents() {
        // Minimize Panel
        this.closePanelBtn.addEventListener('click', () => {
            this.mainPanel.classList.add('hidden');
            this.minimizedLauncher.classList.remove('hidden');
            localStorage.setItem('nova_panel_state', 'minimized');
        });

        // Close Robot
        this.closeRobotBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag triggering
            this.robotAvatar.classList.add('hidden');
            localStorage.setItem('nova_robot_state', 'closed');
        });

        // Restore Panel from Minimized Launcher
        this.minimizedLauncher.addEventListener('click', () => {
            this.minimizedLauncher.classList.add('hidden');
            this.mainPanel.classList.remove('hidden');
            localStorage.setItem('nova_panel_state', 'open');
        });

        // Prevent Window Resize from pushing elements off-screen
        window.addEventListener('resize', () => {
            this.enforceBoundaries(this.robotAvatar);
            this.enforceBoundaries(this.mainPanel);
        });
    }

    makeDraggable(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = (e) => {
            // Ignore clicks on buttons/inputs inside the handle
            if (['BUTTON', 'INPUT', 'SVG', 'PATH'].includes(e.target.tagName.toUpperCase())) {
                if(!e.target.closest('.panel-header')) return; // Allow header drag
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

            // Strict viewport boundaries
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            // Remove bottom/right positioning if used, to rely purely on top/left
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        };

        const closeDragElement = () => {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('touchend', closeDragElement);
            document.removeEventListener('touchmove', elementDrag);
            
            // Save position to localStorage
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
        if (rect.right > window.innerWidth) {
            element.style.left = (window.innerWidth - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            element.style.top = (window.innerHeight - rect.height) + 'px';
        }
    }

    loadSavedState() {
        try {
            // Load Panel Position
            const panelPos = JSON.parse(localStorage.getItem('nova_panel_pos'));
            if (panelPos) {
                this.mainPanel.style.top = panelPos.top;
                this.mainPanel.style.left = panelPos.left;
                this.mainPanel.style.right = 'auto';
            }

            // Load Robot Position
            const robotPos = JSON.parse(localStorage.getItem('nova_robot_pos'));
            if (robotPos) {
                this.robotAvatar.style.top = robotPos.top;
                this.robotAvatar.style.left = robotPos.left;
                this.robotAvatar.style.right = 'auto';
            }

            // Load UI States (Open/Minimized/Closed)
            const panelState = localStorage.getItem('nova_panel_state');
            if (panelState === 'minimized') {
                this.mainPanel.classList.add('hidden');
                this.minimizedLauncher.classList.remove('hidden');
            }

            const robotState = localStorage.getItem('nova_robot_state');
            if (robotState === 'closed') {
                this.robotAvatar.classList.add('hidden');
            }
            
            // Re-enforce boundaries just in case screen size changed
            this.enforceBoundaries(this.mainPanel);
            this.enforceBoundaries(this.robotAvatar);

        } catch (e) {
            console.error("Error loading NOVA AI saved state:", e);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.novaApp = new NovaUIController();
});
