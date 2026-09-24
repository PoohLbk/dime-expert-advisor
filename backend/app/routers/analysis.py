from fastapi import APIRouter, HTTPException
from app.services.market_data import MarketDataService
from app.services.news_sentiment import NewsSentimentService
from app.services.ai_strategy import AIStrategyEngine
from app.services.risk_engine import RiskEngine

router = APIRouter(prefix="/api/v1/analyze", tags=["Analysis"])

market_service = MarketDataService()
news_service = NewsSentimentService()
ai_strategy = AIStrategyEngine()

@router.get("/{ticker}")
def analyze_stock(ticker: str, account_balance: float = 1000.0):
    indicators = market_service.get_stock_indicators(ticker)
    if "error" in indicators:
        raise HTTPException(status_code=400, detail=indicators["error"])

    news_res = news_service.analyze_sentiment(ticker)
    
    ai_decision = ai_strategy.analyze_trading_signal(
        ticker=ticker,
        current_price=indicators["current_price"],
        rsi=indicators["rsi"],
        ema20=indicators["ema20"],
        ema50=indicators["ema50"],
        atr=indicators["atr"],
        news_sentiment_score=news_res.get("sentiment_score", 0.0)
    )

    stop_loss_est = indicators["current_price"] - (indicators["atr"] * 1.5)
    risk_info = RiskEngine.calculate_position_size(
        account_balance=account_balance,
        entry_price=indicators["current_price"],
        stop_loss_price=stop_loss_est
    )

    return {
        "market_data": indicators,
        "sentiment": news_res,
        "ai_recommendation": ai_decision,
        "risk_management": risk_info
    }
