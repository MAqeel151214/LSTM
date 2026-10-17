import { useState, useEffect } from 'react';

export default function ConveyorBelt() {
  const [forgetValve, setForgetValve] = useState(0.7);
  const [inputValve, setInputValve] = useState(0.5);
  const [cellState, setCellState] = useState([0.8, 0.6, 0.4, 0.9, 0.3]);
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCellState((prev) =>
      prev.map((val, i) => {
        const forgotten = val * forgetValve;
        const added = (Math.sin(animStep * 0.1 + i) * 0.5 + 0.5) * inputValve;
        return Math.min(1, Math.max(0, forgotten + added * 0.3));
      })
    );
  }, [forgetValve, inputValve, animStep]);

  const tokens = ['The', 'clouds', 'are', 'dark', '→', 'rain'];
  const tokenOffset = (animStep * 3) % 300;

  return (
    <section id="section-3" className="section-fade py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-amber-400">The Conveyor Belt</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            The cell state is like a conveyor belt — information flows along it with minimal transformation.
            Gates act as valves, deciding what to let through and what to add.
          </p>
        </div>

        {/* Animated Conveyor Belt Visualization */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 md:p-8 mb-8">
          {/* The belt */}
          <div className="relative h-24 mb-8 overflow-hidden rounded-xl bg-slate-900/50 border border-amber-900/30">
            {/* Belt tracks */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-amber-900/20 via-amber-800/30 to-amber-900/20" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500/30" />

            {/* Moving tokens */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex gap-8 whitespace-nowrap"
              style={{ transform: `translateX(${-tokenOffset}px) translateY(-50%)` }}
            >
              {[...tokens, ...tokens, ...tokens].map((token, i) => (
                <span
                  key={i}
                  className="font-mono text-lg px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300"
                >
                  {token}
                </span>
              ))}
            </div>

            {/* Cell state bar */}
            <div className="absolute bottom-2 left-4 right-4 flex gap-1">
              {cellState.map((val, i) => (
                <div key={i} className="flex-1 h-3 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${val * 100}%`,
                      background: `linear-gradient(90deg, #f59e0b, #eab308)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Valves */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Forget Valve */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="font-semibold text-red-400">Forget Valve</span>
                </div>
                <span className="font-mono text-red-300">{forgetValve.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={forgetValve * 100}
                onChange={(e) => setForgetValve(Number(e.target.value) / 100)}
                className="w-full slider-forget"
              />
              <p className="text-xs text-slate-500">
                {forgetValve > 0.8 ? '✅ Keeping most memories' : forgetValve > 0.4 ? '⚖️ Selectively forgetting' : '❌ Forgetting almost everything'}
              </p>
              {/* Visual valve */}
              <div className="h-8 bg-slate-900/50 rounded-lg border border-slate-700 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-red-500/20 border-r-2 border-red-500 transition-all duration-300"
                  style={{ width: `${forgetValve * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  {forgetValve > 0.5 ? 'Memory flows through →' : 'Memory blocked ✕'}
                </div>
              </div>
            </div>

            {/* Input Valve */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="font-semibold text-green-400">Input Valve</span>
                </div>
                <span className="font-mono text-green-300">{inputValve.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputValve * 100}
                onChange={(e) => setInputValve(Number(e.target.value) / 100)}
                className="w-full slider-input"
              />
              <p className="text-xs text-slate-500">
                {inputValve > 0.8 ? '✅ Writing lots of new info' : inputValve > 0.4 ? '⚖️ Adding some new info' : '❌ Barely writing anything new'}
              </p>
              {/* Visual valve */}
              <div className="h-8 bg-slate-900/50 rounded-lg border border-slate-700 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 right-0 bg-green-500/20 border-l-2 border-green-500 transition-all duration-300"
                  style={{ width: `${inputValve * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  {inputValve > 0.5 ? '← New info entering' : 'New info blocked ✕'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analogy cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 card-hover">
            <div className="text-2xl mb-3">🏗️</div>
            <h4 className="font-semibold text-white mb-2">The Conveyor Belt</h4>
            <p className="text-sm text-slate-400">
              The cell state C_t runs through the entire chain like a conveyor belt. Information can flow along it almost unchanged.
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 card-hover">
            <div className="text-2xl mb-3">🚰</div>
            <h4 className="font-semibold text-white mb-2">The Valves</h4>
            <p className="text-sm text-slate-400">
              Gates are like valves on a water pipe. They can be fully open (let everything through) or closed (block everything).
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 card-hover">
            <div className="text-2xl mb-3">🧠</div>
            <h4 className="font-semibold text-white mb-2">The Memory</h4>
            <p className="text-sm text-slate-400">
              The cell state is long-term memory. The hidden state h_t is a filtered view — what the LSTM chooses to output right now.
            </p>
          </div>
        </div>

        {/* Notation glossary */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <h4 className="font-semibold text-white mb-4">📖 Notation Glossary <span className="text-sm text-slate-500">(hover for details)</span></h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { symbol: 'x_t', meaning: 'Input at time t' },
              { symbol: 'h_{t-1}', meaning: 'Previous hidden state' },
              { symbol: 'C_{t-1}', meaning: 'Previous cell state (long-term memory)' },
              { symbol: 'f_t', meaning: 'Forget gate output (what to erase)' },
              { symbol: 'i_t', meaning: 'Input gate output (what to add)' },
              { symbol: 'C̃_t', meaning: 'Candidate values (new info)' },
              { symbol: 'C_t', meaning: 'Updated cell state' },
              { symbol: 'h_t', meaning: 'Output hidden state' },
            ].map((item) => (
              <div key={item.symbol} className="group relative bg-slate-900/50 rounded-lg p-3 border border-slate-700 hover:border-blue-500/50 transition-colors cursor-help">
                <span className="font-mono text-blue-300 text-sm">{item.symbol}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-700 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {item.meaning}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-700 rotate-45 -mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
