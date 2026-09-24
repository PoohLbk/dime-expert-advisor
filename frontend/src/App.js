import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [ticker, setTicker] = useState('NVDA');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeStock = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/analyze/${ticker}`);
      setData(res.data);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Dime Expert Advisor (DEA) Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', marginRight: '10px' }}
        />
        <button onClick={analyzeStock} style={{ padding: '8px 16px', fontSize: '16px' }}>
          {loading ? 'กำลังวิเคราะห์...' : 'สแกนหุ้นด้วย AI'}
        </button>
      </div>

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>📊 ข้อมูลราคา & Technical Indicator</h3>
            <p><strong>ราคาปัจจุบัน:</strong> ${data.market_data.current_price}</p>
            <p><strong>RSI (14):</strong> {data.market_data.rsi}</p>
            <p><strong>EMA 20:</strong> ${data.market_data.ema20}</p>
            <p><strong>EMA 50:</strong> ${data.market_data.ema50}</p>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>🛡️ คำนวณความเสี่ยง (2% Risk Rule)</h3>
            <p><strong>หุ้นที่ซื้อได้สูงสุด:</strong> {data.risk_management.max_shares} หุ้น</p>
            <p><strong>มูลค่าที่ต้องใช้:</strong> ${data.risk_management.max_cost_usd}</p>
            <p><strong>ความเสี่ยงสูงสุด ($):</strong> ${data.risk_management.max_risk_usd}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
