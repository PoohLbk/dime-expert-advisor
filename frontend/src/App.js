import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X, Activity, ShieldAlert, Target } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'https://dime-expert-advisor.onrender.com';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const videoRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dashboard States
  const [ticker, setTicker] = useState('NVDA');
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isStarted) return; // ไม่โหลดวิดีโอถ้าอยู่หน้า Dashboard

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
    script.onload = () => {
      const videoSrc = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
      if (window.Hls && window.Hls.isSupported() && videoRef.current) {
        const hls = new window.Hls({ enableWorker: false });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(err => console.log('Autoplay prevented:', err));
        });
      } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(err => console.log('Autoplay prevented:', err));
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isStarted]);

  const analyzeStock = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setData(null);
    setChartData([]);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/analyze/${ticker}`);
      setData(res.data);
      
      const current = res.data.market_data.current_price;
      const mockHistory = Array.from({length: 14}).map((_, i) => ({
        day: `Day ${i + 1}`,
        price: current * (1 + (Math.random() - 0.5) * 0.05),
      }));
      mockHistory.push({ day: 'Current', price: current });
      setChartData(mockHistory);

    } catch (err) {
      setError(err.response?.data?.detail || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

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

  // --------------------------------------------------------
  // VIEW 2: DASHBOARD SCREEN
  // --------------------------------------------------------
  if (isStarted) {
    return (
      <div className="min-h-screen bg-[#070b0a] text-white font-['Inter'] p-6 md:p-12">
        <header className="flex justify-between items-center mb-12">
          <div className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => setIsStarted(false)}>
            DEA<span className="text-[#5ed29c]">.</span>
          </div>
          <button onClick={() => setIsStarted(false)} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Back to Home
          </button>
        </header>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">AI Stock Scanner</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-2xl">
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && analyzeStock()}
              placeholder="Enter Ticker (e.g. AAPL, NVDA)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#5ed29c] transition-colors text-lg uppercase tracking-wide"
            />
            <button 
              onClick={analyzeStock}
              disabled={loading}
              className="bg-[#5ed29c] text-[#070b0a] font-bold px-10 py-4 rounded-xl hover:bg-white active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'ANALYZING...' : 'SCAN ASSET'}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-xl mb-8">
              {error}
            </div>
          )}

          {data && (
            <div className="space-y-8 animate-fade-in">
              {/* Chart Section */}
              {chartData.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 h-[400px]">
                  <h3 className="text-lg font-semibold text-white/80 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-[#5ed29c]" /> 
                    {ticker} Price Trend (14 Days)
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                      <XAxis dataKey="day" stroke="#525252" fontSize={12} tickMargin={10} />
                      <YAxis domain={['auto', 'auto']} stroke="#525252" fontSize={12} tickFormatter={(val) => `$${val}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                        itemStyle={{ color: '#5ed29c' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#5ed29c" 
                        strokeWidth={3}
                        dot={{ fill: '#070b0a', stroke: '#5ed29c', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#5ed29c' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Market Data */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white/80 mb-6 flex items-center gap-2">
                    <Target size={20} className="text-[#5ed29c]" /> Market Data
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-white/50 text-sm">Current Price</span>
                      <span className="font-medium text-lg">${data.market_data.current_price}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-white/50 text-sm">RSI (14)</span>
                      <span className="font-medium text-lg">{data.market_data.rsi}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-white/50 text-sm">EMA 20</span>
                      <span className="font-medium text-lg">${data.market_data.ema20}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-white/50 text-sm">EMA 50</span>
                      <span className="font-medium text-lg">${data.market_data.ema50}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">ATR (14)</span>
                      <span className="font-medium text-lg">${data.market_data.atr}</span>
                    </div>
                  </div>
                </div>

                {/* AI Strategy */}
                <div className="bg-[#5ed29c]/10 border border-[#5ed29c]/30 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#5ed29c]/20 blur-3xl rounded-full -mr-10 -mt-10" />
                  <h3 className="text-lg font-semibold text-[#5ed29c] mb-6 flex items-center gap-2 relative z-10">
                    <Activity size={20} /> AI Strategy
                  </h3>
                  {aiRec.signal ? (
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white/50 text-sm">Signal</span>
                        <span className={`font-bold text-lg px-3 py-1 rounded-md ${aiRec.signal === 'BUY' ? 'bg-[#5ed29c] text-black' : aiRec.signal === 'WAIT' ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                          {aiRec.signal}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white/50 text-sm">Take Profit</span>
                        <span className="font-medium text-[#5ed29c] text-lg">${aiRec.take_profit || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white/50 text-sm">Stop Loss</span>
                        <span className="font-medium text-red-400 text-lg">${aiRec.stop_loss || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">Risk/Reward</span>
                        <span className="font-medium text-lg">{aiRec.rr_ratio || '-'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/50 text-sm">กำลังประมวลผลข้อมูล AI...</p>
                  )}
                </div>

                {/* Risk Engine */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white/80 mb-6 flex items-center gap-2">
                    <ShieldAlert size={20} className="text-yellow-500" /> Risk Engine (2%)
                  </h3>
                  {data.risk_management.valid ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white/50 text-sm">Max Shares</span>
                        <span className="font-bold text-yellow-500 text-xl">{data.risk_management.max_shares}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white/50 text-sm">Capital Required</span>
                        <span className="font-medium text-lg">${data.risk_management.max_cost_usd}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-white/50 text-sm">Max Risk Amount</span>
                        <span className="font-medium text-lg">${data.risk_management.max_risk_usd}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">Risk Per Share</span>
                        <span className="font-medium text-lg">${data.risk_management.risk_per_share}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-400 text-sm">{data.risk_management.message}</p>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // VIEW 1: HERO LANDING PAGE
  // --------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#070b0a] text-white font-['Inter'] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@400;500;800&family=Plus+Jakarta+Sans:wght@700&display=swap');
        .liquid-glass {
          background: rgba(255, 255, 255, 0.01);
          background-blend-mode: luminosity;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
          position: relative;
        }
        .liquid-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1.4px;
          border-radius: inherit;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" />

      <div className="absolute inset-0 hidden md:block pointer-events-none z-0">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/10" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/70 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-transparent pointer-events-none z-0" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0">
        <svg viewBox="0 0 800 500" className="w-full h-full opacity-50">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="25" />
            </filter>
          </defs>
          <ellipse cx="400" cy="50" rx="350" ry="150" fill="#0c4a45" filter="url(#glow)" />
        </svg>
      </div>

      <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter cursor-pointer">DEA</div>
        <nav className="hidden md:flex space-x-10">
          {['DASHBOARD', 'FEATURES', 'ABOUT', 'CONTACT'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[16px] text-white/80 hover:text-[#5ed29c] transition-colors font-medium tracking-wide">{link}</a>
          ))}
        </nav>
        <button className="md:hidden text-white z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      <div className={`fixed inset-0 bg-[#070b0a]/95 backdrop-blur-md z-40 flex flex-col justify-center items-center transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col space-y-8 text-center">
          {['DASHBOARD', 'FEATURES', 'ABOUT', 'CONTACT'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-2xl text-white hover:text-[#5ed29c] font-medium tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>{link}</a>
          ))}
        </nav>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-screen flex flex-col justify-center pt-24 animate-fade-in">
        <div className="w-[200px] h-[200px] rounded-[24px] p-6 flex flex-col justify-between -translate-y-[50px] liquid-glass mb-4 transition-transform hover:scale-[1.02] duration-500">
          <div className="text-[14px] font-medium opacity-80 tracking-widest">[ 2026 ]</div>
          <div>
            <h3 className="text-[18px] leading-snug mb-2 font-medium">Powered by <br/><span className="font-['Instrument_Serif'] italic text-[24px] pr-1">AI</span> Strategy</h3>
            <p className="text-[11px] text-white/60">Real-time US stock analysis</p>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#5ed29c] tracking-widest uppercase mb-4">AI-Powered Analytics</div>
          <h1 className="text-[40px] md:text-[72px] font-extrabold uppercase tracking-tight leading-[1.05] mb-6">
            DIME EXPERT ADVISOR<span className="text-[#5ed29c]">.</span>
          </h1>
          <p className="text-[14px] text-white/70 max-w-[512px] leading-relaxed mb-10">
            Master the US stock market with advanced technical analysis and strict 2% risk management rules.
          </p>
          
          {/* อัปเดตปุ่ม Get Started ให้เปลี่ยนหน้าจอ */}
          <button 
            onClick={() => setIsStarted(true)} 
            className="bg-[#5ed29c] text-[#070b0a] font-bold text-[14px] uppercase tracking-wide rounded-full px-8 py-4 flex items-center space-x-3 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <span>Get Started</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </main>
    </div>
  );
}
