import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Recap() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    const el = document.getElementById('section-8');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const summaryPoints = [
    {
      icon: '❌',
      title: 'The Problem',
      desc: 'Vanilla RNNs suffer from vanishing gradients — they literally cannot remember things from many steps ago.',
      color: '#ef4444',
    },
    {
      icon: '🛤️',
      title: 'The Solution',
      desc: 'The LSTM adds a "cell state highway" where information flows via addition, not multiplication — preserving gradients.',
      color: '#f59e0b',
    },
    {
      icon: '🚪',
      title: 'The Gates',
      desc: 'Four learned gates (forget, input, candidate, output) control what enters, stays in, and leaves the memory.',
      color: '#22c55e',
    },
    {
      icon: '🧮',
      title: 'The Math',
      desc: 'Sigmoid gates output [0,1] for "how much." Tanh creates candidates in [-1,1]. Element-wise ops combine them.',
      color: '#a855f7',
    },
    {
      icon: '🌍',
      title: 'The Impact',
      desc: 'LSTMs powered speech recognition, machine translation, handwriting generation, and much more for two decades.',
      color: '#3b82f6',
    },
  ];

  return (
    <section id="section-8" className="section-fade py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Animated summary loop */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Full Picture</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            From tokens in to predictions out — the LSTM's complete journey in one animation.
          </p>
        </div>

        {/* Animated flow diagram */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 mb-12 overflow-hidden">
          <svg viewBox="0 0 800 120" className="w-full">
            {/* Input tokens */}
            <g>
              {['The', 'clouds', 'are', 'dark'].map((word, i) => (
                <g key={i}>
                  <rect x={30 + i * 80} y="40" width="60" height="30" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                  <text x={60 + i * 80} y="60" fill="#94a3b8" fontSize="11" textAnchor="middle">{word}</text>
                </g>
              ))}
            </g>

            {/* Arrow */}
            <line x1="360" y1="55" x2="420" y2="55" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
              </marker>
            </defs>

            {/* LSTM Cell */}
            <rect x="430" y="20" width="120" height="70" rx="12" fill="#1a2035" stroke="#3b82f6" strokeWidth="2" />
            <text x="490" y="45" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">LSTM</text>
            <text x="490" y="62" fill="#64748b" fontSize="9" textAnchor="middle">Cell</text>

            {/* Gates inside */}
            <circle cx="455" cy="72" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <circle cx="475" cy="72" r="5" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            <circle cx="495" cy="72" r="5" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <circle cx="515" cy="72" r="5" fill="none" stroke="#3b82f6" strokeWidth="1.5" />

            {/* Cell state line */}
            <line x1="430" y1="30" x2="550" y2="30" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2">
              <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Arrow out */}
            <line x1="560" y1="55" x2="620" y2="55" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Prediction */}
            <rect x="630" y="35" width="140" height="40" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="700" y="52" fill="#06b6d4" fontSize="11" textAnchor="middle" fontWeight="bold">rain: 62%</text>
            <text x="700" y="67" fill="#64748b" fontSize="9" textAnchor="middle">sky: 21% ...</text>

            {/* Animated particle */}
            <circle r="4" fill="#3b82f6" opacity="0.8">
              <animateMotion dur="3s" repeatCount="indefinite" path="M60,55 L360,55 L430,55 L550,55 L630,55 L700,55" />
            </circle>
          </svg>
        </div>

        {/* TL;DR Summary */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6 text-center">TL;DR — Five Key Takeaways</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {summaryPoints.map((point, i) => (
              <div
                key={i}
                className={`bg-slate-800/30 border rounded-xl p-4 transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  borderColor: point.color + '40',
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                <div className="text-2xl mb-2">{point.icon}</div>
                <h4 className="font-semibold text-sm mb-2" style={{ color: point.color }}>{point.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real-world applications */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 mb-12">
          <h3 className="text-lg font-bold text-white mb-6 text-center">🌍 Real-World Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: '🎤', name: 'Speech Recognition', desc: 'Google Voice, Siri' },
              { icon: '🌐', name: 'Machine Translation', desc: 'Google Translate (2016-2020)' },
              { icon: '📈', name: 'Time Series', desc: 'Stock prices, weather' },
              { icon: '✍️', name: 'Text Generation', desc: 'Character-level models' },
              { icon: '🎬', name: 'Video Captioning', desc: 'Describe what you see' },
              { icon: '✏️', name: 'Handwriting', desc: 'Alex Graves\' demos' },
            ].map((app) => (
              <div key={app.name} className="bg-slate-900/50 rounded-lg p-3 text-center border border-slate-700 hover:border-blue-500/30 transition-colors">
                <div className="text-2xl mb-1">{app.icon}</div>
                <p className="text-xs font-semibold text-white">{app.name}</p>
                <p className="text-[10px] text-slate-500">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">📚 Credits & References</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> Christopher Olah — <em>"Understanding LSTM Networks"</em> (2015)
              </p>
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> Hochreiter & Schmidhuber — <em>"Long Short-Term Memory"</em> (1997)
              </p>
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> Michael Phi — <em>"LSTM: Illustrated Guide"</em>
              </p>
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> Greff et al. — <em>"LSTM: A Search Space Odyssey"</em> (2015)
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> Cho et al. — <em>"Learning Phrase Representations using RNN Encoder-Decoder"</em> (2014)
              </p>
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> Hochreiter et al. — <em>"xLSTM: Extended Long Short-Term Memory"</em> (2024)
              </p>
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> VizLearn — Gradient decay visualization inspiration
              </p>
              <p className="text-slate-400">
                <span className="text-blue-300">•</span> IBM — Numeric LSTM walkthrough
              </p>
            </div>
          </div>
        </div>

        {/* Bridge to the Numerical Walkthrough */}
        <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-amber-950/40 border border-slate-700/80 rounded-2xl p-6 md:p-8 mb-12 text-center">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">Next Level</span>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1 mb-3">
            Want to see what actually happens to the numbers?
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            We traced a toy 2D LSTM by hand through 3 timesteps. Every dot product, every activation, and the entire backward pass (BPTT) with zero hand-waving.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            <span>Read the Numerical Walkthrough</span>
            <span>→</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-2">
            Built with React, Tailwind CSS, KaTeX, and a love for clear explanations.
          </p>
          <p className="text-xs text-slate-600">
            Inspired by the best science communicators: Olah, StatQuest, 3Blue1Brown, and the deep learning community.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
        </footer>
      </div>
    </section>
  );
}
