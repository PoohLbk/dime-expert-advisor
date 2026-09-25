import yfinance as yf
import pandas as pd
from ta.trend import EMAIndicator
from ta.momentum import RSIIndicator
from ta.volatility import AverageTrueRange

class MarketDataService:
    @staticmethod
    def get_stock_indicators(ticker: str):
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(period="100d")
            if df.empty:
                return {"error": "No data found for ticker"}

            # คำนวณ Indicators ด้วยไลบรารี ta
            ema20_ind = EMAIndicator(close=df['Close'], window=20)
            ema50_ind = EMAIndicator(close=df['Close'], window=50)
            rsi_ind = RSIIndicator(close=df['Close'], window=14)
            atr_ind = AverageTrueRange(high=df['High'], low=df['Low'], close=df['Close'], window=14)

            df['EMA20'] = ema20_ind.ema_indicator()
            df['EMA50'] = ema50_ind.ema_indicator()
            df['RSI'] = rsi_ind.rsi()
            df['ATR'] = atr_ind.average_true_range()

            latest = df.iloc[-1]
            return {
                "ticker": ticker.upper(),
                "current_price": round(float(latest['Close']), 2),
                "ema20": round(float(latest['EMA20']), 2),
                "ema50": round(float(latest['EMA50']), 2),
                "rsi": round(float(latest['RSI']), 2),
                "atr": round(float(latest['ATR']), 2),
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
            return 36.00
