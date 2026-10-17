import { useState } from 'react';

export default function InteractiveSigmoid() {
  const [x, setX] = useState(0);

  const sigmoid = 1 / (1 + Math.exp(-x));
  const sigmoidDeriv = sigmoid * (1 - sigmoid);
  const tanhVal = Math.tanh(x);
  const tanhDeriv = 1 - tanhVal * tanhVal;

  // Generate curve points
  const sigmoidPoints = [];
  const tanhPoints = [];
  for (let i = -6; i <= 6; i += 0.2) {
    sigmoidPoints.push({ x: i, y: 1 / (1 + Math.exp(-i)) });
    tanhPoints.push({ x: i, y: Math.tanh(i) });
  }

  const toSVG = (pts: { x: number; y: number }[], yMin: number, yMax: number) => {
    return pts.map(p => ({
      x: 20 + ((p.x + 6) / 12) * 260,
      y: 10 + ((yMax - p.y) / (yMax - yMin)) * 130,
    }));
  };

  const sigmoidSVG = toSVG(sigmoidPoints, -0.1, 1.1);
  const tanhSVG = toSVG(tanhPoints, -1.1, 1.1);

  const pathStr = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const currentSigmoidX = 20 + ((x + 6) / 12) * 260;
  const currentSigmoidY = 10 + ((1.1 - sigmoid) / 1.2) * 130;
  const currentTanhY = 10 + ((1.1 - tanhVal) / 2.2) * 130;

  return (
    <div className="slider-container">
      <p className="text-sm font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
        🎛️ Drag to explore activation functions
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sigmoid */}
        <div className="flex-1">
          <p className="text-xs text-[#78716c] mb-1 font-medium">σ(x) — Sigmoid [0, 1]</p>
          <svg viewBox="0 0 300 150" className="w-full bg-white rounded border border-[#e7e5e4]">
            {/* Grid */}
            <line x1="20" y1="75" x2="280" y2="75" stroke="#e7e5e4" strokeWidth="0.5" />
            <line x1="150" y1="10" x2="150" y2="140" stroke="#e7e5e4" strokeWidth="0.5" />
            {/* Curve */}
            <path d={pathStr(sigmoidSVG)} fill="none" stroke="#dc2626" strokeWidth="2" />
            {/* Current point */}
            <circle cx={currentSigmoidX} cy={currentSigmoidY} r="5" fill="#dc2626" />
            <line x1={currentSigmoidX} y1={currentSigmoidY} x2={currentSigmoidX} y2="140" stroke="#dc2626" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
            {/* Labels */}
            <text x="150" y="148" fill="#78716c" fontSize="9" textAnchor="middle">x</text>
            <text x="12" y="18" fill="#78716c" fontSize="8">1</text>
            <text x="12" y="140" fill="#78716c" fontSize="8">0</text>
          </svg>
        </div>

        {/* Tanh */}
        <div className="flex-1">
          <p className="text-xs text-[#78716c] mb-1 font-medium">tanh(x) — Hyperbolic Tangent [-1, 1]</p>
          <svg viewBox="0 0 300 150" className="w-full bg-white rounded border border-[#e7e5e4]">
            <line x1="20" y1="75" x2="280" y2="75" stroke="#e7e5e4" strokeWidth="0.5" />
            <line x1="150" y1="10" x2="150" y2="140" stroke="#e7e5e4" strokeWidth="0.5" />
            <path d={pathStr(tanhSVG)} fill="none" stroke="#9333ea" strokeWidth="2" />
            <circle cx={currentSigmoidX} cy={currentTanhY} r="5" fill="#9333ea" />
            <line x1={currentSigmoidX} y1={currentTanhY} x2={currentSigmoidX} y2="140" stroke="#9333ea" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
            <text x="150" y="148" fill="#78716c" fontSize="9" textAnchor="middle">x</text>
            <text x="12" y="18" fill="#78716c" fontSize="8">1</text>
            <text x="12" y="78" fill="#78716c" fontSize="8">0</text>
            <text x="12" y="140" fill="#78716c" fontSize="8">-1</text>
          </svg>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-4">
        <input
          type="range"
          min="-50"
          max="50"
          value={x * 10}
          onChange={(e) => setX(Number(e.target.value) / 10)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-[#78716c] mt-1">
          <span>-5</span>
          <span className="font-mono font-semibold text-[#1c1917]">x = {x.toFixed(1)}</span>
          <span>+5</span>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-white rounded p-2 border border-[#e7e5e4] text-center">
          <p className="text-[10px] text-[#78716c] uppercase">σ(x)</p>
          <p className="font-mono font-bold text-red-600">{sigmoid.toFixed(4)}</p>
        </div>
        <div className="bg-white rounded p-2 border border-[#e7e5e4] text-center">
          <p className="text-[10px] text-[#78716c] uppercase">σ'(x)</p>
          <p className="font-mono font-bold text-red-600">{sigmoidDeriv.toFixed(4)}</p>
        </div>
        <div className="bg-white rounded p-2 border border-[#e7e5e4] text-center">
          <p className="text-[10px] text-[#78716c] uppercase">tanh(x)</p>
          <p className="font-mono font-bold text-purple-600">{tanhVal.toFixed(4)}</p>
        </div>
        <div className="bg-white rounded p-2 border border-[#e7e5e4] text-center">
          <p className="text-[10px] text-[#78716c] uppercase">tanh'(x)</p>
          <p className="font-mono font-bold text-purple-600">{tanhDeriv.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
