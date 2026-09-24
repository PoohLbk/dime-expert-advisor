from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.trade import TradeJournal

router = APIRouter(prefix="/api/v1/goal", tags=["Goal Engine"])

@router.get("/monthly-progress")
def get_monthly_progress(target_usd: float = 500.0, db: Session = Depends(get_db)):
    closed_trades = db.query(TradeJournal).filter(TradeJournal.status == "CLOSED").all()
    total_realized_usd = sum([t.stock_pnl_usd for t in closed_trades if t.stock_pnl_usd])
    
    progress_pct = (total_realized_usd / target_usd) * 100 if target_usd > 0 else 0.0

    return {
        "monthly_target_usd": target_usd,
        "current_realized_usd": round(total_realized_usd, 2),
        "progress_percentage": round(progress_pct, 2),
        "status": "ON_TRACK" if progress_pct >= 50 else "NEED_ATTENTION"
    }
