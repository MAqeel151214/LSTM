import katex from 'katex';

/**
 * Block-level math display (centered, larger).
 * Used throughout both the animation and blog sections.
 */
export function DisplayMath({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: true });
  return <div className="overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Inline math rendering.
 */
export function InlineMath({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// Common math helpers used across the blog's forward/backward pass
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function tanhFn(x: number): number {
  return Math.tanh(x);
}

export function matVec2x4(W: number[][], v: number[]): number[] {
  return [
    W[0][0] * v[0] + W[0][1] * v[1] + W[0][2] * v[2] + W[0][3] * v[3],
    W[1][0] * v[0] + W[1][1] * v[1] + W[1][2] * v[2] + W[1][3] * v[3],
  ];
}

export function addVec(a: number[], b: number[]): number[] {
  return [a[0] + b[0], a[1] + b[1]];
}

export function mulVec(a: number[], b: number[]): number[] {
  return [a[0] * b[0], a[1] * b[1]];
}

export function fmt(n: number): string {
  return n.toFixed(4);
}

export function fmtShort(n: number): string {
  return n.toFixed(3);
}

// Shared weight matrices and data for the blog's numerical walkthrough
export const WEIGHTS = {
  W_f: [[0.15, -0.10, 0.20, 0.05], [-0.05, 0.25, -0.15, 0.10]],
  b_f: [0.10, 0.05],
  W_i: [[0.20, 0.10, -0.05, 0.15], [-0.10, 0.05, 0.25, -0.20]],
  b_i: [-0.10, 0.15],
  W_C: [[-0.20, 0.15, 0.10, -0.05], [0.05, -0.10, 0.20, 0.25]],
  b_C: [0.00, 0.05],
  W_o: [[0.10, 0.20, -0.15, 0.05], [-0.05, 0.10, 0.15, -0.10]],
  b_o: [0.05, -0.05],
  W_y: [[0.30, -0.10], [0.15, 0.25]],
  b_y: [0.00, 0.10],
};

export const INPUTS = [[0.5, 0.1], [0.3, 0.8], [0.9, 0.2]];
export const TARGET = [0.7, 0.4];

/** Compute one LSTM timestep — used by ForwardPass and BackwardPass */
export function computeStep(h_prev: number[], C_prev: number[], x: number[]) {
  const { W_f, b_f, W_i, b_i, W_C, b_C, W_o, b_o } = WEIGHTS;
  const concat = [h_prev[0], h_prev[1], x[0], x[1]];

  const f_raw = addVec(matVec2x4(W_f, concat), b_f);
  const f = [sigmoid(f_raw[0]), sigmoid(f_raw[1])];

  const i_raw = addVec(matVec2x4(W_i, concat), b_i);
  const i_gate = [sigmoid(i_raw[0]), sigmoid(i_raw[1])];

  const C_raw = addVec(matVec2x4(W_C, concat), b_C);
  const C_tilde = [tanhFn(C_raw[0]), tanhFn(C_raw[1])];

  const C = addVec(mulVec(f, C_prev), mulVec(i_gate, C_tilde));

  const o_raw = addVec(matVec2x4(W_o, concat), b_o);
  const o = [sigmoid(o_raw[0]), sigmoid(o_raw[1])];

  const tanhC = [Math.tanh(C[0]), Math.tanh(C[1])];
  const h = mulVec(o, tanhC);

  return { concat, f_raw, f, i_raw, i_gate, C_raw, C_tilde, C, o_raw, o, tanhC, h };
}
