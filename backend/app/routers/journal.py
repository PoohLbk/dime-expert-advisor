from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.trade import TradeJournal
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/v1/journal", tags=["Trade Journal"])

class TradeCreateSchema(BaseModel):
    ticker: str
    buy_price_usd: float
    buy_fx_rate: float
    shares: float

class TradeCloseSchema(BaseModel):
    sell_price_usd: float
    sell_fx_rate: float
    fee_usd: Optional[float] = 0.0

@router.post("/buy")
def record_buy_order(trade: TradeCreateSchema, db: Session = Depends(get_db)):
    db_trade = TradeJournal(
        ticker=trade.ticker.upper(),
        buy_price_usd=trade.buy_price_usd,
        buy_fx_rate=trade.buy_fx_rate,
        shares=trade.shares,
        status="OPEN"
    )
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

@router.post("/sell/{trade_id}")
def record_sell_order(trade_id: int, close_data: TradeCloseSchema, db: Session = Depends(get_db)):
    trade = db.query(TradeJournal).filter(TradeJournal.id == trade_id).first()
    if not trade:
        raise HTTPException(status_code=404, detail="Trade record not found")

    trade.sell_date = datetime.utcnow()
    trade.sell_price_usd = close_data.sell_price_usd
    trade.sell_fx_rate = close_data.sell_fx_rate
    trade.fee_usd = close_data.fee_usd
    trade.status = "CLOSED"

    stock_gain_usd = (close_data.sell_price_usd - trade.buy_price_usd) * trade.shares - close_data.fee_usd
    fx_gain_thb = (close_data.sell_fx_rate - trade.buy_fx_rate) * (trade.buy_price_usd * trade.shares)
    total_pnl_thb = (stock_gain_usd * close_data.sell_fx_rate) + fx_gain_thb

    trade.stock_pnl_usd = round(stock_gain_usd, 2)
    trade.fx_pnl_thb = round(fx_gain_thb, 2)
    trade.total_pnl_thb = round(total_pnl_thb, 2)

    db.commit()
    db.refresh(trade)
    return trade

@router.get("/")
def get_all_trades(db: Session = Depends(get_db)):
    return db.query(TradeJournal).all()
