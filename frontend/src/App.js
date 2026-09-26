import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function App() {
  const videoRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load hls.js dynamically for the background video
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
    script.onload = () => {
      const videoSrc = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';
      if (window.Hls && window.Hls.isSupported() && videoRef.current) {
        // Set enableWorker: false as requested for sandboxed stability
        const hls = new window.Hls({ enableWorker: false });
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
        });
      } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for native HLS (Safari)
        videoRef.current.src = videoSrc;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const navLinks = ['DASHBOARD', 'FEATURES', 'ABOUT', 'CONTACT'];

  return (
    <div className="relative min-h-screen bg-[#070b0a] text-white font-['Inter'] overflow-hidden">
      {/* Dynamic Font Loading */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@400;500;800&family=Plus+Jakarta+Sans:wght@700&display=swap');
        
        /* Custom CSS for Liquid Glass Card */
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
      `}</style>

      {}
      {/* 1. HLS Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      />

      {/* 2. Grid System (Desktop only) */}
      <div className="absolute inset-0 hidden md:block pointer-events-none z-0">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/10" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-white/10" />
      </div>

      {/* 3. Overlays (Gradients) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/70 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-transparent pointer-events-none z-0" />

      {/* 4. Central Glow SVG */}
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

      {}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tighter">DEA</div>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="text-[16px] text-white/80 hover:text-[#5ed29c] transition-colors font-medium tracking-wide"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <div className={`fixed inset-0 bg-[#070b0a]/95 backdrop-blur-md z-40 flex flex-col justify-center items-center transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col space-y-8 text-center">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="text-2xl text-white hover:text-[#5ed29c] font-medium tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      {}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-screen flex flex-col justify-center pt-24">
        
        {/* Liquid Glass Card */}
        <div className="w-[200px] h-[200px] rounded-[24px] p-6 flex flex-col justify-between -translate-y-[50px] liquid-glass mb-4 transition-transform hover:scale-[1.02] duration-500">
          <div className="text-[14px] font-medium opacity-80 tracking-widest">
            [ 2026 ]
          </div>
          <div>
            <h3 className="text-[18px] leading-snug mb-2 font-medium">
              Powered by <br/>
              <span className="font-['Instrument_Serif'] italic text-[24px] pr-1">AI</span> Strategy
            </h3>
            <p className="text-[11px] text-white/60">
              Real-time US stock analysis
            </p>
          </div>
        </div>

        {/* Hero Typography */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="font-['Plus_Jakarta_Sans'] font-bold text-[11px] text-[#5ed29c] tracking-widest uppercase mb-4">
            AI-Powered Analytics
          </div>
          
          {/* Main Headline */}
          <h1 className="text-[40px] md:text-[72px] font-extrabold uppercase tracking-tight leading-[1.05] mb-6">
            DIME EXPERT ADVISOR<span className="text-[#5ed29c]">.</span>
          </h1>
          
          {/* Description */}
          <p className="text-[14px] text-white/70 max-w-[512px] leading-relaxed mb-10">
            Master the US stock market with advanced technical analysis and strict 2% risk management rules.
          </p>
          
          {/* CTA Button */}
          <button className="bg-[#5ed29c] text-[#070b0a] font-bold text-[14px] uppercase tracking-wide rounded-full px-8 py-4 flex items-center space-x-3 hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300">
            <span>Get Started</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>

      </main>
    </div>
  );
}
