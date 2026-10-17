import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Landing() {
  const [activeWord, setActiveWord] = useState(0);
  const words = ['remember', 'forget', 'filter', 'preserve'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 pt-16 md:pt-24 pb-24">
        {/* Animated mini cell illustration */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Interactive Visualizer & Complete Numerical Reference</span>
          </div>
        </div>

        {/* Hero title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight mb-5 text-white">
            How does a neural net{' '}
            <span
              key={activeWord}
              className="inline-block transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #a855f7, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {words[activeWord]}
            </span>
            <br />
            100 words down the line?
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-4">
            Standard recurrent nets multiply their hidden state over and over. By step 20, your gradients either
            evaporate into nothingness or blow up. In 1997, Hochreiter and Schmidhuber came up with a surprisingly simple fix:
            give memory an additive highway with four control valves.
          </p>

          <p className="text-sm text-slate-400">
            This project merges two ways of learning it — visual intuition and raw arithmetic. Pick whichever matches how your brain works.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
          {/* Visual card */}
          <Link
            to="/explore"
            className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/95 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.12)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🎬</span>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Visual · Interactive
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                The Interactive Explorer
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                A dark-mode, scroll-driven visual journey. See the conveyor belt metaphor come alive, adjust live decay sliders to see
                RNN gradients vanish in real time, inspect the cell anatomy, and step through tokens one at a time.
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-5 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>9 Interactive Sections</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Decay Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Live Token Playground</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Architecture Variants</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-purple-400 group-hover:text-purple-300">
                <span>Launch Interactive Mode</span>
                <span className="transition-transform group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </Link>

          {/* Blog card */}
          <Link
            to="/blog"
            className="group p-7 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/95 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📝</span>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Paper & Pencil · ~45 min
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                The Numerical Walkthrough
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Most tutorials stop right at the formulas. We picked a tiny 2-dimensional hidden state, real numbers, and calculated
                every matrix dot product, bias addition, sigmoid, and backpropagation gradient step-by-step.
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-5 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Full Forward Pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Complete BPTT Math</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Explicit Weight Matrices</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>5 Key Engineering Takeaways</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:text-amber-300">
                <span>Read Full Walkthrough</span>
                <span className="transition-transform group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick mental model breakdown */}
        <div className="max-w-4xl mx-auto mb-20 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="text-lg font-bold text-white">The Core Insight in 30 Seconds</h3>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            In an ordinary RNN, the state update is <code className="text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm">h_t = tanh(W · h_{'{t-1}'} + U · x_t)</code>.
            Because <code className="text-amber-300 font-mono">h</code> gets repeatedly multiplied by <code className="text-amber-300 font-mono">W</code>, backward gradients involve{' '}
            <code className="text-red-400 font-mono">Wⁿ</code>. If eigenvalues are below 1, signals die out exponentially fast.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="font-semibold text-red-400 mb-1">1. The Forget Gate</div>
              <p className="text-slate-400 leading-normal">
                Scales old memory element-wise by a float between 0 and 1. If a sentence switches topics, it can wipe only the relevant slots.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="font-semibold text-green-400 mb-1">2. Additive Highway</div>
              <p className="text-slate-400 leading-normal">
                New candidate memory is <strong className="text-slate-200">added</strong>, not multiplied into the cell state. Addition lets gradients flow backwards without shrinking.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="font-semibold text-blue-400 mb-1">3. Private vs Public</div>
              <p className="text-slate-400 leading-normal">
                The cell state <code className="text-slate-300 font-mono">C_t</code> is the internal journal. The hidden state <code className="text-slate-300 font-mono">h_t</code> is what it actually chooses to output right now.
              </p>
            </div>
          </div>
        </div>

        {/* Real Questions / FAQ */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Wondered Questions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
              <h4 className="font-semibold text-white text-sm mb-2">Why learn LSTMs now that Transformers exist?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transformers have quadratic cost with sequence length and require full context in memory. For edge devices,
                real-time streaming audio, sensor feeds, and low-latency robotics, recurrent architectures (and newer ones like xLSTM and Mamba)
                remain unbeatable for efficiency.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
              <h4 className="font-semibold text-white text-sm mb-2">Why did we pick 2-dimensional states for the blog?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A 512-dimensional vector is impossible to follow on screen. With 2D vectors, every weight matrix is just 2×4 or 2×2.
                You can write every single multiplication on a scrap of paper and verify where each decimal came from.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
              <h4 className="font-semibold text-white text-sm mb-2">What is the difference between GRU and LSTM?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gated Recurrent Units (Cho et al., 2014) merged the cell state and hidden state, and combined forget and input into a single
                "update" gate. It has fewer parameters and trains faster, while vanilla LSTM often retains finer control over long spans.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
              <h4 className="font-semibold text-white text-sm mb-2">Can I deploy this myself on GitHub Pages?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes! The repo includes a turnkey GitHub Actions workflow (<code className="text-slate-300 font-mono">.github/workflows/deploy.yml</code>)
                that builds and pushes the static assets to GitHub Pages whenever you commit to main.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p className="mb-2">
            Built with React 18, Vite, Tailwind CSS, KaTeX, and Framer Motion.
          </p>
          <p className="mb-3 text-slate-400">
            © 2026{' '}
            <a
              href="https://github.com/MAqeel151214"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-300 hover:text-white transition-colors"
            >
              Muhammad Aqeel
            </a>
            {' · '}
            <a
              href="https://github.com/MAqeel151214/LSTM"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 underline transition-colors"
            >
              Open Source under MIT License
            </a>
          </p>
          <div className="flex justify-center gap-4 text-slate-400 font-mono text-[11px]">
            <Link to="/explore" className="hover:text-purple-300 transition-colors">Explorer</Link>
            <span>·</span>
            <Link to="/blog" className="hover:text-amber-300 transition-colors">Numerical Blog</Link>
            <span>·</span>
            <a
              href="https://github.com/MAqeel151214/LSTM"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
