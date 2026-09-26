# Dime Expert Advisor (DEA)

ระบบ AI ช่วยวิเคราะห์หุ้น US วางแผน DCA คํานวณความเสี่ยง และติดตามพอร์ตการลงทุนผ่านแอป Dime

## Features
- **AI Multi-Model:** รองรับทั้ง Cloud AI (Gemini 2.5) และ Local AI (Ollama - DeepSeek-R1 / Qwen 2.5)
- **Technical Analysis:** คำนวณ EMA, RSI, ATR และแนวรับ/แนวต้านอัตโนมัติด้วย `yfinance` & `pandas-ta`
- **Risk & Money Management Engine:** คุมความเสี่ยงไม่เกิน 2% ต่อไม้ และคำนวณสัดส่วนงบ DCA
- **FX Risk Tracking:** คำนวณ Realized P&L แยกตามราคาหุ้น (USD) และอัตราแลกเปลี่ยน (THB/USD)
- **Automation:** GitHub Actions รันวิเคราะห์สแกนหุ้นรายวันก่อนตลาดเปิด

## Quick Start (Development)
```bash
# 1. Clone repository
git clone [https://github.com/your-username/dime-expert-advisor.git](https://github.com/your-username/dime-expert-advisor.git)
cd dime-expert-advisor

# 2. Setup Backend Environment
cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Setup Environment Variables
cp ../.env.example .env
# แก้ไขไฟล์ .env และใส่ GEMINI_API_KEY

# 4. Start Server
uvicorn app.main:app --reload
