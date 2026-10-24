/**
 * NOVA MARKET AI - Scanner Engine (Visual Animation Layer)
 */

class NovaScannerEngine {
    constructor() {
        this.overlay = document.getElementById('nova-scanner-overlay');
        this.progressFill = document.getElementById('scan-progress-fill');
        this.particlesContainer = document.getElementById('nova-particles');
        
        this.isScanning = false;
        this.animationFrameId = null;
        this.scanDuration = 3000; 
    }

    startScan(onComplete) {
        if (this.isScanning) return;
        this.isScanning = true;
        
        this.overlay.classList.remove('hidden');
        this.progressFill.style.width = '0%';
        this.particlesContainer.innerHTML = '';
        
        let startTime = null;

        const animateProgress = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            
            const progress = Math.min((elapsed / this.scanDuration) * 100, 100);
            this.progressFill.style.width = `${progress}%`;

            if (Math.random() > 0.8) this.spawnParticle();

            if (elapsed < this.scanDuration && this.isScanning) {
                this.animationFrameId = requestAnimationFrame(animateProgress);
            } else if (this.isScanning) {
                this.stopScan(onComplete);
            }
        };

        this.animationFrameId = requestAnimationFrame(animateProgress);
    }

    stopScan(onComplete) {
        if (!this.isScanning) return;
        this.isScanning = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.overlay.classList.add('hidden');
        this.progressFill.style.width = '0%';
        this.particlesContainer.innerHTML = ''; 

        if (typeof onComplete === 'function') onComplete();
    }

    spawnParticle() {
        const particle = document.createElement('div');
        particle.className = 'scan-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 150; 
        const x = Math.cos(angle) * radius + 200; 
        const y = Math.sin(angle) * radius + 200;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        this.particlesContainer.appendChild(particle);

        try {
            const animation = particle.animate([
                { opacity: 0, transform: 'scale(0)' },
                { opacity: 1, transform: 'scale(1.5)' },
                { opacity: 0, transform: 'scale(0)' }
            ], { duration: 800 + Math.random() * 1000, easing: 'ease-in-out' });

            animation.onfinish = () => { if (particle.parentNode) particle.parentNode.removeChild(particle); };
        } catch(e) {
            setTimeout(() => { if (particle.parentNode) particle.parentNode.removeChild(particle); }, 1000);
        }
    }
}
