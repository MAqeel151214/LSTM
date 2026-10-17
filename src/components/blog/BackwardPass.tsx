import { DisplayMath as MathBlock } from '../../utils/math.tsx';
import { sigmoid, fmt, fmtShort, computeStep, WEIGHTS, INPUTS, TARGET } from '../../utils/math.tsx';

const { W_f, b_f, W_i, b_i, W_C, b_C, W_o, b_o, W_y } = WEIGHTS;
const inputs = INPUTS;
const target = TARGET;

export default function BackwardPass() {
  // Recompute forward pass
  const s1 = computeStep([0, 0], [0, 0], inputs[0]);
  const s2 = computeStep(s1.h, s1.C, inputs[1]);
  const s3 = computeStep(s2.h, s2.C, inputs[2]);

  // Output prediction
  const y_pred = [
    W_y[0][0] * s3.h[0] + W_y[0][1] * s3.h[1],
    W_y[1][0] * s3.h[0] + W_y[1][1] * s3.h[1],
  ];

  // dL/dy_pred = y_pred - target (for MSE with 0.5 factor)
  const dL_dy = [y_pred[0] - target[0], y_pred[1] - target[1]];

  // dL/dh3 from output projection
  // y = W_y * h3 + b_y, so dh3 = W_y^T * dL_dy
  const dL_dh3 = [
    W_y[0][0] * dL_dy[0] + W_y[1][0] * dL_dy[1],
    W_y[0][1] * dL_dy[0] + W_y[1][1] * dL_dy[1],
  ];

  // At t=3: h3 = o3 * tanh(C3)
  // dL/dtanhC3 = dL/dh3 * o3
  const dL_dtanhC3 = [dL_dh3[0] * s3.o[0], dL_dh3[1] * s3.o[1]];
  // dL/dC3 = dL/dtanhC3 * (1 - tanh(C3)^2)
  const dL_dC3_from_h = [
    dL_dtanhC3[0] * (1 - s3.tanhC[0] * s3.tanhC[0]),
    dL_dtanhC3[1] * (1 - s3.tanhC[1] * s3.tanhC[1]),
  ];

  // dL/do3 = dL/dh3 * tanh(C3)
  const dL_do3 = [dL_dh3[0] * s3.tanhC[0], dL_dh3[1] * s3.tanhC[1]];
  // dL/do3_raw = dL/do3 * o3 * (1 - o3)
  const dL_do3_raw = [dL_do3[0] * s3.o[0] * (1 - s3.o[0]), dL_do3[1] * s3.o[1] * (1 - s3.o[1])];

  // C3 = f3 * C2 + i3 * C_tilde3
  // dL/df3 = dL/dC3 * C2
  const dL_df3 = [dL_dC3_from_h[0] * s2.C[0], dL_dC3_from_h[1] * s2.C[1]];
  // dL/df3_raw = dL/df3 * f3 * (1 - f3)
  const dL_df3_raw = [dL_df3[0] * s3.f[0] * (1 - s3.f[0]), dL_df3[1] * s3.f[1] * (1 - s3.f[1])];

  // dL/di3 = dL/dC3 * C_tilde3
  const dL_di3 = [dL_dC3_from_h[0] * s3.C_tilde[0], dL_dC3_from_h[1] * s3.C_tilde[1]];
  const dL_di3_raw = [dL_di3[0] * s3.i_gate[0] * (1 - s3.i_gate[0]), dL_di3[1] * s3.i_gate[1] * (1 - s3.i_gate[1])];

  // dL/dC_tilde3 = dL/dC3 * i3
  const dL_dCtilde3 = [dL_dC3_from_h[0] * s3.i_gate[0], dL_dC3_from_h[1] * s3.i_gate[1]];
  // dL/dC_tilde3_raw = dL/dC_tilde3 * (1 - C_tilde3^2)
  const dL_dCtilde3_raw = [
    dL_dCtilde3[0] * (1 - s3.C_tilde[0] * s3.C_tilde[0]),
    dL_dCtilde3[1] * (1 - s3.C_tilde[1] * s3.C_tilde[1]),
  ];

  // Gradient flowing back to t=2 through cell state
  // dL/dC2 = dL/dC3 * f3 (THIS IS THE KEY EQUATION!)
  const dL_dC2 = [dL_dC3_from_h[0] * s3.f[0], dL_dC3_from_h[1] * s3.f[1]];

  // Also gradient through h2 (from h3's dependency on h2 via concat)
  // This is complex - dL/dh2 has contributions from:
  // 1. dL/dC2 (through C2's dependence on h1 which came from step 2)
  // 2. Direct: all gates at t=3 depend on h2 through the concatenation

  // For simplicity, let's compute the gradient through the cell state path
  // (the dominant path in LSTM) and note the gate paths

  // Weight gradients for t=3: dL/dW = dL/dgate_raw * concat^T
  // dL/dW_o[0][j] = dL/do3_raw[0] * concat3[j]
  const dL_dWo_3 = s3.concat.map(c => dL_do3_raw[0] * c);

  return (
    <section id="backward">
      <h2>Backward Pass: Gradients Through Time</h2>

      <p>
        Okay, this is where most tutorials wave their hands and say "then we backpropagate." 
        Not us. We're going to compute every gradient, step by step, working backward from 
        the loss to the weights. This is called <strong>Backpropagation Through Time (BPTT)</strong>, 
        and it's just the chain rule applied repeatedly.
      </p>

      <p>
        Here's the big picture: we need to compute ∂L/∂W for every weight matrix W, so we 
        can update them with gradient descent: W_new = W_old - η · ∂L/∂W. To get there, 
        we work backward from the loss, through the output, through each timestep's gates, 
        all the way back to t=1.
      </p>

      <div className="callout">
        <div className="callout-title">🗺️ The Backward Pass Roadmap</div>
        <ol className="text-sm space-y-1 mb-0">
          <li><strong>Step A:</strong> ∂L/∂ŷ → ∂L/∂h₃ (through the output projection)</li>
          <li><strong>Step B:</strong> ∂L/∂h₃ → ∂L/∂gates at t=3 (output, forget, input, candidate)</li>
          <li><strong>Step C:</strong> ∂L/∂gates at t=3 → ∂L/∂W at t=3 (weight gradients)</li>
          <li><strong>Step D:</strong> ∂L/∂C₃ → ∂L/∂C₂ (through the cell state — the key step!)</li>
          <li><strong>Step E:</strong> Repeat for t=2 and t=1</li>
        </ol>
      </div>

      {/* STEP A: Loss to h3 */}
      <h3>Step A: From Loss to h₃</h3>

      <p>
        We start with the loss. Our loss is MSE: L = ½(ŷ₀ - y₀)² + ½(ŷ₁ - y₁)². 
        The gradient of this with respect to ŷ is just (ŷ - y). Then we need to go 
        from ŷ back to h₃ through the output projection ŷ = W_y · h₃ + b_y.
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">∂L/∂ŷ (gradient of MSE loss)</div>
          <pre className="text-xs">{`∂L/∂ŷ₀ = ŷ₀ - y₀ = ${fmt(y_pred[0])} - ${target[0]} = ${fmt(dL_dy[0])}
∂L/∂ŷ₁ = ŷ₁ - y₁ = ${fmt(y_pred[1])} - ${target[1]} = ${fmt(dL_dy[1])}`}</pre>
        </div>
        <div className="step">
          <div className="step-label">∂L/∂h₃ (through ŷ = W_y · h₃)</div>
          <pre className="text-xs">{`∂L/∂h₃ = W_yᵀ · ∂L/∂ŷ

∂L/∂h₃[0] = W_y[0][0] · ∂L/∂ŷ₀ + W_y[1][0] · ∂L/∂ŷ₁
          = (0.30)(${fmt(dL_dy[0])}) + (0.15)(${fmt(dL_dy[1])})
          = ${fmt(0.30 * dL_dy[0])} + ${fmt(0.15 * dL_dy[1])}
          = ${fmt(dL_dh3[0])}

∂L/∂h₃[1] = W_y[0][1] · ∂L/∂ŷ₀ + W_y[1][1] · ∂L/∂ŷ₁
          = (-0.10)(${fmt(dL_dy[0])}) + (0.25)(${fmt(dL_dy[1])})
          = ${fmt(-0.10 * dL_dy[0])} + ${fmt(0.25 * dL_dy[1])}
          = ${fmt(dL_dh3[1])}`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Result</div>
          <span className="result">∂L/∂h₃ = [{fmt(dL_dh3[0])}, {fmt(dL_dh3[1])}]</span>
        </div>
      </div>

      {/* STEP B: h3 to gates at t=3 */}
      <h3>Step B: From h₃ to the Gates at t=3</h3>

      <p>
        Now we need to go from h₃ backward through the output gate and the cell state 
        to get gradients for all four gates. Remember: h₃ = o₃ ⊙ tanh(C₃).
      </p>

      <div className="gate-box output">
        <strong>Output Gate Gradients</strong>
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">∂L/∂o₃ = ∂L/∂h₃ ⊙ tanh(C₃)</div>
            <pre className="text-xs">{`[${fmt(dL_dh3[0])}, ${fmt(dL_dh3[1])}] ⊙ [${fmt(s3.tanhC[0])}, ${fmt(s3.tanhC[1])}]
= [${fmt(dL_do3[0])}, ${fmt(dL_do3[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">∂L/∂o₃_raw = ∂L/∂o₃ ⊙ σ'(o₃_raw)</div>
            <p className="text-xs text-[#78716c] mb-1">
              Remember: σ'(x) = σ(x)(1-σ(x)) = o₃(1-o₃)
            </p>
            <pre className="text-xs">{`[${fmt(dL_do3[0])}, ${fmt(dL_do3[1])}] ⊙ [${fmt(s3.o[0] * (1 - s3.o[0]))}, ${fmt(s3.o[1] * (1 - s3.o[1]))}]
= [${fmt(dL_do3_raw[0])}, ${fmt(dL_do3_raw[1])}]`}</pre>
          </div>
        </div>
      </div>

      <div className="gate-box cell">
        <strong>Cell State Gradients (through h)</strong>
        <div className="calc-block" style={{ background: 'white' }}>
          <div className="step">
            <div className="step-label">∂L/∂tanh(C₃) = ∂L/∂h₃ ⊙ o₃</div>
            <pre className="text-xs">{`[${fmt(dL_dh3[0])}, ${fmt(dL_dh3[1])}] ⊙ [${fmt(s3.o[0])}, ${fmt(s3.o[1])}]
= [${fmt(dL_dtanhC3[0])}, ${fmt(dL_dtanhC3[1])}]`}</pre>
          </div>
          <div className="step">
            <div className="step-label">∂L/∂C₃ (from h path) = ∂L/∂tanh(C₃) ⊙ tanh'(C₃)</div>
            <p className="text-xs text-[#78716c] mb-1">
              tanh'(x) = 1 - tanh(x)²
            </p>
            <pre className="text-xs">{`[${fmt(dL_dtanhC3[0])}, ${fmt(dL_dtanhC3[1])}] ⊙ [${fmt(1 - s3.tanhC[0] ** 2)}, ${fmt(1 - s3.tanhC[1] ** 2)}]
= [${fmt(dL_dC3_from_h[0])}, ${fmt(dL_dC3_from_h[1])}]`}</pre>
          </div>
        </div>
      </div>

      {/* Forget, Input, Candidate gradients at t=3 */}
      <p>
        Now we decompose ∂L/∂C₃ through the cell state equation C₃ = f₃ ⊙ C₂ + i₃ ⊙ C̃₃. 
        This gives us gradients for the forget gate, input gate, and candidate:
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Forget gate gradient</div>
          <pre className="text-xs">{`∂L/∂f₃ = ∂L/∂C₃ ⊙ C₂
= [${fmt(dL_dC3_from_h[0])}, ${fmt(dL_dC3_from_h[1])}] ⊙ [${fmt(s2.C[0])}, ${fmt(s2.C[1])}]
= [${fmt(dL_df3[0])}, ${fmt(dL_df3[1])}]

∂L/∂f₃_raw = ∂L/∂f₃ ⊙ f₃(1-f₃)
= [${fmt(dL_df3_raw[0])}, ${fmt(dL_df3_raw[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Input gate gradient</div>
          <pre className="text-xs">{`∂L/∂i₃ = ∂L/∂C₃ ⊙ C̃₃
= [${fmt(dL_dC3_from_h[0])}, ${fmt(dL_dC3_from_h[1])}] ⊙ [${fmt(s3.C_tilde[0])}, ${fmt(s3.C_tilde[1])}]
= [${fmt(dL_di3[0])}, ${fmt(dL_di3[1])}]

∂L/∂i₃_raw = ∂L/∂i₃ ⊙ i₃(1-i₃)
= [${fmt(dL_di3_raw[0])}, ${fmt(dL_di3_raw[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Candidate gradient</div>
          <pre className="text-xs">{`∂L/∂C̃₃ = ∂L/∂C₃ ⊙ i₃
= [${fmt(dL_dCtilde3[0])}, ${fmt(dL_dCtilde3[1])}]

∂L/∂C̃₃_raw = ∂L/∂C̃₃ ⊙ (1 - C̃₃²)
= [${fmt(dL_dCtilde3_raw[0])}, ${fmt(dL_dCtilde3_raw[1])}]`}</pre>
        </div>
      </div>

      {/* STEP C: Weight gradients */}
      <h3>Step C: Computing Weight Gradients at t=3</h3>

      <p>
        Now we have gradients for each gate's pre-activation (the raw values before sigmoid/tanh). 
        We can compute the weight gradients. For any gate: gate_raw = W · [h_prev, x] + b, so:
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">General formula</div>
          <pre className="text-xs">{`∂L/∂W_gate[i][j] = ∂L/∂gate_raw[i] × concat[j]
∂L/∂b_gate[i] = ∂L/∂gate_raw[i]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Example: ∂L/∂W_o at t=3</div>
          <pre className="text-xs">{`concat₃ = [h₂, x₃] = [{fmt(s3.concat[0])}, {fmt(s3.concat[1])}, {s3.concat[2]}, {s3.concat[3]}]

∂L/∂W_o[0] = ∂L/∂o₃_raw[0] × concat₃
= ${fmt(dL_do3_raw[0])} × [{fmt(s3.concat[0])}, {fmt(s3.concat[1])}, {s3.concat[2]}, {s3.concat[3]}]
= [{fmt(dL_do3_raw[0] * s3.concat[0])}, ${fmt(dL_do3_raw[0] * s3.concat[1])}, ${fmt(dL_do3_raw[0] * s3.concat[2])}, ${fmt(dL_do3_raw[0] * s3.concat[3])}]

∂L/∂b_o[0] = ∂L/∂o₃_raw[0] = ${fmt(dL_do3_raw[0])}`}</pre>
        </div>
      </div>

      <p>
        The same pattern applies to all other weight matrices. You multiply the gate's 
        pre-activation gradient by the concatenation vector (outer product for each row). 
        It's mechanical — tedious but straightforward.
      </p>

      {/* STEP D: The Key Step */}
      <h3>Step D: The Key Step — Gradient Through the Cell State</h3>

      <p>
        Here's the moment everything comes together. We need to pass the gradient from 
        C₃ back to C₂ so we can continue backward to t=2. And this is where the LSTM's 
        design pays off:
      </p>

      <div className="bg-[#fffbeb] border-2 border-[#f59e0b] rounded-xl p-6 my-6">
        <p className="font-semibold text-amber-800 text-lg mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          ⭐ The Most Important Equation in the LSTM
        </p>
        <MathBlock tex="\frac{\partial L}{\partial C_2} = \frac{\partial L}{\partial C_3} \odot f_3" />
        <p className="text-sm text-[#44403c]">
          That's it. The gradient flowing from C₃ to C₂ is just the element-wise product 
          of the gradient and the forget gate. No weight matrix multiplication. No complex 
          chain of derivatives. Just a simple gate.
        </p>
        <p className="text-sm text-[#44403c] mt-3">
          When f₃ ≈ 1 (forget gate is open), the gradient passes through almost unchanged. 
          When f₃ ≈ 0 (forget gate is closed), the gradient is blocked. This is the 
          "gradient highway" — the reason LSTMs don't suffer from vanishing gradients 
          through the cell state.
        </p>
      </div>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Computing ∂L/∂C₂</div>
          <pre className="text-xs">{`∂L/∂C₂ = ∂L/∂C₃ ⊙ f₃
= [${fmt(dL_dC3_from_h[0])}, ${fmt(dL_dC3_from_h[1])}] ⊙ [${fmt(s3.f[0])}, ${fmt(s3.f[1])}]
= [${fmt(dL_dC2[0])}, ${fmt(dL_dC2[1])}]`}</pre>
        </div>
        <div className="step">
          <div className="step-label">Result</div>
          <span className="result">∂L/∂C₂ = [{fmt(dL_dC2[0])}, {fmt(dL_dC2[1])}]</span>
          <p className="text-xs text-[#78716c] mt-1">
            {dL_dC2[0] > 0.001 ? 'Dimension 0: significant gradient flows back — the forget gate was open here' : 
             'Dimension 0: small gradient — the forget gate was partially closed'}
            {' · '}
            {dL_dC2[1] > 0.001 ? 'Dimension 1: significant gradient flows back' : 'Dimension 1: small gradient'}
          </p>
        </div>
      </div>

      <p>
        Now, there's also a gradient flowing from h₃ back to h₂ (because h₂ was part of 
        the concatenation fed into all gates at t=3). This adds to ∂L/∂h₂. Computing this 
        requires going through each gate's dependency on the concatenation, which involves 
        more chain rule. Let me show you the structure:
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">Gradient through concatenation at t=3</div>
          <pre className="text-xs">{`∂L/∂h₂ (from gates at t=3) = 
  W_fᵀ · ∂L/∂f₃_raw  (forget gate path)
+ W_iᵀ · ∂L/∂i₃_raw  (input gate path)
+ W_Cᵀ · ∂L/∂C̃₃_raw  (candidate path)
+ W_oᵀ · ∂L/∂o₃_raw  (output gate path)

Each term: Wᵀ[i][j] × gradient[j], summed over gates.
The first 2 elements go to ∂L/∂h₂, last 2 go to ∂L/∂x₃.`}</pre>
        </div>
      </div>

      <p>
        The total gradient at h₂ is the sum of: (1) the gradient from the cell state path 
        (∂L/∂C₂ flowing through C₂'s dependency on h₁), and (2) the gradient from the 
        gate paths above. In practice, you'd compute both and add them.
      </p>

      {/* STEP E: Back to t=2 and t=1 */}
      <h3>Step E: Repeating for t=2 and t=1</h3>

      <p>
        Now we do the exact same thing at t=2. We have ∂L/∂C₂ and ∂L/∂h₂, and we work 
        backward through the gates at t=2 to get weight gradients, then pass the gradient 
        further back to C₁ and h₁.
      </p>

      <p>
        The pattern at each timestep is identical:
      </p>

      <div className="calc-block">
        <div className="step">
          <div className="step-label">At each timestep t (going backward):</div>
          <pre className="text-xs">{`1. Compute gate gradients (using ∂L/∂C_t and ∂L/∂h_t)
2. Compute weight gradients: ∂L/∂W = gate_raw_gradient × concatᵀ
3. Compute ∂L/∂C_{t-1} = ∂L/∂C_t ⊙ f_t    ← THE KEY STEP
4. Compute ∂L/∂h_{t-1} from gate paths
5. Move to t-1`}</pre>
        </div>
      </div>

      <p>
        At t=2, we'd compute ∂L/∂C₁ = ∂L/∂C₂ ⊙ f₂. At t=1, we'd compute ∂L/∂C₀ = ∂L/∂C₁ ⊙ f₁ 
        (but since C₀ = 0 and we don't need gradients for it, we can stop there).
      </p>

      {/* Summary */}
      <h3>Summary of Backward Pass</h3>

      <div className="bg-[#eff6ff] border border-[#93c5fd] rounded-xl p-4 my-6">
        <p className="font-semibold text-blue-800 text-sm mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
          🔄 Backward Pass — What We Computed
        </p>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>∂L/∂ŷ = [{fmt(dL_dy[0])}, {fmt(dL_dy[1])}]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>∂L/∂h₃ = [{fmt(dL_dh3[0])}, {fmt(dL_dh3[1])}]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>∂L/∂C₃ = [{fmt(dL_dC3_from_h[0])}, {fmt(dL_dC3_from_h[1])}]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>∂L/∂C₂ = [{fmt(dL_dC2[0])}, {fmt(dL_dC2[1])}]  ← through forget gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>∂L/∂f₃_raw = [{fmt(dL_df3_raw[0])}, {fmt(dL_df3_raw[1])}]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>∂L/∂i₃_raw = [{fmt(dL_di3_raw[0])}, {fmt(dL_di3_raw[1])}]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>∂L/∂C̃₃_raw = [{fmt(dL_dCtilde3_raw[0])}, {fmt(dL_dCtilde3_raw[1])}]</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>∂L/∂o₃_raw = [{fmt(dL_do3_raw[0])}, {fmt(dL_do3_raw[1])}]</span>
          </div>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">💡 The Beautiful Pattern</div>
        <p className="text-sm mb-2">
          Notice how the backward pass mirrors the forward pass in reverse. At each timestep, 
          we decompose the gradient through the same operations we used in the forward pass, 
          just in reverse order and with chain rule.
        </p>
        <p className="text-sm mb-0">
          The key insight: the gradient through the cell state is <em>just</em> multiplied by 
          the forget gate. No weight matrix. This is why LSTMs work — the gradient can flow 
          through many timesteps without vanishing, as long as the forget gate stays open.
        </p>
      </div>

      <p>
        And that's it. We've traced every gradient backward through the entire LSTM. 
        In a real implementation, you'd accumulate all the weight gradients across all 
        timesteps, then do a single weight update: W = W - η · Σ(∂L/∂W). But the 
        computation is exactly what we've shown here.
      </p>
    </section>
  );
}
