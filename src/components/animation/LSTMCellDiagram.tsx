import { useState } from 'react';
import { DisplayMath } from '../../utils/math.tsx';

export default function LSTMCellDiagram() {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [exploded, setExploded] = useState(false);

  const parts: Record<string, { label: string; desc: string; color: string }> = {
    forget: { label: 'Forget Gate (f_t)', desc: 'Decides what to remove from cell state. σ → [0,1]', color: '#ef4444' },
    input: { label: 'Input Gate (i_t)', desc: 'Decides what new info to add. σ → [0,1]', color: '#22c55e' },
    candidate: { label: 'Candidate (C̃_t)', desc: 'Creates vector of new candidate values. tanh → [-1,1]', color: '#a855f7' },
    output: { label: 'Output Gate (o_t)', desc: 'Decides what to output. σ → [0,1]', color: '#3b82f6' },
    cellState: { label: 'Cell State (C_t)', desc: 'Long-term memory highway. Flows unchanged unless gates modify it.', color: '#f59e0b' },
    hidden: { label: 'Hidden State (h_t)', desc: 'Short-term memory / output. Filtered view of cell state.', color: '#06b6d4' },
    concat: { label: 'Concatenation', desc: 'Combines h_{t-1} and x_t into single vector', color: '#94a3b8' },
  };

  const explodeOffset = exploded ? 20 : 0;

  return (
    <section id="section-4" className="section-fade py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-cyan-400">Anatomy of the Cell</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            The complete LSTM cell — four gates working together to manage memory.
            Hover any part to learn what it does.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive SVG Diagram */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Interactive Cell Diagram</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className="px-3 py-1 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  {showLegend ? 'Hide' : 'Show'} Legend
                </button>
                <button
                  onClick={() => setExploded(!exploded)}
                  className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  {exploded ? 'Reassemble' : 'Deconstruct'}
                </button>
              </div>
            </div>

            <svg viewBox="0 0 500 380" className="w-full" style={{ maxHeight: '400px' }}>
              {/* Cell state highway (top) */}
              <line
                x1="30" y1="60" x2="470" y2="60"
                stroke={hoveredPart === 'cellState' ? '#f59e0b' : '#f59e0b80'}
                strokeWidth={hoveredPart === 'cellState' ? 5 : 3}
                strokeDasharray="8,4"
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredPart('cellState')}
                onMouseLeave={() => setHoveredPart(null)}
              />
              <text x="15" y="55" fill="#f59e0b" fontSize="11" fontWeight="bold">C</text>
              <text x="220" y="45" fill="#f59e0b80" fontSize="10" textAnchor="middle">Cell State Highway</text>

              {/* Hidden state line (bottom) */}
              <line
                x1="30" y1="340" x2="470" y2="340"
                stroke={hoveredPart === 'hidden' ? '#06b6d4' : '#06b6d480'}
                strokeWidth={hoveredPart === 'hidden' ? 4 : 2.5}
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredPart('hidden')}
                onMouseLeave={() => setHoveredPart(null)}
              />
              <text x="15" y="345" fill="#06b6d4" fontSize="11" fontWeight="bold">h</text>

              {/* Input x_t */}
              <line x1="60" y1="380" x2="60" y2="300" stroke="#94a3b8" strokeWidth="2" />
              <text x="60" y="395" fill="#94a3b8" fontSize="11" textAnchor="middle">x_t</text>

              {/* Previous h_{t-1} */}
              <line x1="100" y1="380" x2="100" y2="300" stroke="#06b6d480" strokeWidth="2" />
              <text x="100" y="395" fill="#06b6d4" fontSize="11" textAnchor="middle">h_t-1</text>

              {/* Concatenation box */}
              <rect
                x="50" y="270" width="70" height="30" rx="4"
                fill={hoveredPart === 'concat' ? '#334155' : '#1e293b'}
                stroke={hoveredPart === 'concat' ? '#94a3b8' : '#475569'}
                strokeWidth="1.5"
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredPart('concat')}
                onMouseLeave={() => setHoveredPart(null)}
              />
              <text x="85" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle">[h, x]</text>

              {/* Forget Gate */}
              <g
                transform={`translate(0, ${exploded ? -explodeOffset : 0})`}
                className="transition-transform duration-500"
              >
                <circle
                  cx="170" cy="180" r="28"
                  fill={hoveredPart === 'forget' ? '#ef444430' : '#1e293b'}
                  stroke={hoveredPart === 'forget' ? '#ef4444' : '#ef444480'}
                  strokeWidth={hoveredPart === 'forget' ? 3 : 2}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredPart('forget')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <text x="170" y="175" fill="#ef4444" fontSize="16" textAnchor="middle" fontWeight="bold">σ</text>
                <text x="170" y="192" fill="#ef4444" fontSize="8" textAnchor="middle">×</text>
                <text x="170" y="140" fill="#ef4444" fontSize="10" textAnchor="middle">Forget</text>

                {/* Connection to concat */}
                <line x1="145" y1="200" x2="120" y2="270" stroke="#ef444460" strokeWidth="1.5" />
                {/* Connection to cell state */}
                <line x1="170" y1="152" x2="170" y2="70" stroke="#ef444460" strokeWidth="1.5" />
                {/* Multiply symbol on cell state */}
                <circle cx="170" cy="60" r="8" fill="#0a0e1a" stroke="#ef4444" strokeWidth="1.5" />
                <text x="170" y="64" fill="#ef4444" fontSize="10" textAnchor="middle">×</text>
              </g>

              {/* Input Gate */}
              <g
                transform={`translate(0, ${exploded ? -explodeOffset * 0.5 : 0})`}
                className="transition-transform duration-500"
              >
                <circle
                  cx="260" cy="180" r="28"
                  fill={hoveredPart === 'input' ? '#22c55e30' : '#1e293b'}
                  stroke={hoveredPart === 'input' ? '#22c55e' : '#22c55e80'}
                  strokeWidth={hoveredPart === 'input' ? 3 : 2}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredPart('input')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <text x="260" y="175" fill="#22c55e" fontSize="16" textAnchor="middle" fontWeight="bold">σ</text>
                <text x="260" y="192" fill="#22c55e" fontSize="8" textAnchor="middle">×</text>
                <text x="260" y="140" fill="#22c55e" fontSize="10" textAnchor="middle">Input</text>

                <line x1="235" y1="200" x2="120" y2="280" stroke="#22c55e60" strokeWidth="1.5" />
              </g>

              {/* Candidate (tanh) */}
              <g
                transform={`translate(0, ${exploded ? explodeOffset * 0.5 : 0})`}
                className="transition-transform duration-500"
              >
                <circle
                  cx="340" cy="240" r="28"
                  fill={hoveredPart === 'candidate' ? '#a855f730' : '#1e293b'}
                  stroke={hoveredPart === 'candidate' ? '#a855f7' : '#a855f780'}
                  strokeWidth={hoveredPart === 'candidate' ? 3 : 2}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredPart('candidate')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <text x="340" y="237" fill="#a855f7" fontSize="14" textAnchor="middle" fontWeight="bold">tanh</text>
                <text x="340" y="252" fill="#a855f7" fontSize="8" textAnchor="middle">C̃</text>
                <text x="340" y="285" fill="#a855f7" fontSize="10" textAnchor="middle">Candidate</text>

                <line x1="315" y1="250" x2="120" y2="290" stroke="#a855f760" strokeWidth="1.5" />
                {/* Connection to input gate multiply */}
                <line x1="340" y1="212" x2="340" y2="100" stroke="#a855f760" strokeWidth="1.5" />
                <line x1="340" y1="100" x2="260" y2="100" stroke="#a855f760" strokeWidth="1.5" />
                <line x1="260" y1="100" x2="260" y2="152" stroke="#a855f760" strokeWidth="1.5" />
              </g>

              {/* Add to cell state */}
              <circle cx="260" cy="60" r="10" fill="#0a0e1a" stroke="#f59e0b" strokeWidth="2" />
              <text x="260" y="64" fill="#f59e0b" fontSize="14" textAnchor="middle" fontWeight="bold">+</text>

              {/* Output Gate */}
              <g
                transform={`translate(0, ${exploded ? explodeOffset : 0})`}
                className="transition-transform duration-500"
              >
                <circle
                  cx="420" cy="180" r="28"
                  fill={hoveredPart === 'output' ? '#3b82f630' : '#1e293b'}
                  stroke={hoveredPart === 'output' ? '#3b82f6' : '#3b82f680'}
                  strokeWidth={hoveredPart === 'output' ? 3 : 2}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredPart('output')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <text x="420" y="175" fill="#3b82f6" fontSize="16" textAnchor="middle" fontWeight="bold">σ</text>
                <text x="420" y="192" fill="#3b82f6" fontSize="8" textAnchor="middle">×</text>
                <text x="420" y="140" fill="#3b82f6" fontSize="10" textAnchor="middle">Output</text>

                <line x1="395" y1="200" x2="120" y2="295" stroke="#3b82f660" strokeWidth="1.5" />

                {/* tanh of cell state */}
                <rect x="380" y="80" width="40" height="24" rx="4" fill="#1e293b" stroke="#3b82f680" strokeWidth="1.5" />
                <text x="400" y="96" fill="#3b82f6" fontSize="10" textAnchor="middle">tanh</text>
                <line x1="400" y1="70" x2="400" y2="80" stroke="#3b82f680" strokeWidth="1.5" />
                <line x1="420" y1="152" x2="420" y2="120" stroke="#3b82f680" strokeWidth="1.5" />
                <line x1="420" y1="120" x2="400" y2="120" stroke="#3b82f680" strokeWidth="1.5" />
                <line x1="400" y1="104" x2="400" y2="110" stroke="#3b82f680" strokeWidth="1.5" />

                {/* Output to h_t */}
                <line x1="420" y1="208" x2="420" y2="340" stroke="#06b6d480" strokeWidth="2" />
              </g>

              {/* Output labels */}
              <text x="460" y="55" fill="#f59e0b" fontSize="11" fontWeight="bold">C_t</text>
              <text x="460" y="345" fill="#06b6d4" fontSize="11" fontWeight="bold">h_t</text>
            </svg>

            {/* Legend */}
            {showLegend && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-slate-400" />
                  <span className="text-slate-400">= vector flow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[8px]">σ</div>
                  <span className="text-slate-400">= neural net layer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[8px]">×</div>
                  <span className="text-slate-400">= pointwise multiply</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[8px]">+</div>
                  <span className="text-slate-400">= pointwise add</span>
                </div>
              </div>
            )}

            {/* Hovered part info */}
            {hoveredPart && (
              <div className="mt-4 p-3 rounded-lg border transition-all duration-300" style={{ borderColor: parts[hoveredPart].color + '60', background: parts[hoveredPart].color + '10' }}>
                <p className="font-semibold text-sm" style={{ color: parts[hoveredPart].color }}>
                  {parts[hoveredPart].label}
                </p>
                <p className="text-xs text-slate-400 mt-1">{parts[hoveredPart].desc}</p>
              </div>
            )}
          </div>

          {/* Equations */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-6">The Four Core Equations</h3>

            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-red-900/30 bg-red-500/5">
                <p className="text-xs text-red-400 mb-2 font-semibold">FORGET GATE — What to erase</p>
                <DisplayMath tex="f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)" />
              </div>

              <div className="p-4 rounded-lg border border-green-900/30 bg-green-500/5">
                <p className="text-xs text-green-400 mb-2 font-semibold">INPUT GATE — What to add</p>
                <DisplayMath tex="i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)" />
              </div>

              <div className="p-4 rounded-lg border border-purple-900/30 bg-purple-500/5">
                <p className="text-xs text-purple-400 mb-2 font-semibold">CANDIDATE — New values</p>
                <DisplayMath tex="\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)" />
              </div>

              <div className="p-4 rounded-lg border border-amber-900/30 bg-amber-500/5">
                <p className="text-xs text-amber-400 mb-2 font-semibold">CELL STATE UPDATE</p>
                <DisplayMath tex="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t" />
              </div>

              <div className="p-4 rounded-lg border border-blue-900/30 bg-blue-500/5">
                <p className="text-xs text-blue-400 mb-2 font-semibold">OUTPUT GATE — What to output</p>
                <DisplayMath tex="o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)" />
                <DisplayMath tex="h_t = o_t \odot \tanh(C_t)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
