document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.nova-tab');
    const tabContents = document.querySelectorAll('.nova-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Scan Mode Toggle (Manual vs Auto Repeat)
    const modeBtns = document.querySelectorAll('.nova-mode-btn');
    
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // In a later step, we will bind this to the Engine state.
            const mode = btn.getAttribute('data-mode');
            console.log(`NOVA AI: Scan mode switched to ${mode}`);
        });
    });

    // Close Button Simulation (for UI step)
    const closeBtn = document.querySelector('.nova-close-btn');
    closeBtn.addEventListener('click', () => {
        const panel = document.getElementById('nova-panel');
        // Visually fade out for now; bookmarklet logic handled in Step 8
        panel.style.transition = "opacity 0.3s ease";
        panel.style.opacity = "0";
        setTimeout(() => {
            panel.style.display = "none";
        }, 300);
    });
});
