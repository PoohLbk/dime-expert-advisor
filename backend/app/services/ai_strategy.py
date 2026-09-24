import requests
from app.config import settings

class AIStrategyEngine:
    def analyze_trading_signal(
        self, ticker: str, current_price: float, rsi: float, 
        ema20: float, ema50: float, atr: float, news_sentiment_score: float
    ):
        prompt = f"""
        คุณคือ AI ด้านการวิเคราะห์เทคนิคอลและความเสี่ยง (Dime Expert Advisor)
        - หุ้น: {ticker} | ราคา: ${current_price} | RSI: {rsi} | EMA20: ${ema20} | EMA50: ${ema50} | ATR: ${atr}
        - News Sentiment Score: {news_sentiment_score}

        คำนวณและตอบรูปแบบ JSON เท่านั้น:
        {{
            "signal": "BUY" / "WAIT" / "HOLD",
            "stop_loss": 0.0,
            "take_profit": 0.0,
            "rr_ratio": 0.0,
            "reasons": ["เหตุผล 1", "เหตุผล 2"]
        }}
        """

        if settings.AI_PROVIDER == "cloud" and settings.GEMINI_API_KEY:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            res = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            return res.text
        else:
            payload = {"model": settings.OLLAMA_DEEPSEEK_MODEL, "prompt": prompt, "stream": False}
            res = requests.post(f"{settings.OLLAMA_BASE_URL}/api/generate", json=payload)
            return res.json().get("response", "{}")
