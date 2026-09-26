import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X, ArrowLeft } from 'lucide-react';

// ==========================================
// 1. โลโก้สำหรับหน้า Halo
// ==========================================
const LogoIcon = ({ className }) => (
  <svg viewBox="0 0 256 256" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M 128.005 191.173 C 128.448 156.208 156.93 128 192 128 L 192 64 L 128 64 C 128 99.346 99.346 128 64 128 L 64 192 L 128 192 Z M 192 256 L 64 256 C 28.654 256 0 227.346 0 192 L 0 64 L 64 64 L 64 0 L 192 0 C 227.346 0 256 28.654 256 64 L 256 192 L 192 192 Z" />
  </svg>
);

// ==========================================
// 2. หน้าจอ UI ใหม่ (Halo) - บังคับธีมสีเขียว
// ==========================================
const HaloDashboard = ({ onBack }) => {
  // ตั้งค่าเป็น Theme เขียวตามที่ลูกค้าขอ
  const theme = {
    text: 'text-[#064E3B]',
    textMuted: 'text-[#064E3B]/70',
    textMutedStrong: 'text-[#064E3B]/60',
    btnBg: 'bg-[#064E3B] hover:bg-[#047857]',
    cardBg: 'bg-[#064E3B]',
  };

  const heroBrands = [
    { name: 'Stripe', style: { fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '-0.02em', fontSize: '15px' } },
    { name: 'COINBASE', style: { fontFamily: 'Arial, sans-serif', fontWeight: 900, letterSpacing: '0.08em', fontSize: '13px', textTransform: 'uppercase' } },
    { name: 'Uniswap', style: { fontFamily: '"Trebuchet MS", sans-serif', fontWeight: 600, letterSpacing: '0.01em', fontSize: '15px', fontStyle: 'italic' } },
    { name: 'AAVE', style: { fontFamily: '"Courier New", monospace', fontWeight: 700, letterSpacing: '0.12em', fontSize: '13px', textTransform: 'uppercase' } },
    { name: 'Compound', style: { fontFamily: 'Palatino, "Book Antiqua", serif', fontWeight: 400, letterSpacing: '-0.01em', fontSize: '16px' } }
  ];

  const backerBrands = [
    { name: 'Fundamental Labs', style: { fontFamily: '"Times New Roman", serif', fontWeight: 400, letterSpacing: '0.02em', fontSize: '14px' } },
    { name: 'KUCOIN', style: { fontFamily: '"Arial Black", sans-serif', fontWeight: 900, letterSpacing: '0.08em', fontSize: '16px' } },
    { name: 'NGC', style: { fontFamily: 'Impact, sans-serif', fontWeight: 700, letterSpacing: '0.05em', fontSize: '18px' } },
    { name: 'NxGen', style: { fontFamily: 'Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '17px' } }
  ];

  return (
    <div className="flex flex-col bg-[#F5F5F5] min-h-screen font-['TT_Norms_Pro',_sans-serif] animate-fade-in">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee 22s linear infinite; }
        .backers-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navbar */}
      <div className="h-screen flex flex-col overflow-hidden relative">
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
          <div className="flex items-center justify-between max-w-[88rem] mx-auto">
            <div className={`flex items-center gap-4 ${theme.text}`}>
              <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors" title="Back to DEA">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <LogoIcon className="w-7 h-7" />
                <span className="text-2xl font-medium tracking-tight">Halo</span>
              </div>
            </div>
            <div className="hidden md:flex gap-8">
              {['Network', 'Ecosystem', 'Rewards', 'Help', 'News'].map((link) => (
                <a key={link} href={`#${link}`} className="text-base font-medium text-[#064E3B]/70 hover:text-[#064E3B] transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
            <button className={`${theme.btnBg} text-white text-base font-medium px-7 py-2.5 rounded-full transition-colors duration-200`}>
              Open Wallet
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex-1 px-6 pt-20 pb-6 flex items-end">
          <div className="relative w-full rounded-2xl overflow-hidden max-w-[88rem] mx-auto" style={{ height: 'calc(100vh - 96px)' }}>
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4" />
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-12 pt-36">
              <h1 className={`${theme.text} text-5xl md:text-6xl font-medium leading-tight max-w-xl mb-4`} style={{ letterSpacing: '-0.04em' }}>
                Your Wealth<br />Works
              </h1>
              <p className={`${theme.textMuted} text-base md:text-lg max-w-md mb-8 leading-relaxed`}>
                An automated, reward-powered digital dollar built for native passive earnings and effortless connection into DeFi.
              </p>
              <button className={`inline-flex items-center gap-3 ${theme.btnBg} text-white text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full group`}>
                Join us
                <div className="bg-white rounded-full p-2 group-hover:scale-105 transition-transform duration-200">
                  <ArrowRight className={`w-5 h-5 ${theme.text}`} />
                </div>
              </button>

              <div className="mt-24 w-full max-w-md overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <div className="marquee-track">
                  {[...heroBrands, ...heroBrands, ...heroBrands].map((brand, i) => (
                    <div key={i} className={`mx-7 shrink-0 whitespace-nowrap ${theme.textMutedStrong}`} style={brand.style}>
                      {brand.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Info Section */}
      <section className="bg-[#F5F5F5] px-6 py-24">
        <div className="max-w-[88rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
            <div>
              <h2 className={`${theme.text} text-4xl md:text-5xl font-medium leading-tight mb-8`} style={{ letterSpacing: '-0.03em' }}>
                Meet USD Halo.
              </h2>
              <button className={`inline-flex items-center gap-3 ${theme.btnBg} text-white text-base font-medium pl-8 pr-2 py-2 rounded-full group`}>
                Discover it
                <div className="bg-white rounded-full p-2 group-hover:scale-105 transition-transform duration-200">
                  <ArrowRight className={`w-5 h-5 ${theme.text}`} />
                </div>
              </button>
            </div>
            <div>
              <p className={`${theme.textMuted} text-2xl md:text-3xl leading-relaxed`}>
                USD Halo is a reward-earning dollar coin that lets your savings grow while remaining tied to the U.S. dollar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between" style={{ backgroundImage: 'url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <h3 className={`${theme.text} text-2xl font-medium leading-snug`} style={{ letterSpacing: '-0.02em' }}>Savings that bloom</h3>
              <p className={`${theme.textMuted} text-base max-w-xs`}>Gain steady returns as your dollar tokens are routed into top-performing DeFi strategies.</p>
            </div>
            <div className={`${theme.cardBg} rounded-2xl p-7 min-h-80 flex flex-col justify-between`}>
              <h3 className="text-white text-2xl font-medium whitespace-pre-line">Always fluid,{'\n'}always pegged.</h3>
              <p className="text-white/60 text-base">Keep fully dollar-anchored with on-demand access to funds — no lockups or waits.</p>
            </div>
            <div className={`${theme.cardBg} rounded-2xl p-7 min-h-80 flex flex-col justify-between`}>
              <h3 className="text-white text-2xl font-medium whitespace-pre-line">Fully{'\n'}automated</h3>
              <p className="text-white/60 text-base">Skip the task of tuning positions yourself. USD Halo runs in the background for you.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 3. หน้าแรก (DEA Landing Page) & ตัวจัดการ State
// ==========================================
export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const videoRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isStarted) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
    script.onload = () => {
      const videoSrc = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
      if (window.Hls && window.Hls.isSupported() && videoRef.current) {
        const hls = new window.Hls({ enableWorker: false });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => videoRef.current?.play().catch(() => {}));
      } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = videoSrc;
        videoRef.current.addEventListener('loadedmetadata', () => videoRef.current?.play().catch(() => {}));
      }
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [isStarted]);

  // หากกดปุ่ม Get Started แล้ว ให้แสดงหน้า Halo UI สีเขียว
  if (isStarted) {
    return <HaloDashboard onBack={() => setIsStarted(false)} />;
  }

  // หากยังไม่กดปุ่ม ให้แสดงหน้าแรก (DEA)
  return (
    <div className="relative min-h-screen bg-[#070b0a] text-white font-['Inter'] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@400;500;800&family=Plus+Jakarta+Sans:wght@700&display=swap');
        .liquid-glass {
          background: rgba(255, 255, 255, 0.01); background-blend-mode: luminosity; backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px); box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1); position: relative;
        }
        .liquid-glass::before {
          content: ""; position: absolute; inset: 0; padding: 1.4px; border-radius: inherit;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
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
          <defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="25" /></filter></defs>
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
