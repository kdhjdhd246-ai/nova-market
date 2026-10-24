/**
 * NOVA MARKET AI - Demo Chart Visuals
 * Generates a mock canvas chart for local development. Strictly NO LIVE DATA here.
 */

class NovaDemoChart {
    constructor() {
        this.container = document.getElementById('nova-chart-container');
        this.mainCanvas = document.getElementById('main-chart-canvas');
        this.rsiCanvas = document.getElementById('rsi-chart-canvas');

        if (!this.container || !this.mainCanvas || !this.rsiCanvas) return;

        this.ctx = this.mainCanvas.getContext('2d');
        this.rsiCtx = this.rsiCanvas.getContext('2d');

        this.colors = {
            bg: '#0b1120',
            grid: 'rgba(255, 255, 255, 0.05)',
            text: '#a0aec0',
            up: '#00ff88',
            down: '#ff4d4d',
            rsiLine: '#00ff88',
            rsiBound: 'rgba(255, 255, 255, 0.1)'
        };

        this.candles = this.generateMockCandles(80);
        this.resize();

        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.resize(), 100);
        });
    }

    resize() {
        const mainRect = this.mainCanvas.parentElement.getBoundingClientRect();
        this.mainCanvas.width = mainRect.width;
        this.mainCanvas.height = mainRect.height;

        const rsiRect = this.rsiCanvas.parentElement.getBoundingClientRect();
        this.rsiCanvas.width = rsiRect.width;
        this.rsiCanvas.height = rsiRect.height;

        this.draw();
    }

    generateMockCandles(count) {
        let candles = [];
        let price = 1.12200;
        for (let i = 0; i < count; i++) {
            let isUp = Math.random() > 0.5;
            let bodySize = Math.random() * 0.00100;
            let wickSize = Math.random() * 0.00050;

            let open = price;
            let close = isUp ? open + bodySize : open - bodySize;
            let high = Math.max(open, close) + wickSize;
            let low = Math.min(open, close) - wickSize;

            price = close; 
            candles.push({ open, close, high, low, isUp });
        }
        return candles;
    }

    draw() {
        this.drawMainChart();
        this.drawRSIChart();
    }

    drawMainChart() {
        const { width, height } = this.mainCanvas;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 1;
        
        const cols = 10;
        for (let i = 1; i < cols; i++) {
            let x = (width / cols) * i;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            ctx.fillStyle = this.colors.text;
            ctx.font = '10px Inter';
            ctx.fillText(`16:${(i*5).toString().padStart(2, '0')}`, x - 12, height - 10);
        }

        const rows = 6;
        for (let i = 1; i < rows; i++) {
            let y = (height / rows) * i;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            ctx.fillStyle = this.colors.text;
            ctx.fillText(`1.12${300 - (i*50)}`, width - 50, y + 4);
        }

        const candleWidth = 6;
        const spacing = 12;
        const startX = width - (this.candles.length * spacing) - 100;

        let minPrice = Math.min(...this.candles.map(c => c.low));
        let maxPrice = Math.max(...this.candles.map(c => c.high));
        let priceRange = maxPrice - minPrice;

        this.candles.forEach((candle, index) => {
            let x = startX + (index * spacing);
            if(x < 0) return; 

            let yHigh = height - ((candle.high - minPrice) / priceRange) * (height * 0.8) - (height * 0.1);
            let yLow = height - ((candle.low - minPrice) / priceRange) * (height * 0.8) - (height * 0.1);
            let yOpen = height - ((candle.open - minPrice) / priceRange) * (height * 0.8) - (height * 0.1);
            let yClose = height - ((candle.close - minPrice) / priceRange) * (height * 0.8) - (height * 0.1);

            ctx.strokeStyle = candle.isUp ? this.colors.up : this.colors.down;
            ctx.fillStyle = candle.isUp ? this.colors.up : this.colors.down;

            ctx.beginPath();
            ctx.moveTo(x + candleWidth/2, yHigh);
            ctx.lineTo(x + candleWidth/2, yLow);
            ctx.stroke();
            ctx.fillRect(x, Math.min(yOpen, yClose), candleWidth, Math.abs(yClose - yOpen) || 1);
        });
    }

    drawRSIChart() {
        const { width, height } = this.rsiCanvas;
        const ctx = this.rsiCtx;
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = this.colors.rsiBound;
        ctx.lineWidth = 1;
        
        let y70 = height * 0.25;
        let y30 = height * 0.75;

        ctx.beginPath(); ctx.moveTo(0, y70); ctx.lineTo(width, y70); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, y30); ctx.lineTo(width, y30); ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(0, y70, width, y30 - y70);

        ctx.beginPath();
        ctx.strokeStyle = this.colors.rsiLine;
        ctx.lineWidth = 1.5;

        const points = 100;
        const step = width / points;

        for (let i = 0; i <= points; i++) {
            let x = i * step;
            let rsiVal = 50 + Math.sin(i * 0.2) * 20 + (Math.random() * 10 - 5);
            let y = height - (rsiVal / 100) * height;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.novaDemoChart = new NovaDemoChart();
});
