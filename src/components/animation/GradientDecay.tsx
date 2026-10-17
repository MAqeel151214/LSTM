import { useState, useMemo } from 'react';

export default function GradientDecay() {
  const [steps, setSteps] = useState(10);
  const [rnnDecay, setRnnDecay] = useState(0.87);
  const [lstmDecay, setLstmDecay] = useState(0.99);

  const rnnGradient = useMemo(() => {
    return Math.pow(rnnDecay, steps);
  }, [rnnDecay, steps]);

  const lstmGradient = useMemo(() => {
    return Math.pow(lstmDecay, steps);
  }, [lstmDecay, steps]);

  const ratio = lstmGradient > 0 ? lstmGradient / Math.max(rnnGradient, 1e-20) : Infinity;

  // Generate decay curves
  const rnnCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 30; i++) {
      points.push({ step: i, value: Math.pow(rnnDecay, i) });
    }
    return points;
  }, [rnnDecay]);

  const lstmCurve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 30; i++) {
      points.push({ step: i, value: Math.pow(lstmDecay, i) });
    }
    return points;
  }, [lstmDecay]);

  const formatNum = (n: number) => {
    if (n === Infinity) return '∞';
    if (n < 0.0001) return n.toExponential(1);
    if (n < 0.01) return n.toFixed(6);
    return n.toFixed(4);
  };

  // SVG chart dimensions
  const chartW = 500;
  const chartH = 200;
  const padding = 40;

  const toSVG = (points: { step: number; value: number }[]) => {
    return points.map((p) => ({
      x: padding + (p.step / 30) * (chartW - 2 * padding),
      y: padding + (1 - p.value) * (chartH - 2 * padding),
    }));
  };

  const rnnPath = toSVG(rnnCurve);
  const lstmPath = toSVG(lstmCurve);

  const pathToString = (pts: { x: number; y: number }[]) => {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  };

  return (
    <section id="section-2" className="section-fade py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-red-400">Why RNNs Forget</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Like a photocopy of a photocopy of a photocopy — each step degrades the signal.
            The vanishing gradient problem makes it nearly impossible for vanilla RNNs to learn long-range dependencies.
          </p>
        </div>

        {/* The Star Exhibit: Interactive Gradient Decay */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 md:p-10 mb-12">
          <h3 className="text-xl font-semibold text-white mb-2 text-center">
            ⚡ Gradient Decay Simulator
          </h3>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Drag the slider to change the gap between related tokens. Watch how the gradient signal decays.
          </p>

          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">
                Timestep Gap: <span className="text-white font-bold">{steps}</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1 step</span>
                <span>30 steps</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">
                RNN decay rate (λ): <span className="text-red-400 font-bold">{rnnDecay.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="70"
                max="99"
                value={rnnDecay * 100}
                onChange={(e) => setRnnDecay(Number(e.target.value) / 100)}
                className="w-full slider-forget"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0.70 (fast decay)</span>
                <span>0.99</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium">
                LSTM decay rate: <span className="text-green-400 font-bold">{lstmDecay.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="90"
                max="100"
                value={lstmDecay * 100}
                onChange={(e) => setLstmDecay(Number(e.target.value) / 100)}
                className="w-full slider-input"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0.90</span>
                <span>1.00 (no decay)</span>
              </div>
            </div>
          </div>

          {/* Visual comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* RNN lane */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-red-900/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-semibold text-red-400">Vanilla RNN</span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: Math.min(steps, 20) }).map((_, i) => {
                  const val = Math.pow(rnnDecay, i + 1);
                  const height = Math.max(val * 100, 2);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all duration-300"
                      style={{
                        height: `${height}%`,
                        background: `rgba(239, 68, 68, ${0.3 + val * 0.7})`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 font-mono text-lg text-center">
                <span className="text-red-400">{formatNum(rnnGradient)}</span>
                <span className="text-slate-500 text-sm ml-2">gradient magnitude</span>
              </div>
            </div>

            {/* LSTM lane */}
            <div className="bg-slate-900/50 rounded-xl p-4 border border-green-900/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-green-400">LSTM</span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: Math.min(steps, 20) }).map((_, i) => {
                  const val = Math.pow(lstmDecay, i + 1);
                  const height = Math.max(val * 100, 2);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-all duration-300"
                      style={{
                        height: `${height}%`,
                        background: `rgba(34, 197, 94, ${0.3 + val * 0.7})`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-3 font-mono text-lg text-center">
                <span className="text-green-400">{formatNum(lstmGradient)}</span>
                <span className="text-slate-500 text-sm ml-2">gradient magnitude</span>
              </div>
            </div>
          </div>

          {/* Ratio display */}
          <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">LSTM preserves</p>
            <p className="text-3xl font-bold font-mono">
              <span className="text-green-400">{ratio > 1000 ? ratio.toExponential(1) : ratio.toFixed(1)}×</span>
            </p>
            <p className="text-sm text-slate-400 mt-1">more gradient signal than RNN at step {steps}</p>
          </div>

          {/* Decay curve chart */}
          <div className="mt-8 bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-sm text-slate-400 mb-4 text-center">Gradient decay over 30 timesteps</p>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-lg mx-auto">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                <line
                  key={v}
                  x1={padding}
                  y1={padding + (1 - v) * (chartH - 2 * padding)}
                  x2={chartW - padding}
                  y2={padding + (1 - v) * (chartH - 2 * padding)}
                  stroke="#334155"
                  strokeWidth="0.5"
                />
              ))}
              {/* RNN curve */}
              <path
                d={pathToString(rnnPath)}
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                opacity="0.8"
              />
              {/* LSTM curve */}
              <path
                d={pathToString(lstmPath)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                opacity="0.8"
              />
              {/* Current step marker */}
              <line
                x1={padding + (steps / 30) * (chartW - 2 * padding)}
                y1={padding}
                x2={padding + (steps / 30) * (chartW - 2 * padding)}
                y2={chartH - padding}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              {/* Labels */}
              <text x={padding - 5} y={padding + 4} fill="#94a3b8" fontSize="10" textAnchor="end">1.0</text>
              <text x={padding - 5} y={chartH - padding + 4} fill="#94a3b8" fontSize="10" textAnchor="end">0.0</text>
              <text x={chartW / 2} y={chartH - 5} fill="#94a3b8" fontSize="10" textAnchor="middle">Timesteps →</text>
            </svg>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-red-500" />
                <span className="text-xs text-slate-400">RNN (λ={rnnDecay.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-green-500" />
                <span className="text-xs text-slate-400">LSTM (λ={lstmDecay.toFixed(2)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-3">The Vanishing Gradient</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              In a vanilla RNN, the hidden state is multiplied by weight matrix <span className="font-mono text-red-300">W</span> at
              every timestep. During backpropagation, the gradient involves <span className="font-mono text-red-300">Wⁿ</span> —
              the matrix raised to the power of <span className="font-mono text-red-300">n</span> timesteps. If the largest
              eigenvalue |λ| &lt; 1, the gradient <em>vanishes</em> exponentially. The network literally cannot "see"
              what happened more than a few steps ago.
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-3">LSTM's Solution: Additive Path</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              The LSTM introduces a <em>cell state</em> highway where information flows via <em>addition</em>, not multiplication.
              The forget gate can choose to pass the gradient through unchanged (f_t ≈ 1), creating a "gradient highway."
              This is why the LSTM's decay rate λ is so close to 1.0 — the memory survives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
