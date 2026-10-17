import { useEffect, useRef, useState } from 'react';

const EVENTS = [
  { year: '1997', title: 'LSTM Invented', desc: 'Hochreiter & Schmidhuber publish the original paper solving the long-term dependency problem.', color: '#f59e0b' },
  { year: '2000', title: 'Peephole Connections', desc: 'Gers adds direct connections from cell to gates, improving timing tasks.', color: '#a855f7' },
  { year: '2009', title: 'Speech Breakthrough', desc: 'LSTMs win connected handwriting and speech recognition competitions.', color: '#22c55e' },
  { year: '2014', title: 'GRU Proposed', desc: 'Cho et al. simplify LSTM into a 2-gate variant — faster, nearly as good.', color: '#3b82f6' },
  { year: '2015', title: "Olah's Blog Post", desc: 'Christopher Olah publishes the canonical visual explanation, cited 3000+ times.', color: '#ef4444' },
  { year: '2015', title: 'Search Space Odyssey', desc: 'Greff et al. benchmark 8000+ LSTM variants. Vanilla LSTM wins.', color: '#06b6d4' },
  { year: '2017', title: 'Transformers Arrive', desc: '"Attention Is All You Need" — but LSTMs remain crucial for many tasks.', color: '#f59e0b' },
  { year: '2024', title: 'xLSTM', desc: 'Hochreiter returns with exponential gating and new memory cells.', color: '#a855f7' },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = containerRef.current?.querySelectorAll('[data-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="section-1" className="section-fade py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-amber-400">A Brief History</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From a 1997 paper to powering Google Translate — three decades of memory research.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {EVENTS.map((event, i) => (
              <div
                key={i}
                data-index={i}
                className={`flex flex-col md:flex-row items-center gap-4 transition-all duration-700 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } ${visibleCards.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="card-hover inline-block p-6 rounded-xl bg-slate-800/50 border border-slate-700 max-w-md">
                    <div className="font-mono text-sm font-bold mb-1" style={{ color: event.color }}>
                      {event.year}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-slate-400 text-sm">{event.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-slate-600 bg-slate-900 transition-all duration-500"
                    style={{
                      borderColor: visibleCards.has(i) ? event.color : undefined,
                      background: visibleCards.has(i) ? event.color : undefined,
                      boxShadow: visibleCards.has(i) ? `0 0 12px ${event.color}40` : 'none',
                    }}
                  />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
