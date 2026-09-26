import requests
import json
import re
from app.config import settings

class AIStrategyEngine:
    def analyze_trading_signal(
        self, ticker: str, current_price: float, rsi: float, 
        ema20: float, ema50: float, atr: float, news_sentiment_score: float
    ):
        prompt = """
        คุณคือ AI ด้านการวิเคราะห์เทคนิคอลและความเสี่ยง (Dime Expert Advisor)
        - หุ้น: {ticker} | ราคา: ${current_price} \vert{} RSI: {rsi} \vert{} EMA20:${ema20} | EMA50: ${ema50} \vert{} ATR:${atr}
        - News Sentiment Score: {news_sentiment_score}

        คำนวณและตอบรูปแบบ JSON เท่านั้น:
        {{
            "signal": "BUY" / "WAIT" / "HOLD",
            "stop_loss": 0.0,
            "take_profit": 0.0,
            "rr_ratio": 0.0,
            "reasons": ["เหตุผล 1", "เหตุผล 2"]
        }}
        """.format(
            ticker=ticker,
            current_price=current_price,
            rsi=rsi,
            ema20=ema20,
            ema50=ema50,
            atr=atr,
            news_sentiment_score=news_sentiment_score
        )

        raw_text = ""

        # 1. ดึงข้อความดิบจาก AI ตาม Provider ที่ตั้งค่าไว้
        if settings.AI_PROVIDER == "cloud" and settings.GEMINI_API_KEY:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            res = client.models.generate_content(model="gemini-3.8-flash", contents=prompt)
            raw_text = res.text
        else:
            payload = {"model": settings.OLLAMA_DEEPSEEK_MODEL, "prompt": prompt, "stream": False}
            res = requests.post(f"{settings.OLLAMA_BASE_URL}/api/generate", json=payload)
            raw_text = res.json().get("response", "{}")

        # 2. ทำความสะอาดข้อความ (ลบ ```json และ ``` ออกให้หมด)
        clean_text = re.sub(r'```(?:json)?', '', raw_text).strip()
        
        # 3. แปลงเป็น Dictionary
        try:
            ai_data = json.loads(clean_text)
        except json.JSONDecodeError:
            ai_data = {
                "signal": "WAIT",
                "stop_loss": 0.0,
                "take_profit": 0.0,
                "rr_ratio": 0.0,
                "reasons": ["AI Response Format Error"]
            }
        
        return ai_data
