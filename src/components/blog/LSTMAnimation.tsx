import { useEffect, useState } from 'react';

export default function LSTMAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 60);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const tokenX = (step / 60) * 100;
  const gates = [
    { name: 'f', color: '#dc2626', active: step % 15 < 4 },
    { name: 'i', color: '#16a34a', active: step % 15 >= 4 && step % 15 < 8 },
    { name: 'C̃', color: '#9333ea', active: step % 15 >= 8 && step % 15 < 12 },
    { name: 'o', color: '#2563eb', active: step % 15 >= 12 },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 overflow-hidden">
      <svg viewBox="0 0 600 160" className="w-full">
        {/* Cell state highway */}
        <line x1="40" y1="40" x2="560" y2="40" stroke="#d97706" strokeWidth="3" strokeDasharray="8,4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="2s" repeatCount="indefinite" />
        </line>
        <text x="20" y="44" fill="#d97706" fontSize="12" fontWeight="bold">C</text>
        <text x="570" y="44" fill="#d97706" fontSize="12" fontWeight="bold">C</text>

        {/* Hidden state line */}
        <line x1="40" y1="130" x2="560" y2="130" stroke="#0891b2" strokeWidth="2" opacity="0.4" />
        <text x="20" y="134" fill="#0891b2" fontSize="12" fontWeight="bold">h</text>
        <text x="570" y="134" fill="#0891b2" fontSize="12" fontWeight="bold">h</text>

        {/* Gates */}
        {gates.map((gate, i) => {
          const cx = 150 + i * 100;
          return (
            <g key={gate.name}>
              <circle
                cx={cx} cy="85" r="22"
                fill={gate.active ? gate.color + '20' : '#f5f5f4'}
                stroke={gate.color}
                strokeWidth={gate.active ? 3 : 1.5}
                opacity={gate.active ? 1 : 0.5}
              />
              <text x={cx} y="89" fill={gate.color} fontSize="14" textAnchor="middle" fontWeight="bold">
                {gate.name}
              </text>
              {/* Connection to cell state */}
              <line x1={cx} y1="63" x2={cx} y2="45" stroke={gate.color} strokeWidth="1" opacity={gate.active ? 0.8 : 0.2} />
              {/* Connection to hidden */}
              {gate.name === 'o' && (
                <line x1={cx} y1="107" x2={cx} y2="125" stroke={gate.color} strokeWidth="1" opacity={gate.active ? 0.8 : 0.2} />
              )}
            </g>
          );
        })}

        {/* Moving token */}
        <g>
          <rect x={tokenX * 5.2 + 30} y="140" width="40" height="16" rx="4" fill="#2563eb" opacity="0.8" />
          <text x={tokenX * 5.2 + 50} y="152" fill="white" fontSize="8" textAnchor="middle">x_t</text>
        </g>

        {/* Labels */}
        <text x="300" y="20" fill="#78716c" fontSize="10" textAnchor="middle">Cell State (long-term memory)</text>
        <text x="300" y="158" fill="#78716c" fontSize="10" textAnchor="middle">Hidden State (short-term output)</text>
      </svg>
    </div>
  );
}
