from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class TradeJournal(Base):
    __tablename__ = "trade_journals"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, index=True, nullable=False)
    buy_date = Column(DateTime, default=datetime.utcnow)
    buy_price_usd = Column(Float, nullable=False)
    buy_fx_rate = Column(Float, nullable=False) # THB/USD ณ วันซื้อ
    shares = Column(Float, nullable=False)
    
    sell_date = Column(DateTime, nullable=True)
    sell_price_usd = Column(Float, nullable=True)
    sell_fx_rate = Column(Float, nullable=True) # THB/USD ณ วันขาย
    fee_usd = Column(Float, default=0.0)
    
    stock_pnl_usd = Column(Float, nullable=True) # Realized Gain/Loss Pure Stock
    fx_pnl_thb = Column(Float, nullable=True)    # Realized Gain/Loss FX
    total_pnl_thb = Column(Float, nullable=True) # Total Net PnL in THB
    status = Column(String, default="OPEN")      # "OPEN" | "CLOSED"
