/**
 * NOVA MARKET AI - Indicator & Validation Engine
 * Calculates EMA 9, EMA 21, RSI 14, and confirms signals.
 */

class NovaIndicatorEngine {
    constructor() {
        this.config = {
            emaShort: 9,
            emaLong: 21,
            rsiPeriod: 14,
            minCandlesReq: 30,
            minBodyRatio: 0.4
        };
    }

    calculateEMA(data, period) {
        const k = 2 / (period + 1);
        let emaArray = [];
        let ema = data[0]; 
        
        emaArray.push(ema);
        for (let i = 1; i < data.length; i++) {
            ema = (data[i] * k) + (ema * (1 - k));
            emaArray.push(ema);
        }
        return emaArray;
    }

    calculateRSI(data, period) {
        let rsiArray = [];
        let gains = 0, losses = 0;

        for (let i = 1; i <= period; i++) {
            const diff = data[i] - data[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }
        
        let avgGain = gains / period;
        let avgLoss = losses / period;
        
        for (let i = period; i < data.length; i++) {
            if (i > period) {
                const diff = data[i] - data[i - 1];
                const gain = diff >= 0 ? diff : 0;
                const loss = diff < 0 ? -diff : 0;
                avgGain = ((avgGain * (period - 1)) + gain) / period;
                avgLoss = ((avgLoss * (period - 1)) + loss) / period;
            }
            
            let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            let rsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + rs));
            rsiArray.push(rsi);
        }
        
        return Array(period).fill(null).concat(rsiArray);
    }

    analyze(candles, isDemo = false) {
        if (!Array.isArray(candles) || candles.length < this.config.minCandlesReq) {
            return {
                signal: 'DATA UNAVAILABLE', score: 0,
                reason: 'Insufficient candle data for reliable calculation.',
                isDemo, indicators: null
            };
        }

        const closes = candles.map(c => c.close);
        const lastCandle = candles[candles.length - 1];
        
        const ema9 = this.calculateEMA(closes, this.config.emaShort);
        const ema21 = this.calculateEMA(closes, this.config.emaLong);
        const rsiArray = this.calculateRSI(closes, this.config.rsiPeriod);
        
        const currentEma9 = ema9[ema9.length - 1];
        const currentEma21 = ema21[ema21.length - 1];
        const currentRsi = rsiArray[rsiArray.length - 1];

        const range = lastCandle.high - lastCandle.low;
        const body = Math.abs(lastCandle.close - lastCandle.open);
        const bodyRatio = range === 0 ? 0 : body / range;
        const isBullish = lastCandle.close > lastCandle.open;

        let signal = 'WAIT';
        let reason = 'Market momentum is weak or conflicting. Waiting for clear setup.';
        let score = 0; 

        if (currentRsi >= 70) {
            reason = 'Overbought conditions detected. High risk of reversal. WAIT.';
            score = 20;
        } else if (currentRsi <= 30) {
            reason = 'Oversold conditions detected. High risk of reversal. WAIT.';
            score = 20;
        } else if (currentEma9 > currentEma21 && isBullish) {
            if (currentRsi > 50 && bodyRatio >= this.config.minBodyRatio) {
                signal = 'UP';
                reason = 'Uptrend confirmed: EMA 9 crossed above EMA 21, RSI > 50, and solid bullish candle structure.';
                score = 85;
            } else {
                reason = 'Uptrend detected but lacks strong momentum or candle structure. WAIT.';
                score = 45;
            }
        } else if (currentEma9 < currentEma21 && !isBullish) {
            if (currentRsi < 50 && bodyRatio >= this.config.minBodyRatio) {
                signal = 'DOWN';
                reason = 'Downtrend confirmed: EMA 9 crossed below EMA 21, RSI < 50, and solid bearish candle structure.';
                score = 85;
            } else {
                reason = 'Downtrend detected but lacks strong momentum or candle structure. WAIT.';
                score = 45;
            }
        }

        return {
            signal, score, reason, isDemo,
            indicators: { ema9: currentEma9, ema21: currentEma21, rsi: currentRsi, bodyRatio: bodyRatio }
        };
    }
}

window.novaIndicatorEngine = new NovaIndicatorEngine();
