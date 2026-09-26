import feedparser
import requests
from app.config import settings

class NewsSentimentService:
    @staticmethod
    def fetch_latest_news(ticker: str) -> list:
        rss_url = f"https://news.google.com/rss/search?q={ticker}+stock+when:24h&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(rss_url)
        headlines = [entry.title for entry in feed.entries[:5]]
        return headlines

    def analyze_sentiment(self, ticker: str) -> dict:
        headlines = self.fetch_latest_news(ticker)
        if not headlines:
            return {"sentiment_score": 0.0, "summary": "ไม่มีข่าวสัปดาห์นี้"}

        prompt = f"""
        วิเคราะห์ข่าวภาษาอังกฤษต่อไปนี้ของหุ้น {ticker} และประเมิน Sentiment Score ในช่วง -10 (ข่าวลบวิกฤต) ถึง +10 (ข่าวบวกมหาศาล):
        
        ข่าว:
        {chr(10).join(['- ' + h for h in headlines])}
        
        ตอบกลับเป็นโครงสร้าง JSON ดังนี้เท่านั้น:
        {{"sentiment_score": float, "summary": "สรุปสั้นๆ ภาษาไทย"}}
        """

        try:
            if settings.AI_PROVIDER == "cloud" and settings.GEMINI_API_KEY:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                response = client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt
                )
                return response.text
            else:
                # Local Qwen 2.5 via Ollama
                payload = {
                    "model": settings.OLLAMA_QWEN_MODEL,
                    "prompt": prompt,
                    "stream": False
                }
                res = requests.post(f"{settings.OLLAMA_BASE_URL}/api/generate", json=payload)
                return res.json().get("response", "{}")
        except Exception as e:
            return {"sentiment_score": 0.0, "summary": f"เกิดข้อผิดพลาด: {str(e)}"}
