/**
 * NOVA MARKET AI - Settings Manager
 * Manages user preferences stored safely in localStorage.
 */

class NovaSettingsManager {
    constructor() {
        this.storageKey = 'nova_user_settings';
        
        // Default Configuration
        this.defaultSettings = {
            threshold: 75,
            autoScanInterval: 60000 // 1 minute in MS
        };

        this.settings = this.loadSettings();
    }

    loadSettings() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return { ...this.defaultSettings, ...JSON.parse(data) };
            }
        } catch (e) {
            console.error("NOVA AI: Error loading settings", e);
        }
        return { ...this.defaultSettings };
    }

    saveSettings() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
        } catch (e) {
            console.error("NOVA AI: Error saving settings", e);
        }
    }

    updateSetting(key, value) {
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = value;
            this.saveSettings();
        }
    }

    get(key) {
        return this.settings[key];
    }

    resetAll() {
        if(confirm("Are you sure you want to delete all settings, saved positions, and scan history?")) {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem('nova_scan_history');
            localStorage.removeItem('nova_panel_pos');
            localStorage.removeItem('nova_robot_pos');
            localStorage.removeItem('nova_panel_state');
            localStorage.removeItem('nova_robot_state');
            alert("App reset successfully. Reloading...");
            location.reload();
        }
    }
}

// Global initialization
window.novaSettingsManager = new NovaSettingsManager();
