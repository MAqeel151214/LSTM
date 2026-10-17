import { useState } from 'react';

interface Variant {
  name: string;
  year: string;
  desc: string;
  gates: number;
  changes: string[];
  color: string;
  icon: string;
}

const VARIANTS: Variant[] = [
  {
    name: 'Vanilla LSTM',
    year: '1997',
    desc: 'The original. Four gates, cell state highway, forget/input/output/candidate.',
    gates: 4,
    changes: ['Baseline architecture'],
    color: '#f59e0b',
    icon: '🏛️',
  },
  {
    name: 'Peephole LSTM',
    year: '2000',
    desc: 'Adds direct connections from cell state to gate inputs. Gates can "see" the memory.',
    gates: 4,
    changes: ['Cell → Forget gate', 'Cell → Input gate', 'Cell → Output gate'],
    color: '#a855f7',
    icon: '👁️',
  },
  {
    name: 'GRU',
    year: '2014',
    desc: 'Merges forget and input into a single "update" gate. No separate cell state — simpler and faster.',
    gates: 2,
    changes: ['Forget + Input → Update gate', 'No separate cell state', 'Reset gate controls flow'],
    color: '#22c55e',
    icon: '⚡',
  },
  {
    name: 'Bidirectional LSTM',
    year: '2005',
    desc: 'Two LSTMs running in opposite directions. Captures both past and future context.',
    gates: 8,
    changes: ['Forward LSTM', 'Backward LSTM', 'Concatenated outputs'],
    color: '#3b82f6',
    icon: '↔️',
  },
  {
    name: 'Stacked LSTM',
    year: '2013',
    desc: 'Multiple LSTM layers. Each layer learns higher-level temporal features.',
    gates: 8,
    changes: ['Layer 1: low-level patterns', 'Layer 2: mid-level features', 'Layer 3+: abstract patterns'],
    color: '#ef4444',
    icon: '📚',
  },
  {
    name: 'xLSTM',
    year: '2024',
    desc: 'Hochreiter\'s return! Exponential gating + new memory structures. Competitive with Transformers.',
    gates: 4,
    changes: ['Exponential gating (no sigmoid)', 'New memory cell structure', 'Stabilized training'],
    color: '#06b6d4',
    icon: '🚀',
  },
];

export default function Variants() {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="section-7" className="section-fade py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-blue-400">Variants & Family Tree</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            The LSTM spawned an entire family of architectures. Each variant makes a different trade-off.
          </p>
        </div>

        {/* Variant cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {VARIANTS.map((variant, i) => (
            <button
              key={variant.name}
              onClick={() => setSelectedVariant(i)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 card-hover ${
                selectedVariant === i
                  ? 'border-opacity-100 bg-slate-800/50 scale-[1.02]'
                  : 'border-slate-700 bg-slate-800/20 hover:bg-slate-800/40'
              }`}
              style={{
                borderColor: selectedVariant === i ? variant.color : undefined,
                boxShadow: selectedVariant === i ? `0 0 20px ${variant.color}20` : undefined,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{variant.icon}</span>
                <div>
                  <h4 className="font-semibold text-white text-sm">{variant.name}</h4>
                  <span className="text-xs text-slate-500">{variant.year}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{variant.desc}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-[10px] text-slate-500">{variant.gates} gates</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected variant detail */}
        <div
          className="bg-slate-800/30 border rounded-2xl p-6 mb-8 transition-all duration-300"
          style={{ borderColor: VARIANTS[selectedVariant].color + '40' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{VARIANTS[selectedVariant].icon}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: VARIANTS[selectedVariant].color }}>
                {VARIANTS[selectedVariant].name}
              </h3>
              <span className="text-sm text-slate-500">{VARIANTS[selectedVariant].year}</span>
            </div>
          </div>
          <p className="text-slate-300 mb-4">{VARIANTS[selectedVariant].desc}</p>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-3 font-semibold">What changes from vanilla LSTM:</p>
            <ul className="space-y-2">
              {VARIANTS[selectedVariant].changes.map((change, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full" style={{ background: VARIANTS[selectedVariant].color }} />
                  {change}
                </li>
              ))}
            </ul>
          </div>

          {/* Mini gate diagram */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: VARIANTS[selectedVariant].gates }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  borderColor: VARIANTS[selectedVariant].color,
                  color: VARIANTS[selectedVariant].color,
                  background: VARIANTS[selectedVariant].color + '15',
                }}
              >
                {i < 4 ? ['f', 'i', 'C̃', 'o'][i] : i < 6 ? ['r', 'z'][i - 4] : 'L' + (i - 5)}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison toggle */}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm mb-6"
        >
          {showComparison ? 'Hide' : 'Show'} Side-by-Side Comparison
        </button>

        {showComparison && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-3 text-slate-400">Architecture</th>
                  <th className="text-center p-3 text-slate-400">Gates</th>
                  <th className="text-center p-3 text-slate-400">Cell State</th>
                  <th className="text-center p-3 text-slate-400">Key Innovation</th>
                  <th className="text-center p-3 text-slate-400">Speed</th>
                </tr>
              </thead>
              <tbody>
                {VARIANTS.map((v) => (
                  <tr key={v.name} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="p-3">
                      <span className="mr-2">{v.icon}</span>
                      <span className="text-white">{v.name}</span>
                    </td>
                    <td className="text-center p-3 font-mono" style={{ color: v.color }}>{v.gates}</td>
                    <td className="text-center p-3">
                      {v.name === 'GRU' ? (
                        <span className="text-xs text-slate-500">Merged</span>
                      ) : (
                        <span className="text-xs text-amber-400">Yes</span>
                      )}
                    </td>
                    <td className="text-center p-3 text-xs text-slate-400">{v.changes[0]}</td>
                    <td className="text-center p-3">
                      {v.gates <= 2 ? '🟢 Fast' : v.gates <= 4 ? '🟡 Medium' : '🔴 Slower'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
