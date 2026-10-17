import { DisplayMath as MathBlock } from '../../utils/math.tsx';
import { sigmoid, tanhFn, matVec2x4, addVec, mulVec, fmt, fmtShort, computeStep, WEIGHTS, INPUTS, TARGET } from '../../utils/math.tsx';

const { W_y, b_y } = WEIGHTS;
const inputs = INPUTS;
const target = TARGET;

export default function ForwardPass() {
  // Compute all timesteps
  const step1 = computeStep([0, 0], [0, 0], inputs[0]);
  const step2 = computeStep(step1.h, step1.C, inputs[1]);
  const step3 = computeStep(step2.h, step2.C, inputs[2]);

  // Output prediction
  const y_pred_raw = addVec(
    [W_y[0][0] * step3.h[0] + W_y[0][1] * step3.h[1], W_y[1][0] * step3.h[0] + W_y[1][1] * step3.h[1]],
    b_y
  );

  // MSE Loss
  const loss = 0.5 * ((y_pred_raw[0] - target[0]) ** 2 + (y_pred_raw[1] - target[1]) ** 2);

  return (
    <section id="forward">
      <h2>Forward Pass: Timestep by Timestep</h2>

      <p>
        This is it. The moment we've been building toward. Let's trace through the LSTM 
        one timestep at a time, computing every single number. I'll show you the formula, 
        then plug in the actual values, then show you the result. No steps skipped.
      </p>

      <p>
        Here's the plan: at each timestep, we'll compute four things in order:
      </p>

      <div className="flow-step">
        <div className="step-num bg-red-100 text-red-700">1</div>
        <div>
          <strong className="text-red-700">Forget gate</strong> — what to erase from old memory
        </div>
      </div>
      <div className="flow-step">
        <div className="step-num bg-green-100 text-green-700">2</div>
        <div>
          <strong className="text-green-700">Input gate + Candidate</strong> — what new info to add
        </div>
      </div>
      <div className="flow-step">
        <div className="step-num bg-amber-100 text-amber-700">3</div>
        <div>
          <strong className="text-amber-700">Cell state update</strong> — combine old + new
        </div>
      </div>
      <div className="flow-step">
        <div className="step-num bg-blue-100 text-blue-700">4</div>
        <div>
          <strong className="text-blue-700">Output gate</strong> — what to output as hidden state
        </div>
      </div>

      {/* ============ TIMESTEP 1 ============ */}
      <h3>Timestep 1: x₁ = [0.5, 0.1]</h3>

      <p>
        We start with h₀ = [0.0, 0.0] and C₀ = [0.0, 0.0]. The input is x₁ = [0.5, 0.1].
        First, we concatenate h₀ and x₁:
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Concatenation</div>
          [h₀, x₁] = [0.0, 0.0, 0.5, 0.1]
        </div>
      </div>

      <p>
        This 4D vector is what gets fed into every gate. Now let's compute each gate.
      </p>

      {/* Forget Gate */}
      <div className="gate-box forget">
        <strong>Step 1: Forget Gate</strong>
        <p className="text-sm mt-2 mb-3">
          The forget gate decides what to keep from the old cell state C₀.
          Since C₀ is all zeros, this is mostly academic — but let's compute it anyway 
          because the pattern matters.
        </p>
        <MathBlock tex="f_1 = \sigma(W_f \cdot [h_0, x_1] + b_f)" />
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">Matrix multiplication: W_f × [h₀, x₁]</div>
            <pre className="text-xs">{`Row 0: (0.15)(0.0) + (-0.10)(0.0) + (0.20)(0.5) + (0.05)(0.1)
     = 0 + 0 + 0.100 + 0.005 = 0.105

Row 1: (-0.05)(0.0) + (0.25)(0.0) + (-0.15)(0.5) + (0.10)(0.1)
     = 0 + 0 + (-0.075) + 0.010 = -0.065`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Add bias</div>
            <pre className="text-xs">{`[0.105, -0.065] + [0.10, 0.05] = [0.205, -0.015]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Apply sigmoid</div>
            <pre className="text-xs">{`f₁ = [σ(0.205), σ(-0.015)]
   = [1/(1+e⁻⁰·²⁰⁵), 1/(1+e⁰·⁰¹⁵)]
   = [0.5511, 0.4963]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">f₁ = [0.5511, 0.4963]</span>
            <p className="text-xs text-[#78716c] mt-1">
              Both values near 0.5 — the gate is "half-open." Since C₀ is zero anyway, 
              this doesn't matter yet, but the pattern is set.
            </p>
          </div>
        </div>
      </div>

      {/* Input Gate */}
      <div className="gate-box input">
        <strong>Step 2: Input Gate</strong>
        <p className="text-sm mt-2 mb-3">
          The input gate decides how much of the new candidate values to let in.
        </p>
        <MathBlock tex="i_1 = \sigma(W_i \cdot [h_0, x_1] + b_i)" />
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">Matrix multiplication: W_i × [h₀, x₁]</div>
            <pre className="text-xs">{`Row 0: (0.20)(0.0) + (0.10)(0.0) + (-0.05)(0.5) + (0.15)(0.1)
     = 0 + 0 + (-0.025) + 0.015 = -0.010

Row 1: (-0.10)(0.0) + (0.05)(0.0) + (0.25)(0.5) + (-0.20)(0.1)
     = 0 + 0 + 0.125 + (-0.020) = 0.105`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Add bias</div>
            <pre className="text-xs">{`[-0.010, 0.105] + [-0.10, 0.15] = [-0.110, 0.255]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Apply sigmoid</div>
            <pre className="text-xs">{`i₁ = [σ(-0.110), σ(0.255)]
   = [0.4725, 0.5634]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">i₁ = [0.4725, 0.5634]</span>
            <p className="text-xs text-[#78716c] mt-1">
              Dimension 1 has a slightly higher input gate value — the network is 
              slightly more open to writing new info into that dimension.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate */}
      <div className="gate-box candidate">
        <strong>Step 3: Candidate Values (C̃₁)</strong>
        <p className="text-sm mt-2 mb-3">
          The candidate creates new potential values for the cell state. 
          Notice we use <strong>tanh</strong> here (not sigmoid) because values can be negative.
        </p>
        <MathBlock tex="\tilde{C}_1 = \tanh(W_C \cdot [h_0, x_1] + b_C)" />
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">Matrix multiplication: W_C × [h₀, x₁]</div>
            <pre className="text-xs">{`Row 0: (-0.20)(0.0) + (0.15)(0.0) + (0.10)(0.5) + (-0.05)(0.1)
     = 0 + 0 + 0.050 + (-0.005) = 0.045

Row 1: (0.05)(0.0) + (-0.10)(0.0) + (0.20)(0.5) + (0.25)(0.1)
     = 0 + 0 + 0.100 + 0.025 = 0.125`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Add bias</div>
            <pre className="text-xs">{`[0.045, 0.125] + [0.00, 0.05] = [0.045, 0.175]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Apply tanh</div>
            <pre className="text-xs">{`C̃₁ = [tanh(0.045), tanh(0.175)]
   = [0.0450, 0.1733]`}</pre>
            <p className="text-xs text-[#78716c] mt-1">
              For small inputs, tanh(x) ≈ x, so these are close to the raw values.
            </p>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">C̃₁ = [0.0450, 0.1733]</span>
          </div>
        </div>
      </div>

      {/* Cell State Update */}
      <div className="gate-box cell">
        <strong>Step 4: Cell State Update</strong>
        <p className="text-sm mt-2 mb-3">
          Now the magic: we combine old memory (weighted by forget gate) with new info 
          (weighted by input gate). This is element-wise multiplication followed by addition.
        </p>
        <MathBlock tex="C_1 = f_1 \odot C_0 + i_1 \odot \tilde{C}_1" />
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">f₁ ⊙ C₀ (forget old)</div>
            <pre className="text-xs">{`[0.5511, 0.4963] ⊙ [0.0, 0.0] = [0.0, 0.0]`}</pre>
            <p className="text-xs text-[#78716c]">C₀ is zero, so nothing to forget.</p>
          </div>
          <div className="step">
            <div className="step-label">i₁ ⊙ C̃₁ (add new)</div>
            <pre className="text-xs">{`[0.4725, 0.5634] ⊙ [0.0450, 0.1733]
= [0.4725 × 0.0450, 0.5634 × 0.1733]
= [0.0213, 0.0976]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Add them</div>
            <pre className="text-xs">{`C₁ = [0.0 + 0.0213, 0.0 + 0.0976] = [0.0213, 0.0976]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">C₁ = [0.0213, 0.0976]</span>
            <p className="text-xs text-[#78716c] mt-1">
              The cell state now has some values! Dimension 1 has more "memory" 
              because both the input gate and candidate were larger there.
            </p>
          </div>
        </div>
      </div>

      {/* Output Gate */}
      <div className="gate-box output">
        <strong>Step 5: Output Gate</strong>
        <p className="text-sm mt-2 mb-3">
          Finally, we decide what to output. First tanh the cell state, then multiply by the output gate.
        </p>
        <MathBlock tex="o_1 = \sigma(W_o \cdot [h_0, x_1] + b_o)" />
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">Matrix multiplication: W_o × [h₀, x₁]</div>
            <pre className="text-xs">{`Row 0: (0.10)(0.0) + (0.20)(0.0) + (-0.15)(0.5) + (0.05)(0.1)
     = 0 + 0 + (-0.075) + 0.005 = -0.070

Row 1: (-0.05)(0.0) + (0.10)(0.0) + (0.15)(0.5) + (-0.10)(0.1)
     = 0 + 0 + 0.075 + (-0.010) = 0.065`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Add bias</div>
            <pre className="text-xs">{`[-0.070, 0.065] + [0.05, -0.05] = [-0.020, 0.015]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Apply sigmoid</div>
            <pre className="text-xs">{`o₁ = [σ(-0.020), σ(0.015)]
   = [0.4950, 0.5038]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">tanh(C₁)</div>
            <pre className="text-xs">{`tanh([0.0213, 0.0976]) = [0.0213, 0.0972]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">h₁ = o₁ ⊙ tanh(C₁)</div>
            <pre className="text-xs">{`[0.4950, 0.5038] ⊙ [0.0213, 0.0972]
= [0.4950 × 0.0213, 0.5038 × 0.0972]
= [0.0105, 0.0490]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">h₁ = [0.0105, 0.0490]</span>
            <p className="text-xs text-[#78716c] mt-1">
              The hidden state is small — the output gate is near 0.5 (half-open), 
              so we're outputting about half of the cell state's tanh.
            </p>
          </div>
        </div>
      </div>

      {/* Summary of Timestep 1 */}
      <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4 my-6">
        <p className="font-semibold text-green-800 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          ✅ Timestep 1 Complete
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
          <div>f₁ = [0.551, 0.496]</div>
          <div>i₁ = [0.473, 0.563]</div>
          <div>C̃₁ = [0.045, 0.173]</div>
          <div>C₁ = [0.021, 0.098]</div>
          <div>o₁ = [0.495, 0.504]</div>
          <div>h₁ = [0.011, 0.049]</div>
        </div>
      </div>

      {/* ============ TIMESTEP 2 ============ */}
      <h3>Timestep 2: x₂ = [0.3, 0.8]</h3>

      <p>
        Now things get interesting. We have actual memory from timestep 1, and a new input 
        that's quite different from the first one. Let's see how the LSTM handles it.
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Concatenation</div>
          [h₁, x₂] = [{fmtShort(step1.h[0])}, {fmtShort(step1.h[1])}, 0.3, 0.8]
          = <span className="result">[{fmt(step1.h[0])}, {fmt(step1.h[1])}, 0.3000, 0.8000]</span>
        </div>
      </div>

      {/* Forget Gate t=2 */}
      <div className="gate-box forget">
        <strong>Forget Gate at t=2</strong>
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">W_f × [h₁, x₂]</div>
            <pre className="text-xs">{`Row 0: (0.15)(${fmt(step1.h[0])}) + (-0.10)(${fmt(step1.h[1])}) + (0.20)(0.3) + (0.05)(0.8)
     = ${fmt(0.15 * step1.h[0])} + ${fmt(-0.10 * step1.h[1])} + 0.0600 + 0.0400
     = ${fmt(0.15 * step1.h[0] + (-0.10) * step1.h[1] + 0.06 + 0.04)}

Row 1: (-0.05)(${fmt(step1.h[0])}) + (0.25)(${fmt(step1.h[1])}) + (-0.15)(0.3) + (0.10)(0.8)
     = ${fmt(-0.05 * step1.h[0])} + ${fmt(0.25 * step1.h[1])} + (-0.0450) + 0.0800
     = ${fmt(-0.05 * step1.h[0] + 0.25 * step1.h[1] - 0.045 + 0.08)}`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Add bias + sigmoid</div>
            <pre className="text-xs">{`f₂ = σ([${fmt(step2.f_raw[0])}, ${fmt(step2.f_raw[1])}] + [0.10, 0.05])
   = σ([${fmt(step2.f_raw[0] + 0.10)}, ${fmt(step2.f_raw[1] + 0.05)}])
   = [${fmt(step2.f[0])}, ${fmt(step2.f[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">f₂ = [{fmt(step2.f[0])}, {fmt(step2.f[1])}]</span>
            <p className="text-xs text-[#78716c] mt-1">
              {step2.f[0] > 0.6 ? 'Dimension 0: high forget → keeping old memory' : 'Dimension 0: moderate forget'}
              {' · '}
              {step2.f[1] > 0.6 ? 'Dimension 1: high forget → keeping old memory' : 'Dimension 1: moderate forget'}
            </p>
          </div>
        </div>
      </div>

      {/* Input Gate t=2 */}
      <div className="gate-box input">
        <strong>Input Gate at t=2</strong>
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">Compute i₂</div>
            <pre className="text-xs">{`i₂ = σ(W_i × [h₁, x₂] + b_i)
   = σ([${fmt(step2.i_raw[0] + (-0.10))}, ${fmt(step2.i_raw[1] + 0.15)}])
   = [${fmt(step2.i_gate[0])}, ${fmt(step2.i_gate[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Candidate C̃₂</div>
            <pre className="text-xs">{`C̃₂ = tanh(W_C × [h₁, x₂] + b_C)
   = tanh([${fmt(step2.C_raw[0])}, ${fmt(step2.C_raw[1])}])
   = [${fmt(step2.C_tilde[0])}, ${fmt(step2.C_tilde[1])}]`}</pre>
          </div>
        </div>
      </div>

      {/* Cell State Update t=2 */}
      <div className="gate-box cell">
        <strong>Cell State Update at t=2</strong>
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">f₂ ⊙ C₁ (keep from old memory)</div>
            <pre className="text-xs">{`[${fmt(step2.f[0])}, ${fmt(step2.f[1])}] ⊙ [${fmt(step1.C[0])}, ${fmt(step1.C[1])}]
= [${fmt(step2.f[0] * step1.C[0])}, ${fmt(step2.f[1] * step1.C[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">i₂ ⊙ C̃₂ (add new info)</div>
            <pre className="text-xs">{`[${fmt(step2.i_gate[0])}, ${fmt(step2.i_gate[1])}] ⊙ [${fmt(step2.C_tilde[0])}, ${fmt(step2.C_tilde[1])}]
= [${fmt(step2.i_gate[0] * step2.C_tilde[0])}, ${fmt(step2.i_gate[1] * step2.C_tilde[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">C₂ = f₂ ⊙ C₁ + i₂ ⊙ C̃₂</div>
            <pre className="text-xs">{`C₂ = [${fmt(step2.f[0] * step1.C[0] + step2.i_gate[0] * step2.C_tilde[0])}, ${fmt(step2.f[1] * step1.C[1] + step2.i_gate[1] * step2.C_tilde[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">C₂ = [{fmt(step2.C[0])}, {fmt(step2.C[1])}]</span>
          </div>
        </div>
      </div>

      {/* Output Gate t=2 */}
      <div className="gate-box output">
        <strong>Output Gate at t=2</strong>
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">h₂ = o₂ ⊙ tanh(C₂)</div>
            <pre className="text-xs">{`o₂ = [${fmt(step2.o[0])}, ${fmt(step2.o[1])}]
tanh(C₂) = [${fmt(Math.tanh(step2.C[0]))}, ${fmt(Math.tanh(step2.C[1]))}]
h₂ = [${fmt(step2.h[0])}, ${fmt(step2.h[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">Result</div>
            <span className="result">h₂ = [{fmt(step2.h[0])}, {fmt(step2.h[1])}]</span>
          </div>
        </div>
      </div>

      {/* Summary of Timestep 2 */}
      <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4 my-6">
        <p className="font-semibold text-green-800 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          ✅ Timestep 2 Complete
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
          <div>f₂ = [{fmtShort(step2.f[0])}, {fmtShort(step2.f[1])}]</div>
          <div>i₂ = [{fmtShort(step2.i_gate[0])}, {fmtShort(step2.i_gate[1])}]</div>
          <div>C₂ = [{fmtShort(step2.C[0])}, {fmtShort(step2.C[1])}]</div>
          <div>h₂ = [{fmtShort(step2.h[0])}, {fmtShort(step2.h[1])}]</div>
        </div>
        <p className="text-xs text-[#78716c] mt-2">
          Notice how C₂ is larger than C₁ — memory is accumulating! The cell state 
          is building up information across timesteps.
        </p>
      </div>

      {/* ============ TIMESTEP 3 ============ */}
      <h3>Timestep 3: x₃ = [0.9, 0.2]</h3>

      <p>
        Final timestep. The cell state now carries memories from both previous inputs. 
        Let's see the complete computation.
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Concatenation</div>
          [h₂, x₃] = <span className="result">[{fmt(step2.h[0])}, {fmt(step2.h[1])}, 0.9000, 0.2000]</span>
        </div>
      </div>

      {/* All gates for t=3 */}
      <div className="calc-block">
        <div className="step">
          <div className="step-label">Forget Gate</div>
          <pre className="text-xs">{`f₃ = σ(W_f × [h₂, x₃] + b_f) = [${fmt(step3.f[0])}, ${fmt(step3.f[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Input Gate</div>
          <pre className="text-xs">{`i₃ = σ(W_i × [h₂, x₃] + b_i) = [${fmt(step3.i_gate[0])}, ${fmt(step3.i_gate[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Candidate</div>
          <pre className="text-xs">{`C̃₃ = tanh(W_C × [h₂, x₃] + b_C) = [${fmt(step3.C_tilde[0])}, ${fmt(step3.C_tilde[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Cell State Update</div>
          <pre className="text-xs">{`C₃ = f₃ ⊙ C₂ + i₃ ⊙ C̃₃
   = [${fmt(step3.f[0])}, ${fmt(step3.f[1])}] ⊙ [${fmt(step2.C[0])}, ${fmt(step2.C[1])}]
   + [${fmt(step3.i_gate[0])}, ${fmt(step3.i_gate[1])}] ⊙ [${fmt(step3.C_tilde[0])}, ${fmt(step3.C_tilde[1])}]
   = [${fmt(step3.C[0])}, ${fmt(step3.C[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Output Gate</div>
          <pre className="text-xs">{`o₃ = [${fmt(step3.o[0])}, ${fmt(step3.o[1])}]
h₃ = o₃ ⊙ tanh(C₃) = [${fmt(step3.h[0])}, ${fmt(step3.h[1])}]`}</pre>
        </div>
      </div>

      {/* Final Summary */}
      <div className="bg-[#eff6ff] border border-[#93c5fd] rounded-xl p-4 my-6">
        <p className="font-semibold text-blue-800 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          📊 Forward Pass Complete — All Three Timesteps
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="text-left p-2">Timestep</th>
                <th className="text-left p-2">Input</th>
                <th className="text-left p-2">Cell State C</th>
                <th className="text-left p-2">Hidden State h</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-100">
                <td className="p-2">t=1</td>
                <td className="p-2">[0.50, 0.10]</td>
                <td className="p-2">[{fmtShort(step1.C[0])}, {fmtShort(step1.C[1])}]</td>
                <td className="p-2">[{fmtShort(step1.h[0])}, {fmtShort(step1.h[1])}]</td>
              </tr>
              <tr className="border-b border-blue-100">
                <td className="p-2">t=2</td>
                <td className="p-2">[0.30, 0.80]</td>
                <td className="p-2">[{fmtShort(step2.C[0])}, {fmtShort(step2.C[1])}]</td>
                <td className="p-2">[{fmtShort(step2.h[0])}, {fmtShort(step2.h[1])}]</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">t=3</td>
                <td className="p-2">[0.90, 0.20]</td>
                <td className="p-2 font-semibold">[{fmtShort(step3.C[0])}, {fmtShort(step3.C[1])}]</td>
                <td className="p-2 font-semibold">[{fmtShort(step3.h[0])}, {fmtShort(step3.h[1])}]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Output and Loss */}
      <h3>Output Prediction and Loss</h3>

      <p>
        After processing all three timesteps, we take the final hidden state h₃ and project 
        it to get our prediction. We use mean squared error (MSE) as our loss function.
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Output projection: ŷ = W_y · h₃ + b_y</div>
          <pre className="text-xs">{`ŷ₀ = (0.30)(${fmt(step3.h[0])}) + (-0.10)(${fmt(step3.h[1])}) + 0.00
   = ${fmt(0.30 * step3.h[0])} + ${fmt(-0.10 * step3.h[1])} + 0
   = ${fmt(y_pred_raw[0])}

ŷ₁ = (0.15)(${fmt(step3.h[0])}) + (0.25)(${fmt(step3.h[1])}) + 0.10
   = ${fmt(0.15 * step3.h[0])} + ${fmt(0.25 * step3.h[1])} + 0.10
   = ${fmt(y_pred_raw[1])}`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Prediction</div>
          <span className="result">ŷ = [{fmt(y_pred_raw[0])}, {fmt(y_pred_raw[1])}]</span>
        </div>
        <div className="step">
          <div className="step-label">Target</div>
          y = [{target[0]}, {target[1]}]
        </div>
        <div className="step">
          <div className="step-label">MSE Loss: L = ½ Σ(ŷᵢ - yᵢ)²</div>
          <pre className="text-xs">{`L = 0.5 × [(${fmt(y_pred_raw[0])} - ${target[0]})² + (${fmt(y_pred_raw[1])} - ${target[1]})²]
  = 0.5 × [(${fmt(y_pred_raw[0] - target[0])})² + (${fmt(y_pred_raw[1] - target[1])})²]
  = 0.5 × [${fmt((y_pred_raw[0] - target[0]) ** 2)} + ${fmt((y_pred_raw[1] - target[1]) ** 2)}]
  = ${fmt(loss)}`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Final Loss</div>
          <span className="result">L = {fmt(loss)}</span>
          <p className="text-xs text-[#78716c] mt-1">
            That's our loss. It's fairly large because the network hasn't been trained yet 
            (we initialized with random small weights). The goal of backpropagation is to 
            reduce this number.
          </p>
        </div>
      </div>

      <div className="callout warning">
        <div className="callout-title">⚠️ Before We Continue...</div>
        <p className="text-sm mb-0">
          Take a moment to absorb what just happened. We started with three input vectors, 
          ran them through an LSTM cell three times (each time using the previous hidden state 
          and cell state), and ended up with a prediction and a loss value. 
          Every number above is exact — you could verify them with a calculator. 
          Now let's do the hard part: figuring out how to change the weights to reduce that loss.
        </p>
      </div>
    </section>
  );
}
