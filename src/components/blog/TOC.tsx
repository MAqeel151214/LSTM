export default function TOC() {
  return (
    <div className="toc">
      <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>📋 What's in This Blog</h3>
      <nav>
        <a href="#intro">1. Why I Wrote This</a>
        <a href="#setup">2. The Setup: Our Tiny World</a>
        <a href="#activations">3. Quick Primer: Sigmoid and Tanh</a>
        <a href="#forward">4. Forward Pass — Timestep by Timestep</a>
        <a href="#backward">5. Backward Pass — Gradients Through Time</a>
        <a href="#insights">6. What Did We Learn?</a>
        <a href="#closing">7. Where to Go From Here</a>
      </nav>
      <p className="text-sm text-[#78716c] mt-4 mb-0">
        <strong>Prerequisites:</strong> Basic linear algebra (matrix multiplication), 
        calculus (chain rule), and a vague idea of what neural networks do. 
        If you've seen a sigmoid function before, you're good.
      </p>
    </div>
  );
}
