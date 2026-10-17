# LSTM Deep Dive

An interactive visual explainer and exhaustive numerical walkthrough of Long Short-Term Memory networks.

Most resources give you either pretty flow diagrams or raw formulas with the intermediate steps hand-waved away. This project brings both worlds together into a single, cohesive experience:

1. **The Interactive Explorer** (`#/explore`) — Scroll-driven visual walkthrough featuring:
   - A step-by-step timeline of recurrent memory from 1997 to 2024 (Hochreiter, Cho, Greff, xLSTM).
   - Real-time gradient decay simulator demonstrating why vanilla RNNs forget while LSTMs preserve the signal.
   - Draggable conveyor belt and gate valves modeling long-term memory flow.
   - Interactive cell anatomy diagram with deconstructable parts and KaTeX math.
   - Gate-by-gate deep dive with live input sliders and sigmoid curves.
   - Step-by-step playground processing real input text token by token.
   - Comparative architecture breakdown (Vanilla, Peephole, GRU, BiLSTM, Stacked, xLSTM).

2. **The Numerical Walkthrough** (`#/blog`) — An end-to-end breakdown tracing every single number through an LSTM:
   - Explicit 2D toy dimensions, weight matrices, and biases with zero steps skipped.
   - Timestep-by-timestep forward pass with real matrix multiplications and activations.
   - Full Backpropagation Through Time (BPTT) with explicit gate gradients and cell state gradient flow.
   - Interactive sigmoid/tanh explorer and loss gradient analysis.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview build locally
npm run preview
```

## Project Structure

```
├── .github/workflows/deploy.yml   # Automatic GitHub Pages CI/CD
├── public/404.html                # SPA redirect handler for GitHub Pages
├── src/
│   ├── components/
│   │   ├── animation/             # Interactive explainer components
│   │   ├── blog/                  # Long-form numerical walkthrough components
│   │   └── Layout.tsx             # Shared navigation header
│   ├── pages/
│   │   ├── Landing.tsx            # Unified entry portal
│   │   ├── ExplorePage.tsx        # Visual animations route
│   │   └── BlogPage.tsx           # Technical numerical blog route
│   ├── utils/
│   │   └── math.tsx               # Shared KaTeX renderers and LSTM forward math
│   ├── App.tsx                    # Route definitions (HashRouter)
│   ├── main.tsx                   # React root mounting
│   └── index.css                  # Tailwind + scoped dark/light theme systems
├── index.html
├── vite.config.js
└── package.json
```

## GitHub Pages Deployment

The included GitHub Actions workflow automatically builds and publishes to GitHub Pages whenever changes land on `main` or `master`. Because the app uses `HashRouter` and a relative Vite base path, routing works immediately without server-side rewrite rules.

---

## Author & License

Created and maintained by **Muhammad Aqeel** ([@MAqeel151214](https://github.com/MAqeel151214)).

This project is open-source and released under the [MIT License](LICENSE).

