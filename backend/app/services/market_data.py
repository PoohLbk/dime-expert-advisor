import yfinance as yf
import pandas as pd
import pandas_ta as ta

class MarketDataService:
    @staticmethod
    def get_stock_indicators(ticker: str):
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period="100d")
            if df.empty:
                return {"error": "No data found for ticker"}

            # Calculate Technical Indicators
            df['EMA20'] = ta.ema(df['Close'], length=20)
            df['EMA50'] = ta.ema(df['Close'], length=50)
            df['RSI'] = ta.rsi(df['Close'], length=14)
            df['ATR'] = ta.atr(df['High'], df['Low'], df['Close'], length=14)

            latest = df.iloc[-1]
            return {
                "ticker": ticker.upper(),
                "current_price": round(float(latest['Close']), 2),
                "ema20": round(float(latest['EMA20']), 2),
                "ema50": round(float(latest['EMA50']), 2),
                "rsi": round(float(latest['RSI']), 2),
                "atr": round(float(latest['ATR']), 2),
                "high_52w": round(float(df['High'].max()), 2),
                "low_52w": round(float(df['Low'].min()), 2)
            }
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def get_usd_thb_rate() -> float:
        try:
            fx = yf.Ticker("THB=X")
            df = fx.history(period="1d")
            return round(float(df['Close'].iloc[-1]), 2)
        except Exception:
            return 36.00 # Default Fallback Rate
