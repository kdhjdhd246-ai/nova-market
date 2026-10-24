/**
 * NOVA MARKET AI - Market Data Adapter
 * Responsible for attempting to extract real market data, symbol, and timeframe from the host platform.
 * Provides fallback to Demo data for local testing.
 */

class NovaMarketDataAdapter {
    constructor() {
        this.lastFetch = null;
        this.sourceName = 'quotex-web-adapter';
    }

    fetchData() {
        // 1. Attempt to scrape live market details from the host page DOM
        let symbol = this.scrapeSymbol();
        let timeframe = this.scrapeTimeframe();
        
        let candles = [];
        let status = 'unavailable';
        let provenance = 'none';
        let isStale = false;

        // 2. Try to get real candle data (Normally injected via secure WebSocket interceptor in production)
        if (window.novaLiveMarketData && Array.isArray(window.novaLiveMarketData.candles) && window.novaLiveMarketData.candles.length > 0) {
            candles = window.novaLiveMarketData.candles;
            status = 'verified';
            provenance = 'websocket-intercept';
            
            // Check for stale data (if last candle is older than 5 minutes)
            const lastCandleTime = candles[candles.length - 1].timestamp;
            if (lastCandleTime && (Date.now() - lastCandleTime > 300000)) {
                isStale = true;
                status = 'stale';
            }
        } 
        // 3. Fallback for Local Development & Testing
        else if (window.novaDemoChart && window.novaDemoChart.candles) {
            candles = window.novaDemoChart.candles;
            status = 'verified';
            provenance = 'demo-fallback';
        }

        // Validate final extraction
        if (candles.length === 0) {
            status = 'unavailable';
        }

        this.lastFetch = Date.now();

        return {
            source: this.sourceName,
            symbol: symbol || 'UNKNOWN',
            timeframe: timeframe || 'UNKNOWN',
            candles: candles,
            status: status,
            isStale: isStale,
            provenance: provenance,
            receivedAt: this.lastFetch
        };
    }

    /**
     * Scrapes the currently active asset name from the Quotex UI.
     * Uses try/catch to ensure it doesn't break if DOM structure changes or if running locally.
     */
    scrapeSymbol() {
        try {
            // Common Quotex DOM classes for active asset
            let assetEl = document.querySelector('.pair-active .name') 
                       || document.querySelector('.asset-select__item.active')
                       || document.querySelector('.current-symbol');
            
            if (assetEl) return assetEl.innerText.trim();
        } catch(e) {
            console.warn("NOVA AI: Could not scrape market symbol.");
        }
        return null;
    }

    /**
     * Scrapes the currently active timeframe from the Quotex UI.
     */
    scrapeTimeframe() {
        try {
            let tfEl = document.querySelector('.time-active') 
                    || document.querySelector('[data-test="timeframe-value"]');
            
            if (tfEl) return tfEl.innerText.trim();
        } catch(e) {
            console.warn("NOVA AI: Could not scrape timeframe.");
        }
        return null;
    }
}

// Global initialization
window.novaDataAdapter = new NovaMarketDataAdapter();
