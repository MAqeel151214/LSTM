import { useEffect, useState } from 'react';

const WORDS = ['The', 'clouds', 'are', 'dark', 'and', 'the', 'sky', 'will', 'bring'];

export default function Hero() {
  const [activeWord, setActiveWord] = useState(0);
  const [gateFlash, setGateFlash] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % WORDS.length);
      const gates = ['forget', 'input', 'candidate', 'output'];
      setGateFlash(gates[Math.floor(Math.random() * gates.length)]);
      setTimeout(() => setGateFlash(null), 500);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const gateColor = (gate: string) => {
    switch (gate) {
      case 'forget': return '#ef4444';
      case 'input': return '#22c55e';
      case 'candidate': return '#a855f7';
      case 'output': return '#3b82f6';
      default: return '#64748b';
    }
  };

  return (
    <section id="section-0" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated LSTM Cell SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg width="600" height="400" viewBox="0 0 600 400">
          {/* Cell state conveyor */}
          <line x1="50" y1="100" x2="550" y2="100" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10,5" opacity="0.6">
            <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="2s" repeatCount="indefinite" />
          </line>
          {/* Gates */}
          <circle cx="200" cy="200" r="30" fill="none" stroke="#ef4444" strokeWidth="2" opacity={gateFlash === 'forget' ? 1 : 0.4}>
            <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="200" r="30" fill="none" stroke="#22c55e" strokeWidth="2" opacity={gateFlash === 'input' ? 1 : 0.4}>
            <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="200" r="30" fill="none" stroke="#a855f7" strokeWidth="2" opacity={gateFlash === 'candidate' ? 1 : 0.4}>
            <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="500" cy="200" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" opacity={gateFlash === 'output' ? 1 : 0.4}>
            <animate attributeName="r" values="28;32;28" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Hidden state */}
          <line x1="500" y1="280" x2="550" y2="280" stroke="#06b6d4" strokeWidth="3" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Word stream */}
        <div className="mb-8 flex items-center justify-center gap-2 flex-wrap">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={`font-mono text-lg md:text-xl transition-all duration-500 ${
                i === activeWord
                  ? 'text-white scale-110 font-bold'
                  : i < activeWord
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              {word}
            </span>
          ))}
          <span className="inline-block w-2 h-6 bg-blue-400 animate-pulse ml-1" />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">The Memory Machine</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
          An Interactive Journey Inside the LSTM
        </p>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          How does a machine remember a word from 100 sentences ago?
        </p>

        {/* Gate legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { name: 'Forget', color: '#ef4444' },
            { name: 'Input', color: '#22c55e' },
            { name: 'Candidate', color: '#a855f7' },
            { name: 'Output', color: '#3b82f6' },
          ].map((gate) => (
            <div key={gate.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50">
              <div className="w-3 h-3 rounded-full" style={{ background: gate.color }} />
              <span className="text-sm text-slate-300">{gate.name}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce">
          <svg className="w-8 h-8 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <p className="text-sm text-slate-500 mt-2">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
