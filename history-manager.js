/**
 * NOVA MARKET AI - History Manager
 * Handles bounded local storage for scan results, clearing, and CSV export.
 */

class NovaHistoryManager {
    constructor() {
        this.storageKey = 'nova_scan_history';
        this.maxItems = 50; // Bounded history
        this.history = this.loadHistory();
    }

    loadHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("NOVA AI: Error loading history", e);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
        } catch (e) {
            console.error("NOVA AI: Error saving history (Storage might be full)", e);
        }
    }

    addScan(scanData) {
        // scanData shape: { symbol, timeframe, signal, score, reason, isDemo, timestamp }
        this.history.unshift({
            ...scanData,
            timestamp: new Date().toISOString()
        });

        // Enforce boundary
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }

        this.saveHistory();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    getHistory() {
        return this.history;
    }

    exportToCSV() {
        if (this.history.length === 0) {
            alert("No history to export.");
            return;
        }

        const headers = ["Timestamp", "Symbol", "Timeframe", "Signal", "Quality Score", "Reason", "Is Demo"];
        const rows = this.history.map(item => [
            new Date(item.timestamp).toLocaleString(),
            item.symbol || "EUR/USD",
            item.timeframe || "1m",
            item.signal,
            item.score,
            `"${item.reason.replace(/"/g, '""')}"`, // escape quotes for CSV
            item.isDemo ? "Yes" : "No"
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `nova_scan_history_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Global initialization
window.novaHistoryManager = new NovaHistoryManager();
