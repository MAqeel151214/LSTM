import { useState } from 'react';
import { DisplayMath } from '../../utils/math.tsx';

// Interactive sigmoid visualization
function SigmoidPlot({ value, color }: { value: number; color: string }) {
  const points = [];
  for (let x = -6; x <= 6; x += 0.2) {
    const y = 1 / (1 + Math.exp(-x));
    points.push(`${(x + 6) * 20},${120 - y * 100}`);
  }
  const inputX = (value * 12 - 6 + 6) * 20;
  const inputY = 120 - (1 / (1 + Math.exp(-value * 12 + 6))) * 100;

  return (
    <svg viewBox="0 0 240 130" className="w-full max-w-xs">
      <rect x="0" y="0" width="240" height="130" fill="#0f172a" rx="8" />
      {/* Grid */}
      <line x1="20" y1="70" x2="220" y2="70" stroke="#334155" strokeWidth="0.5" />
      <line x1="120" y1="10" x2="120" y2="120" stroke="#334155" strokeWidth="0.5" />
      {/* Sigmoid curve */}
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="2" />
      {/* Current point */}
      <circle cx={inputX} cy={inputY} r="5" fill={color} opacity="0.8" />
      <line x1={inputX} y1={inputY} x2={inputX} y2="120" stroke={color} strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
      {/* Labels */}
      <text x="120" y="128" fill="#64748b" fontSize="8" textAnchor="middle">input →</text>
      <text x="8" y="25" fill="#64748b" fontSize="8">1.0</text>
      <text x="8" y="120" fill="#64748b" fontSize="8">0.0</text>
    </svg>
  );
}

