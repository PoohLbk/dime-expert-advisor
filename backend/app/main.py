from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- 1. ต้องมีบรรทัดนี้ด้านบนสุด
from app.routers import analysis, journal, goal

app = FastAPI(title="Dime Expert Advisor API")

# --- 2. เพิ่มโค้ดชุดนี้เข้าไปเพื่อปลดล็อคการเชื่อมต่อ ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # อนุญาตให้ทุกโดเมนเข้าถึงได้
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------------------

app.include_router(analysis.router, prefix="/api/v1")
app.include_router(journal.router, prefix="/api/v1")
app.include_router(goal.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Dime Expert Advisor (DEA) API", "status": "running"}
