import { useEffect } from 'react';
import Hero from '../components/animation/Hero.tsx';
import Timeline from '../components/animation/Timeline.tsx';
import GradientDecay from '../components/animation/GradientDecay.tsx';
import ConveyorBelt from '../components/animation/ConveyorBelt.tsx';
import LSTMCellDiagram from '../components/animation/LSTMCellDiagram.tsx';
import GateDeepDive from '../components/animation/GateDeepDive.tsx';
import Playground from '../components/animation/Playground.tsx';
import Variants from '../components/animation/Variants.tsx';
import Recap from '../components/animation/Recap.tsx';

export default function ExplorePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.section-fade').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="animation-theme min-h-screen bg-[#0a0e1a]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0' }}>
      {/* Navigation dots */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {[
          { id: 'section-0', label: 'Hero' },
          { id: 'section-1', label: 'History' },
          { id: 'section-2', label: 'Problem' },
          { id: 'section-3', label: 'Idea' },
          { id: 'section-4', label: 'Anatomy' },
          { id: 'section-5', label: 'Gates' },
          { id: 'section-6', label: 'Playground' },
          { id: 'section-7', label: 'Variants' },
          { id: 'section-8', label: 'Recap' },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="w-3 h-3 rounded-full bg-slate-600 hover:bg-blue-400 transition-all duration-300 hover:scale-125"
            title={item.label}
          />
        ))}
      </nav>

      <Hero />
      <Timeline />
      <GradientDecay />
      <ConveyorBelt />
      <LSTMCellDiagram />
      <GateDeepDive />
      <Playground />
      <Variants />
      <Recap />
    </div>
  );
}