export default function GateDeepDive() {
  const [forgetVal, setForgetVal] = useState(0.7);
  const [inputVal, setInputVal] = useState(0.5);
  const [candidateVal, setCandidateVal] = useState(0.3);
  const [outputVal, setOutputVal] = useState(0.8);

  // Cell state simulation
  const prevCellState = [0.8, 0.5, 0.9, 0.3, 0.7];
  const newCellState = prevCellState.map((c, i) => {
    const forgotten = c * forgetVal;
    const added = candidateVal * inputVal * (Math.sin(i * 1.5) * 0.5 + 0.5);
    return Math.max(0, Math.min(1, forgotten + added));
  });
  const hiddenState = newCellState.map((c) => {
    const tanhC = Math.tanh(c);
    return tanhC * outputVal;
  });

  return (
    <section id="section-5" className="section-fade py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-purple-400">Gate by Gate</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Each gate is a learned decision. Drag the sliders to see how each gate shapes the flow of information.
          </p>
        </div>

        <div className="space-y-8">
          {/* Forget Gate */}
          <div className="bg-slate-800/30 border border-red-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                <span className="text-red-400 font-bold text-sm">f</span>
              </div>
              <h3 className="text-xl font-bold text-red-400">1. Forget Gate</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-4">
                  "Should I remember this?" The forget gate looks at h_prev and x_t, and outputs a number between 0 and 1
                  for each element in the cell state. <strong className="text-red-300">1 = keep completely, 0 = erase completely.</strong>
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  <em>Example:</em> "The clouds are dark..." — old subject's gender info is no longer relevant, so the forget gate
                  sets those dimensions to ~0.
                </p>
                <DisplayMath tex="f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)" />
                <div className="mt-4">
                  <SigmoidPlot value={forgetVal} color="#ef4444" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Forget gate value: <span className="text-red-400 font-bold font-mono">{forgetVal.toFixed(2)}</span>
                </label>
                <input
                  type="range" min="0" max="100" value={forgetVal * 100}
                  onChange={(e) => setForgetVal(Number(e.target.value) / 100)}
                  className="w-full slider-forget mb-4"
                />
                <p className="text-xs text-slate-500 mb-4">
                  {forgetVal > 0.8 ? '🧠 Keeping memories — old info survives' : forgetVal > 0.4 ? '⚖️ Partially forgetting — some info fades' : '🗑️ Heavy forgetting — clearing the slate'}
                </p>
                {/* Cell state visualization */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Cell state before × f_t:</p>
                  <div className="flex gap-1">
                    {prevCellState.map((v, i) => (
                      <div key={i} className="flex-1">
                        <div className="h-6 bg-slate-700 rounded overflow-hidden relative">
                          <div className="absolute inset-y-0 left-0 bg-amber-500/60 rounded" style={{ width: `${v * 100}%` }} />
                        </div>
                        <div className="h-6 mt-1 bg-slate-700 rounded overflow-hidden relative">
                          <div className="absolute inset-y-0 left-0 bg-red-500/60 rounded" style={{ width: `${v * forgetVal * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 text-[10px] text-slate-500">
                    {prevCellState.map((v, i) => (
                      <div key={i} className="flex-1 text-center">{(v * forgetVal).toFixed(2)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Gate + Candidate */}
          <div className="bg-slate-800/30 border border-green-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">i</span>
              </div>
              <h3 className="text-xl font-bold text-green-400">2. Input Gate + Candidate</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-4">
                  Two sub-steps: First, a <strong className="text-green-300">sigmoid layer (i_t)</strong> decides which values to update.
                  Then, a <strong className="text-purple-300">tanh layer (C̃_t)</strong> creates a vector of new candidate values in [-1, 1].
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  <em>Worked example:</em> i_t = 0.3, C̃_t = 0.5 → contribution = 0.3 × 0.5 = <strong className="text-green-300">0.15</strong>
                </p>
                <DisplayMath tex="i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)" />
                <DisplayMath tex="\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">
                    Input gate (i_t): <span className="text-green-400 font-bold font-mono">{inputVal.toFixed(2)}</span>
                  </label>
                  <input type="range" min="0" max="100" value={inputVal * 100}
                    onChange={(e) => setInputVal(Number(e.target.value) / 100)}
                    className="w-full slider-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">
                    Candidate (C̃_t): <span className="text-purple-400 font-bold font-mono">{candidateVal.toFixed(2)}</span>
                  </label>
                  <input type="range" min="0" max="100" value={candidateVal * 100}
                    onChange={(e) => setCandidateVal(Number(e.target.value) / 100)}
                    className="w-full slider-candidate"
                  />
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">New information added (i_t × C̃_t):</p>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => {
                      const val = inputVal * candidateVal * (Math.sin(i * 1.5) * 0.5 + 0.5);
                      return (
                        <div key={i} className="flex-1 h-8 bg-slate-700 rounded overflow-hidden relative">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500/60 to-purple-500/60 rounded"
                            style={{ width: `${Math.abs(val) * 100}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-center mt-2 text-green-400 font-mono">
                    i_t × C̃_t = {inputVal.toFixed(2)} × {candidateVal.toFixed(2)} = {(inputVal * candidateVal).toFixed(3)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cell State Update */}
          <div className="bg-slate-800/30 border border-amber-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">C</span>
              </div>
              <h3 className="text-xl font-bold text-amber-400">3. Cell State Update</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-4">
                  The old cell state is <strong className="text-red-300">element-wise multiplied</strong> by the forget vector.
                  Then we <strong className="text-green-300">add</strong> the new candidate values scaled by the input gate.
                  This is the core update — and it's <em>additive</em>, which is why gradients flow!
                </p>
                <DisplayMath tex="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t" />
                <p className="text-slate-400 text-sm mt-4">
                  The ⊙ symbol means <em>element-wise</em> (Hadamard) product. Each dimension of the cell state
                  is independently controlled by its corresponding gate value.
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2">Cell state evolution:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-amber-400 mb-1">C_prev (old):</p>
                    <div className="flex gap-1">
                      {prevCellState.map((v, i) => (
                        <div key={i} className="flex-1 h-5 bg-slate-700 rounded overflow-hidden">
                          <div className="h-full bg-amber-500/50 rounded" style={{ width: `${v * 100}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-red-400 mb-1">× f_t (forget):</p>
                    <div className="flex gap-1">
                      {prevCellState.map((v, i) => (
                        <div key={i} className="flex-1 h-5 bg-slate-700 rounded overflow-hidden">
                          <div className="h-full bg-red-500/50 rounded" style={{ width: `${v * forgetVal * 100}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-green-400 mb-1">+ i_t × C̃_t (add):</p>
                    <div className="flex gap-1">
                      {newCellState.map((v, i) => (
                        <div key={i} className="flex-1 h-5 bg-slate-700 rounded overflow-hidden">
                          <div className="h-full bg-green-500/50 rounded" style={{ width: `${Math.abs(v - prevCellState[i] * forgetVal) * 200}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-300 mb-1 font-semibold">= C_t (new):</p>
                    <div className="flex gap-1">
                      {newCellState.map((v, i) => (
                        <div key={i} className="flex-1 h-5 bg-slate-700 rounded overflow-hidden">
                          <div className="h-full bg-amber-400/70 rounded" style={{ width: `${v * 100}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Output Gate */}
          <div className="bg-slate-800/30 border border-blue-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">o</span>
              </div>
              <h3 className="text-xl font-bold text-blue-400">4. Output Gate</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 text-sm mb-4">
                  The output isn't the cell state directly. First, we run C_t through <strong className="text-blue-300">tanh</strong> (to push values to [-1,1]),
                  then multiply by the output gate. The hidden state h_t is a <em>filtered view</em> of the memory.
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  Think of it this way: the cell state has ALL the memory, but h_t is what the LSTM chooses to <em>say</em> right now.
                </p>
                <DisplayMath tex="o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)" />
                <DisplayMath tex="h_t = o_t \odot \tanh(C_t)" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">
                    Output gate (o_t): <span className="text-blue-400 font-bold font-mono">{outputVal.toFixed(2)}</span>
                  </label>
                  <input type="range" min="0" max="100" value={outputVal * 100}
                    onChange={(e) => setOutputVal(Number(e.target.value) / 100)}
                    className="w-full slider-output"
                  />
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">h_t = o_t × tanh(C_t):</p>
                  <div className="flex gap-1">
                    {hiddenState.map((v, i) => (
                      <div key={i} className="flex-1">
                        <div className="h-8 bg-slate-700 rounded overflow-hidden relative">
                          <div
                            className="absolute inset-y-0 left-0 bg-blue-500/60 rounded"
                            style={{ width: `${Math.abs(v) * 100}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-center text-blue-300 mt-1 font-mono">{v.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-center mt-2 text-slate-500">
                    {outputVal > 0.7 ? '📢 Outputting most of memory' : outputVal > 0.3 ? '🔇 Selectively outputting' : '🤫 Keeping quiet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
