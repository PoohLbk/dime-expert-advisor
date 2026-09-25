import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [ticker, setTicker] = useState('NVDA');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeStock = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/analyze/${ticker}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "เกิดข้อผิดพลาดในการดึงข้อมูล (ตรวจสอบ API หรือชื่อหุ้น)");
    } finally {
      setLoading(false);
    }
  };

  // พยายาม Parse JSON ของ AI Recommendation ถ้ามันส่งมาเป็น String
  let aiRec = {};
  if (data?.ai_recommendation) {
    try {
      aiRec = typeof data.ai_recommendation === 'string' 
        ? JSON.parse(data.ai_recommendation.replace(/```json/g, '').replace(/```/g, '')) 
        : data.ai_recommendation;
    } catch (e) {
      console.error("Failed to parse AI JSON", e);
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          Dime <span className="text-green">Expert</span> <span className="text-gold">Advisor</span>
        </h1>
        <p className="subtitle">AI-Powered US Stock Analytics & Risk Management</p>
      </header>
      
      <div className="search-section">
        <input 
          type="text" 
          className="search-input"
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyzeStock()}
          placeholder="Enter Ticker (e.g. AAPL)"
        />
        <button 
          className="search-button" 
          onClick={analyzeStock}
          disabled={loading}
        >
          {loading ? 'ANALYZING...' : 'SCAN ASSET'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {data && (
        <div className="dashboard-grid">
          
          {/* Card 1: Technical Data */}
          <div className="card">
            <h3 className="text-green">📊 Market Data</h3>
            <div className="data-row">
              <span className="data-label">Current Price</span>
              <span className="data-value">${data.market_data.current_price}</span>
            </div>
            <div className="data-row">
              <span className="data-label">RSI (14)</span>
              <span className="data-value">{data.market_data.rsi}</span>
            </div>
            <div className="data-row">
              <span className="data-label">EMA 20</span>
              <span className="data-value">${data.market_data.ema20}</span>
            </div>
            <div className="data-row">
              <span className="data-label">EMA 50</span>
              <span className="data-value">${data.market_data.ema50}</span>
            </div>
            <div className="data-row">
              <span className="data-label">ATR (14)</span>
              <span className="data-value">${data.market_data.atr}</span>
            </div>
          </div>

          {/* Card 2: AI Strategy */}
          <div className="card ai-card">
            <h3 className="text-gold">🧠 AI Strategy</h3>
            {aiRec.signal ? (
              <>
                <div className={`signal-badge signal-${aiRec.signal}`}>
                  SIGNAL: {aiRec.signal}
                </div>
                <div className="data-row">
                  <span className="data-label">Take Profit (TP)</span>
                  <span className="data-value text-green">${aiRec.take_profit || '-'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Stop Loss (SL)</span>
                  <span className="data-value" style={{color: '#ff453a'}}>${aiRec.stop_loss || '-'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Risk/Reward</span>
                  <span className="data-value">{aiRec.rr_ratio || '-'}</span>
                </div>
              </>
            ) : (
              <p className="data-label">กำลังประมวลผลข้อมูล AI...</p>
            )}
          </div>

          {/* Card 3: Risk Engine */}
          <div className="card">
            <h3 className="text-white">🛡️ Risk Engine (2%)</h3>
            {data.risk_management.valid ? (
              <>
                <div className="data-row">
                  <span className="data-label">Max Shares</span>
                  <span className="data-value text-gold">{data.risk_management.max_shares}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Capital Required</span>
                  <span className="data-value">${data.risk_management.max_cost_usd}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Max Risk Amount</span>
                  <span className="data-value">${data.risk_management.max_risk_usd}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Risk Per Share</span>
                  <span className="data-value">${data.risk_management.risk_per_share}</span>
                </div>
              </>
            ) : (
              <div className="error-box" style={{marginTop: '20px', padding: '10px'}}>
                {data.risk_management.message || "ไม่สามารถคำนวณความเสี่ยงได้"}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
