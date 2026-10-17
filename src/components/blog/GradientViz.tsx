import { useState } from 'react';

export default function GradientViz() {
  const [steps, setSteps] = useState(5);
  const [forgetVal, setForgetVal] = useState(0.9);

  // RNN gradient: decays as W^n (assume |lambda| = 0.85)
  const rnnGradient = Math.pow(0.85, steps);
  // LSTM gradient through cell state: multiplied by forget gate each step
  const lstmGradient = Math.pow(forgetVal, steps);

  const bars = [];
  for (let i = 1; i <= 15; i++) {
    bars.push({
      step: i,
      rnn: Math.pow(0.85, i),
      lstm: Math.pow(forgetVal, i),
    });
  }

  return (
    <div className="slider-container my-8">
      <p className="text-sm font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        📊 See Why the Cell State Matters
      </p>
      <p className="text-xs text-[#78716c] mb-4">
        Adjust the forget gate value and watch how gradients flow differently.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="text-xs text-[#78716c] block mb-1">
            Timesteps apart: <strong className="text-[#1c1917]">{steps}</strong>
          </label>
          <input
            type="range" min="1" max="15" value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-[#78716c] block mb-1">
            Forget gate (f): <strong className="text-red-600">{forgetVal.toFixed(2)}</strong>
          </label>
          <input
            type="range" min="50" max="100" value={forgetVal * 100}
            onChange={(e) => setForgetVal(Number(e.target.value) / 100)}
          />
        </div>
      </div>

      {/* Comparison bars */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 border border-[#e7e5e4]">
          <p className="text-xs font-semibold text-red-600 mb-2">Vanilla RNN</p>
          <div className="h-6 bg-[#f5f5f4] rounded overflow-hidden">
            <div
              className="h-full bg-red-500 rounded transition-all duration-300"
              style={{ width: `${rnnGradient * 100}%` }}
            />
          </div>
          <p className="font-mono text-sm mt-1 text-red-600">{rnnGradient.toFixed(6)}</p>
          <p className="text-[10px] text-[#78716c]">λ = 0.85 per step</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-[#e7e5e4]">
          <p className="text-xs font-semibold text-[#d97706] mb-2">LSTM (through cell state)</p>
          <div className="h-6 bg-[#f5f5f4] rounded overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded transition-all duration-300"
              style={{ width: `${lstmGradient * 100}%` }}
            />
          </div>
          <p className="font-mono text-sm mt-1 text-amber-600">{lstmGradient.toFixed(6)}</p>
          <p className="text-[10px] text-[#78716c]">f = {forgetVal.toFixed(2)} per step</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-[#e7e5e4] p-3">
        <svg viewBox="0 0 400 120" className="w-full">
          {/* Grid */}
          <line x1="40" y1="100" x2="380" y2="100" stroke="#e7e5e4" strokeWidth="0.5" />
          <line x1="40" y1="10" x2="40" y2="100" stroke="#e7e5e4" strokeWidth="0.5" />
          {/* RNN bars */}
          {bars.map((b, i) => (
            <rect
              key={`rnn-${i}`}
              x={45 + i * 22} y={100 - b.rnn * 85}
              width="8" height={b.rnn * 85}
              fill="#dc2626" opacity={b.step === steps ? 1 : 0.3}
              rx="1"
            />
          ))}
          {/* LSTM bars */}
          {bars.map((b, i) => (
            <rect
              key={`lstm-${i}`}
              x={55 + i * 22} y={100 - b.lstm * 85}
              width="8" height={b.lstm * 85}
              fill="#d97706" opacity={b.step === steps ? 1 : 0.3}
              rx="1"
            />
          ))}
          {/* Labels */}
          <text x="210" y="115" fill="#78716c" fontSize="9" textAnchor="middle">Timesteps →</text>
          <text x="35" y="15" fill="#78716c" fontSize="8" textAnchor="end">1.0</text>
          <text x="35" y="103" fill="#78716c" fontSize="8" textAnchor="end">0.0</text>
        </svg>
        <div className="flex justify-center gap-4 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span className="text-[10px] text-[#78716c]">RNN (multiplicative decay)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-sm" />
            <span className="text-[10px] text-[#78716c]">LSTM (gated additive path)</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#78716c] mt-3">
        <strong>Key insight:</strong> When f ≈ 1 (forget gate mostly open), the LSTM gradient 
        barely decays. The RNN gradient, however, always decays because it's multiplied by 
        the weight matrix at every step — there's no "gate" to control it.
      </p>
    </div>
  );
}
