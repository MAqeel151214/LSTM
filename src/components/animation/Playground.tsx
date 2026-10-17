import { useState, useCallback, useEffect, useRef } from 'react';

interface TimestepResult {
  token: string;
  forget: number[];
  input: number[];
  candidate: number[];
  output: number[];
  cellState: number[];
  hiddenState: number[];
}

// Simple deterministic simulation
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function simulateLSTM(tokens: string[], dim: number = 4): TimestepResult[] {
  const results: TimestepResult[] = [];
  let cellState = new Array(dim).fill(0);
  let hiddenState = new Array(dim).fill(0);

  // Seed based on token
  const tokenSeed = (token: string, i: number) => {
    let hash = 0;
    const str = token + i.toString();
    for (let c = 0; c < str.length; c++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(c);
      hash = hash & hash;
    }
    return hash;
  };

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];
    const seed = tokenSeed(token, t);

    // Generate gate values deterministically
    const forget = Array.from({ length: dim }, (_, i) => {
      const x = Math.sin(seed * 0.1 + i * 0.7) * 2;
      return sigmoid(x) * 0.7 + 0.2; // Bias toward remembering
    });

    const input = Array.from({ length: dim }, (_, i) => {
      const x = Math.cos(seed * 0.2 + i * 1.1) * 1.5;
      return sigmoid(x) * 0.6 + 0.1;
    });

    const candidate = Array.from({ length: dim }, (_, i) => {
      const x = Math.sin(seed * 0.3 + i * 0.9) * 2;
      return Math.tanh(x);
    });

    const output = Array.from({ length: dim }, (_, i) => {
      const x = Math.cos(seed * 0.15 + i * 1.3) * 1.8;
      return sigmoid(x) * 0.8 + 0.1;
    });

    // Update cell state
    const newCellState = cellState.map((c, i) => forget[i] * c + input[i] * candidate[i]);
    const tanhCell = newCellState.map((c) => Math.tanh(c));
    const newHidden = tanhCell.map((c, i) => output[i] * c);

    cellState = newCellState;
    hiddenState = newHidden;

    results.push({
      token,
      forget,
      input,
      candidate,
      output,
      cellState: [...newCellState],
      hiddenState: [...newHidden],
    });
  }

  return results;
}

// Prediction based on hidden state
function getPrediction(hiddenState: number[]): { word: string; prob: number }[] {
  const words = ['rain', 'sky', 'clouds', 'storm', 'sun', 'wind'];
  return words.map((word, i) => ({
    word,
    prob: Math.abs(Math.sin(hiddenState[i % hiddenState.length] * (i + 1) * 3)) * 0.6 + 0.05,
  })).sort((a, b) => b.prob - a.prob).map((item, _, arr) => {
    const total = arr.reduce((sum, x) => sum + x.prob, 0);
    return { ...item, prob: item.prob / total };
  });
}

