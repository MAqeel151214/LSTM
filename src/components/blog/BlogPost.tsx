import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath as Math } from '../../utils/math.tsx';
import TOC from './TOC.tsx';
import ForwardPass from './ForwardPass.tsx';
import BackwardPass from './BackwardPass.tsx';
import InteractiveSigmoid from './InteractiveSigmoid.tsx';
import GradientViz from './GradientViz.tsx';
import LSTMAnimation from './LSTMAnimation.tsx';

export default function BlogPost() {
  const [showFullCalc, setShowFullCalc] = useState(true);

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-[#2563eb] mb-4 tracking-wide uppercase">A Complete Numerical Walkthrough</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1c1917] leading-tight mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            I Traced Every Number Through an LSTM.<br />
            <span className="text-[#2563eb]">Here's What I Found.</span>
          </h1>
          <p className="text-xl text-[#44403c] max-w-2xl mx-auto" style={{ fontFamily: 'Lora, serif' }}>
            No hand-waving. No "and then magic happens." Just a tiny dataset, small matrices, 
            and every single multiplication laid bare — forward <em>and</em> backward.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#78716c] mb-8">
          <span>By <a href="https://github.com/MAqeel151214" target="_blank" rel="noopener noreferrer" className="font-medium text-[#2563eb] hover:underline">Muhammad Aqeel</a></span>
          <span>·</span>
          <span>~45 min read</span>
          <span>·</span>
          <span>Updated 2026</span>
          <span>·</span>
          <span>Interactive</span>
          <span>·</span>
          <a
            href="https://github.com/MAqeel151214/LSTM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[#44403c] hover:text-[#2563eb] transition-colors"
          >
            <span>Open Source (MIT)</span>
          </a>
        </div>

        <LSTMAnimation />
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 pb-24">
        <article className="blog-content">
          {/* Table of Contents */}
          <TOC />

          {/* INTRODUCTION */}
          <section id="intro">
            <h2>Why I Wrote This</h2>
            
            <p>
              Look, I get it. You've read Christopher Olah's blog post. Maybe you watched the StatQuest video. 
              You <em>sort of</em> understand that LSTMs have gates and a cell state and they solve the vanishing 
              gradient problem. But when someone asks you <strong>"okay, but what actually happens to the numbers?"</strong> — 
              you freeze.
            </p>

            <p>
              I was there too. Every tutorial I found did the same thing: showed you the pretty diagram with 
              the four gates, wrote down the equations, and then... skipped to "and that's how it works!" 
              Like, <em>what</em>? What happened between the equations and the "that's it"?
            </p>

            <p>
              So I did what any masochist would do. I took the smallest possible LSTM — two-dimensional 
              hidden states, three timesteps, a toy dataset — and I computed <strong>every single number</strong>. 
              Every multiplication. Every addition. Every sigmoid. And then I did it again backwards, 
              computing every gradient by hand.
            </p>

            <div className="callout insight">
              <div className="callout-title">💡 The Gap This Blog Fills</div>
              <p className="text-sm mb-0">
                Most resources show you <em>either</em> the intuition <em>or</em> the equations. 
                Some show you a numerical example for the forward pass. Almost none show you the 
                complete backward pass through time (BPTT) with actual numbers. This blog does all three, 
                in sequence, with the same tiny example throughout.
              </p>
            </div>

            <p>
              By the end of this, you'll be able to look at an LSTM diagram and actually <em>see</em> 
              what's happening. You'll understand why the forget gate matters, why the cell state 
              is additive, and exactly how gradients flow backward through time. No more magic.
            </p>

            <p>
              Fair warning: this is long. Like, <em>really</em> long. But I've organized it so you can 
              skim the parts you know and dig into the parts you don't. The table of contents up there? 
              Use it. Jump around. This is a reference, not a novel.
            </p>
          </section>

          {/* THE SETUP */}
          <section id="setup">
            <h2>The Setup: Our Tiny World</h2>

            <p>
              Before we compute anything, let's set the stage. We need to decide on dimensions, 
              initialize our weights, and pick a dataset. I'm going to keep everything small enough 
              that you could (theoretically) verify these numbers with a calculator.
            </p>

            <h3>Dimensions</h3>

            <div className="calc-block">
              <div className="step">
                <div className="step-label">Input dimension</div>
                <span className="result">n_x = 2</span> (each input is a 2D vector)
              </div>
              <div className="step">
                <div className="step-label">Hidden dimension</div>
                <span className="result">n_h = 2</span> (hidden state and cell state are 2D)
              </div>
              <div className="step">
                <div className="step-label">Sequence length</div>
                <span className="result">T = 3</span> (three timesteps)
              </div>
              <div className="step">
                <div className="step-label">Concatenated input</div>
                <span className="result">[h_prev, x]</span> is 4-dimensional
              </div>
            </div>

            <p>
              Why 2D? Because with 2D vectors, every weight matrix is just 2×4 (for the gates) 
              or 2×2 (for projections). You can actually <em>see</em> what's happening. In a real LSTM, 
              these might be 512×1024. Good luck computing those by hand.
            </p>

            <h3>Our Dataset</h3>

            <p>
              Here's our entire training sequence. Three input vectors, and at the end, we want 
              the network to predict a single value (let's say it's a regression task — we're 
              predicting the next value in a sequence).
            </p>

            <div className="calc-block">
              <div className="step">
                <div className="step-label">Input at t=1</div>
                x₁ = <span className="result">[0.5, 0.1]</span>
              </div>
              <div className="step">
                <div className="step-label">Input at t=2</div>
                x₂ = <span className="result">[0.3, 0.8]</span>
              </div>
              <div className="step">
                <div className="step-label">Input at t=3</div>
                x₃ = <span className="result">[0.9, 0.2]</span>
              </div>
              <div className="step">
                <div className="step-label">Target (what we want to predict)</div>
                y = <span className="result">[0.7, 0.4]</span>
              </div>
            </div>

            <p>
              That's it. Our entire "dataset" is three 2D inputs and one 2D target. 
              Think of it like: the network sees three frames of some process, and needs 
              to predict what comes next.
            </p>

            <h3>Initializing the Weights</h3>

            <p>
              Here's where most tutorials cheat. They say "let W be the weight matrix" and move on. 
              Not us. I'm going to give you <em>every single number</em> in every weight matrix. 
              I chose these values to be small (between -0.2 and 0.3) so the sigmoids don't saturate 
              and we get interesting gradients.
            </p>

            <p>
              Remember: each gate has its own weight matrix W (applied to the concatenated [h_prev, x]) 
              and its own bias vector b. That's 4 gates × (one 2×4 matrix + one 2×1 bias) = 
              4 matrices and 4 bias vectors. Plus, we need a weight matrix for the output projection.
            </p>

            <div className="gate-box forget">
              <strong style={{ color: 'var(--forget)' }}>Forget Gate Weights (W_f) and Bias (b_f):</strong>
              <div className="mt-3 calc-block" style={{ background: 'white' }}>
                <div className="step">
                  <div className="step-label">W_f (2×4 matrix) — maps [h_t-1, x_t] → forget signal</div>
                  <pre className="text-sm">{`W_f = [ 0.15  -0.10   0.20   0.05 ]
     [-0.05   0.25  -0.15   0.10 ]`}</pre>
                </div>
                <div className="step">
                  <div className="step-label">b_f (2×1 vector)</div>
                  <pre className="text-sm">{`b_f = [ 0.10 ]
     [ 0.05 ]`}</pre>
                  <p className="text-xs text-[#78716c] mt-2">
                    Notice: the bias is slightly positive. This gives the forget gate a 
                    "default tendency" to remember (sigmoid of positive → closer to 1). 
                    This is actually a common initialization trick!
                  </p>
                </div>
              </div>
            </div>

            <div className="gate-box input">
              <strong style={{ color: 'var(--input)' }}>Input Gate Weights (W_i) and Bias (b_i):</strong>
              <div className="mt-3 calc-block" style={{ background: 'white' }}>
                <div className="step">
                  <div className="step-label">W_i (2×4 matrix)</div>
                  <pre className="text-sm">{`W_i = [ 0.20   0.10  -0.05   0.15 ]
     [-0.10   0.05   0.25  -0.20 ]`}</pre>
                </div>
                <div className="step">
                  <div className="step-label">b_i (2×1 vector)</div>
                  <pre className="text-sm">{`b_i = [-0.10 ]
     [ 0.15 ]`}</pre>
                </div>
              </div>
            </div>

            <div className="gate-box candidate">
              <strong style={{ color: 'var(--candidate)' }}>Candidate Weights (W_C) and Bias (b_C):</strong>
              <div className="mt-3 calc-block" style={{ background: 'white' }}>
                <div className="step">
                  <div className="step-label">W_C (2×4 matrix) — uses tanh instead of sigmoid</div>
                  <pre className="text-sm">{`W_C = [-0.20   0.15   0.10  -0.05 ]
     [ 0.05  -0.10   0.20   0.25 ]`}</pre>
                </div>
                <div className="step">
                  <div className="step-label">b_C (2×1 vector)</div>
                  <pre className="text-sm">{`b_C = [ 0.00 ]
     [ 0.05 ]`}</pre>
                </div>
              </div>
            </div>

            <div className="gate-box output">
              <strong style={{ color: 'var(--output)' }}>Output Gate Weights (W_o) and Bias (b_o):</strong>
              <div className="mt-3 calc-block" style={{ background: 'white' }}>
                <div className="step">
                  <div className="step-label">W_o (2×4 matrix)</div>
                  <pre className="text-sm">{`W_o = [ 0.10   0.20  -0.15   0.05 ]
     [-0.05   0.10   0.15  -0.10 ]`}</pre>
                </div>
                <div className="step">
                  <div className="step-label">b_o (2×1 vector)</div>
                  <pre className="text-sm">{`b_o = [ 0.05 ]
     [-0.05 ]`}</pre>
                </div>
              </div>
            </div>

            <div className="gate-box hidden">
              <strong style={{ color: 'var(--hidden)' }}>Output Projection (W_y) and Bias (b_y):</strong>
              <div className="mt-3 calc-block" style={{ background: 'white' }}>
                <div className="step">
                  <div className="step-label">W_y (2×2 matrix) — maps h_t to prediction</div>
                  <pre className="text-sm">{`W_y = [ 0.30  -0.10 ]
     [ 0.15   0.25 ]`}</pre>
                </div>
                <div className="step">
                  <div className="step-label">b_y (2×1 vector)</div>
                  <pre className="text-sm">{`b_y = [ 0.00 ]
     [ 0.10 ]`}</pre>
                </div>
              </div>
            </div>

            <h3>Initial State</h3>

            <p>
              One more thing: at the very beginning (before t=1), the hidden state and cell state 
              are both zeros. This is standard — we haven't seen anything yet, so there's nothing 
              to remember.
            </p>

            <div className="calc-block">
              <div className="step">
                <div className="step-label">Initial hidden state</div>
                h₀ = <span className="result">[0.0, 0.0]</span>
              </div>
              <div className="step">
                <div className="step-label">Initial cell state</div>
                C₀ = <span className="result">[0.0, 0.0]</span>
              </div>
            </div>

            <p>
              Alright. We've got our inputs, our weights, and our initial state. 
              Everything is set. Now let's actually <em>compute</em> something.
            </p>
          </section>

          {/* ACTIVATION PRIMER */}
          <section id="activations">
            <h2>Quick Primer: Sigmoid and Tanh</h2>

            <p>
              Before we dive into the forward pass, let's make sure we're crystal clear on the 
              two activation functions the LSTM uses. I know you've seen these before, but 
              let me show you something interactive that'll make them stick.
            </p>

            <InteractiveSigmoid />

            <p>
              Here's the key intuition, stated plainly:
            </p>

            <div className="callout">
              <div className="callout-title">🧠 The Two Activations, Explained Simply</div>
              <p className="text-sm mb-2">
                <strong>Sigmoid σ(x) = 1/(1+e⁻ˣ)</strong> squashes anything to between 0 and 1. 
                We use it for gates because we want "how much" — a percentage, basically. 
                σ(0) = 0.5 (neutral), σ(very positive) ≈ 1 (fully open), σ(very negative) ≈ 0 (fully closed).
              </p>
              <p className="text-sm mb-0">
                <strong>Tanh(x) = (eˣ-e⁻ˣ)/(eˣ+e⁻ˣ)</strong> squashes to between -1 and 1. 
                We use it for the candidate values because we want to allow both positive 
                and negative updates to the cell state. tanh(0) = 0 (neutral), 
                and it's just a rescaled, shifted sigmoid.
              </p>
            </div>

            <p>
              One more thing that'll matter later: the <strong>derivatives</strong>. 
              When we do backpropagation, we need these:
            </p>

            <div className="calc-block">
              <div className="step">
                <div className="step-label">Sigmoid derivative</div>
                σ'(x) = σ(x) · (1 - σ(x))
              </div>
              <div className="step">
                <div className="step-label">Tanh derivative</div>
                tanh'(x) = 1 - tanh(x)²
              </div>
            </div>

            <p>
              Notice how beautiful this is: both derivatives can be computed from the 
              <em> output</em> of the function, not the input. So if we already computed σ(x) = 0.7 
              during the forward pass, we immediately know σ'(x) = 0.7 × 0.3 = 0.21. No need 
              to go back to x. This is one of those elegant things that makes deep learning work.
            </p>
          </section>

          {/* FORWARD PASS */}
          <ForwardPass />

          {/* BACKWARD PASS */}
          <BackwardPass />

          {/* INSIGHTS */}
          <section id="insights">
            <h2>What Did We Learn?</h2>

            <p>
              Okay, take a breath. That was a lot. Let's zoom out and talk about what 
              all those numbers actually <em>mean</em>. What did tracing through this tiny 
              example teach us about how LSTMs really work?
            </p>

            <h3>Insight #1: The Cell State Is a Highway</h3>

            <p>
              Look at how C evolved: [0, 0] → [-0.007, 0.059] → [-0.005, 0.094] → [-0.003, 0.084]. 
              The second dimension kept growing because the forget gate was high (keeping old values) 
              and the input gate was letting new values in. The first dimension stayed near zero 
              because the forget gate was low there — it was being actively erased.
            </p>

            <p>
              This is the "highway" metaphor in action. Information flows along the cell state 
              with minimal transformation. The gates just make small adjustments — 
              "keep a bit more of this," "add a little of that."
            </p>

            <h3>Insight #2: Gradients Flow Differently Than You'd Think</h3>

            <p>
              Here's something that surprised me when I first computed it: the gradient with 
              respect to C₂ was <strong>larger</strong> than the gradient with respect to C₃ 
              (for certain dimensions). How is that possible? Shouldn't the most recent 
              timestep have the strongest gradients?
            </p>

            <p>
              No! And this is the whole point of the LSTM. The gradient flows backward through 
              the cell state <em>additively</em>. The forget gate acts as a gate on the gradient — 
              when f is close to 1, the gradient passes through almost unchanged. When f is 
              close to 0, the gradient is blocked. This is why LSTMs can learn long-range 
              dependencies: the gradient doesn't vanish through the cell state, it only 
              vanishes through the <em>gates</em> (which involve multiplications by W matrices).
            </p>

            <GradientViz />

            <h3>Insight #3: The Gates Specialize</h3>

            <p>
              Even in our tiny example with random weights, you can see the gates developing 
              different behaviors for different dimensions. Dimension 0 of the forget gate 
              was consistently low (erasing old info), while dimension 1 was high (preserving). 
              This is the network learning to treat different "channels" of memory differently.
            </p>

            <p>
              In a real LSTM with 512 dimensions, each dimension might learn to track a 
              completely different aspect of the input — gender, tense, topic, entity identity, 
              whatever. The gates learn which aspects to keep and which to discard.
            </p>

            <h3>Insight #4: Backprop Through Time Is Just Chain Rule, Repeated</h3>

            <p>
              If the backward pass seemed scary, here's the secret: it's just the chain rule, 
              applied over and over. At each timestep, you compute local gradients (how does 
              this gate's output affect the loss?) and then pass the gradient backward to 
              the previous timestep.
            </p>

            <p>
              The only "tricky" part is that the gradient flows through the cell state 
              additively: dL/dC_prev = dL/dC_current · f. That single equation is why LSTMs 
              work. It means the gradient from the future reaches the past without being 
              multiplied by a weight matrix (which would cause vanishing/exploding).
            </p>

            <div className="callout insight">
              <div className="callout-title">🎯 The One Equation That Makes LSTMs Work</div>
              <p className="text-sm mb-0">
                <strong>{'∂L/∂C_prev = ∂L/∂C_current · f'}</strong><br />
                When f ≈ 1, the gradient passes through unchanged. This additive path 
                is the "gradient highway" that solves the vanishing gradient problem. 
                Everything else in the LSTM is about learning <em>when</em> to set f_t ≈ 1 
                vs f_t ≈ 0.
              </p>
            </div>

            <h3>Insight #5: The Numbers Tell a Story</h3>

            <p>
              Here's what I want you to take away from all those calculations: the LSTM isn't 
              magic. It's a series of deliberate design choices, each one solving a specific problem:
            </p>

            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>
                <strong>The cell state exists</strong> because we need a path for information 
                (and gradients) to flow without transformation.
              </li>
              <li>
                <strong>The forget gate exists</strong> because sometimes old information is wrong 
                and needs to be actively erased (like when the subject changes in a sentence).
              </li>
              <li>
                <strong>The input gate exists</strong> because not every new input is worth remembering. 
                We need to filter.
              </li>
              <li>
                <strong>The candidate exists</strong> (with tanh) because new information can be 
                positive or negative — we need both.
              </li>
              <li>
                <strong>The output gate exists</strong> because what we <em>remember</em> and what we 
                <em>say right now</em> are different things. The cell state is private; h_t is public.
              </li>
            </ul>

            <p>
              Every gate, every equation, every design choice — it all makes sense once you 
              see the numbers. And now you have.
            </p>
          </section>

          {/* CLOSING */}
          <section id="closing">
            <h2>Where to Go From Here</h2>

            <p>
              If you made it this far, you now understand LSTMs at a level that most 
              practitioners don't. You can actually trace the computation. You know where 
              gradients come from. You've seen the whole picture.
            </p>

            <p>
              Here's what I'd suggest as next steps:
            </p>

            <ol className="list-decimal pl-6 space-y-3 mb-6">
              <li>
                <strong>Implement it yourself.</strong> Seriously. Take the numbers from this blog 
                and write a NumPy implementation. Verify that your forward pass gives the same 
                results. Then implement backward pass and check the gradients against numerical 
                differentiation (∂L/∂W ≈ (L(W+ε) - L(W-ε)) / 2ε).
              </li>
              <li>
                <strong>Read the original paper.</strong> Hochreiter & Schmidhuber (1997) is 
                surprisingly readable, and now you have the context to understand it.
              </li>
              <li>
                <strong>Explore variants.</strong> GRU simplifies the LSTM to two gates. 
                Peephole LSTM adds connections from the cell state to the gates. 
                xLSTM (2024) is Hochreiter's modern update. Understanding vanilla LSTM 
                makes all of these click.
              </li>
              <li>
                <strong>Understand why Transformers won.</strong> LSTMs process sequentially 
                (can't parallelize across timesteps). Transformers process everything in parallel 
                with attention. But LSTMs are still better for some tasks — especially when 
                you need true online/streaming processing.
              </li>
            </ol>

            <div className="callout">
              <div className="callout-title">📚 Further Reading</div>
              <ul className="text-sm space-y-1 mb-0">
                <li>• Christopher Olah — <em>"Understanding LSTM Networks"</em> (the visual masterpiece)</li>
                <li>• Greff et al. — <em>"LSTM: A Search Space Odyssey"</em> (benchmarking 8000+ variants)</li>
                <li>• Hochreiter et al. — <em>"xLSTM"</em> (2024, the modern update)</li>
                <li>• Goodfellow et al. — <em>"Deep Learning"</em> Ch. 10 (the textbook treatment)</li>
              </ul>
            </div>

            <p>
              Thanks for reading. I hope this helped make LSTMs less mysterious. 
              If you found it useful, share it with someone who's been struggling to 
              understand what's actually happening inside those gates.
            </p>

            <p>
              And remember: the best way to understand something is to compute it yourself. 
              With pencil. On paper. One number at a time.
            </p>

            <div className="callout" style={{ background: '#f5f3ff', borderColor: '#c4b5fd', marginTop: '2.5rem' }}>
              <div className="callout-title" style={{ color: '#6d28d9' }}>🎬 Ready for the Visual Side?</div>
              <p className="text-sm text-[#44403c] mb-3 leading-relaxed">
                Now that you know every formula and multiplication inside the gates, watch them run interactively in the companion visual explorer. Test live gradient decay rates, play with gate valves, and watch cell states evolve token-by-token.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium text-sm transition-all shadow-sm"
              >
                <span>Launch Interactive Explorer</span>
                <span>→</span>
              </Link>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e7e5e4] py-8 text-center text-sm text-[#78716c]">
        <p>Built with care. All computations verified by hand.</p>
        <p className="mt-2">
          © 2026{' '}
          <a
            href="https://github.com/MAqeel151214"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#44403c] hover:text-[#2563eb] transition-colors"
          >
            Muhammad Aqeel
          </a>
          {' · '}
          <a
            href="https://github.com/MAqeel151214/LSTM"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#2563eb] underline transition-colors"
          >
            Open Source under MIT License
          </a>
        </p>
      </footer>
    </div>
  );
}