export default function Playground() {
  const defaultSentence = "The clouds are dark and the sky will bring";
  const [sentence, setSentence] = useState(defaultSentence);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dim] = useState(4);

  const tokens = sentence.split(' ').filter(t => t.length > 0);
  const results = simulateLSTM(tokens, dim);

  const handlePlay = useCallback(() => {
    if (currentStep >= tokens.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, tokens.length]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Auto-advance when playing
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= tokens.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, tokens.length]);

  const currentResult = results[currentStep];
  const prediction = currentResult ? getPrediction(currentResult.hiddenState) : [];

  const valToColor = (val: number, gate: string) => {
    const colors: Record<string, string> = {
      forget: 'rgba(239, 68, 68, VAL)',
      input: 'rgba(34, 197, 94, VAL)',
      candidate: 'rgba(168, 85, 247, VAL)',
      output: 'rgba(59, 130, 246, VAL)',
      cell: 'rgba(245, 158, 11, VAL)',
    };
    const alpha = Math.abs(val) * 0.8 + 0.1;
    return (colors[gate] || colors.cell).replace('VAL', alpha.toString());
  };

  return (
    <section id="section-6" className="section-fade py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-green-400">The Playground</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Watch the LSTM process a sentence one token at a time. See the gates decide, the cell state evolve, and the prediction form.
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 md:p-8">
          {/* Sentence input */}
          <div className="mb-6">
            <label className="text-sm text-slate-400 mb-2 block">Input sentence:</label>
            <input
              type="text"
              value={sentence}
              onChange={(e) => { setSentence(e.target.value); setCurrentStep(0); setIsPlaying(false); }}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Token display */}
          <div className="mb-6 flex flex-wrap gap-2">
            {tokens.map((token, i) => (
              <button
                key={i}
                onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-sm transition-all ${
                  i === currentStep
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-300 scale-105'
                    : i < currentStep
                    ? 'bg-slate-700/50 border border-slate-600 text-slate-400'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-500'
                }`}
              >
                {token}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
            >
              ↺ Reset
            </button>
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-colors text-sm"
              >
                ⏸ Pause
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors text-sm"
              >
                ▶ Play
              </button>
            )}
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(tokens.length - 1, currentStep + 1))}
              className="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm"
            >
              Next →
            </button>
            <div className="ml-auto text-sm text-slate-400">
              Step <span className="text-white font-bold">{currentStep + 1}</span> / {tokens.length}
            </div>
          </div>

          {currentResult && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gate dials */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-300">Gate Values at "{currentResult.token}"</h4>

                {/* Gate bars */}
                {(['forget', 'input', 'candidate', 'output'] as const).map((gate) => (
                  <div key={gate} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${
                        gate === 'forget' ? 'text-red-400' :
                        gate === 'input' ? 'text-green-400' :
                        gate === 'candidate' ? 'text-purple-400' :
                        'text-blue-400'
                      }`}>
                        {gate === 'forget' ? 'f_t' : gate === 'input' ? 'i_t' : gate === 'candidate' ? 'C̃_t' : 'o_t'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        [{currentResult[gate].map(v => v.toFixed(2)).join(', ')}]
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {currentResult[gate].map((v, i) => (
                        <div key={i} className="flex-1 h-4 bg-slate-700 rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm transition-all duration-500"
                            style={{
                              width: `${Math.abs(v) * 100}%`,
                              background: valToColor(v, gate),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Cell state heat bar */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-400">Cell State (C_t)</span>
                    <span className="text-xs text-slate-500 font-mono">
                      [{currentResult.cellState.map(v => v.toFixed(2)).join(', ')}]
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {currentResult.cellState.map((v, i) => (
                      <div key={i} className="flex-1 h-6 bg-slate-700 rounded overflow-hidden relative">
                        <div
                          className="absolute inset-y-0 left-1/2 rounded transition-all duration-500"
                          style={{
                            width: `${Math.abs(v) * 50}%`,
                            left: v >= 0 ? '50%' : `${50 - Math.abs(v) * 50}%`,
                            background: v >= 0 ? 'rgba(245, 158, 11, 0.7)' : 'rgba(245, 158, 11, 0.4)',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden state */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-cyan-400">Hidden State (h_t)</span>
                    <span className="text-xs text-slate-500 font-mono">
                      [{currentResult.hiddenState.map(v => v.toFixed(2)).join(', ')}]
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {currentResult.hiddenState.map((v, i) => (
                      <div key={i} className="flex-1 h-6 bg-slate-700 rounded overflow-hidden relative">
                        <div
                          className="absolute inset-y-0 left-1/2 rounded transition-all duration-500"
                          style={{
                            width: `${Math.abs(v) * 50}%`,
                            left: v >= 0 ? '50%' : `${50 - Math.abs(v) * 50}%`,
                            background: v >= 0 ? 'rgba(6, 182, 212, 0.7)' : 'rgba(6, 182, 212, 0.4)',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prediction */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-4">
                  Prediction for next word:
                </h4>
                <div className="space-y-3">
                  {prediction.map((p, i) => (
                    <div key={p.word} className="flex items-center gap-3">
                      <span className="text-sm text-slate-400 w-16 font-mono">{p.word}</span>
                      <div className="flex-1 h-5 bg-slate-700 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all duration-500"
                          style={{
                            width: `${p.prob * 100}%`,
                            background: i === 0
                              ? 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                              : 'linear-gradient(90deg, #334155, #475569)',
                          }}
                        />
                      </div>
                      <span className={`text-sm font-mono w-14 text-right ${i === 0 ? 'text-blue-300 font-bold' : 'text-slate-500'}`}>
                        {(p.prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cell state history */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <h4 className="text-xs font-semibold text-slate-400 mb-3">Cell State History</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {results.slice(0, currentStep + 1).map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-12 font-mono truncate">{r.token}</span>
                        <div className="flex gap-0.5 flex-1">
                          {r.cellState.map((v, j) => (
                            <div key={j} className="flex-1 h-2 bg-slate-700 rounded-sm overflow-hidden">
                              <div
                                className="h-full rounded-sm"
                                style={{
                                  width: `${Math.abs(v) * 100}%`,
                                  background: `rgba(245, 158, 11, ${0.3 + Math.abs(v) * 0.5})`,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
