'use client';

import { useEffect, useRef, useState } from 'react';

export interface FlowStep {
  title: string;
  description: string;
  detail: string;
  signals: string[];
  output: string;
  visual: 'context' | 'agents' | 'thesis';
  highlights: string[];
}

interface StepFlowProps {
  steps: FlowStep[];
}

function VisualContext() {
  return (
    <div className="visual-card context">
      <div className="visual-header">
        <span className="visual-pill">Context Inputs</span>
        <span className="visual-muted">User signal capture</span>
      </div>
      <div className="visual-chip-row">
        <span>Watchlists</span>
        <span>Portfolio</span>
        <span>Goals</span>
        <span>Risk</span>
      </div>
      <div className="visual-stack">
        <div className="visual-sheet" />
        <div className="visual-sheet" />
        <div className="visual-sheet strong" />
      </div>
    </div>
  );
}

function VisualAgents() {
  return (
    <div className="visual-card agents">
      <div className="visual-header">
        <span className="visual-pill">Parallel Agents</span>
        <span className="visual-muted">Signal extraction</span>
      </div>
      <div className="visual-node-grid">
        {['Macro', 'Fundamentals', 'News', 'Price', 'Risk', 'Flow'].map((label) => (
          <div key={label} className="visual-node">
            {label}
          </div>
        ))}
      </div>
      <div className="visual-bridge">Synthesis layer normalizes evidence</div>
    </div>
  );
}

function VisualThesis() {
  return (
    <div className="visual-card thesis">
      <div className="visual-header">
        <span className="visual-pill">Thesis Output</span>
        <span className="visual-muted">Actionable insight</span>
      </div>
      <div className="visual-thesis">
        <div className="visual-thesis-title">NVDA Thesis</div>
        <div className="visual-thesis-line" />
        <div className="visual-thesis-line short" />
        <div className="visual-thesis-tags">
          <span>Bull</span>
          <span>86% Conf.</span>
          <span>3 Catalysts</span>
        </div>
      </div>
    </div>
  );
}

function StepIcon({ visual }: { visual: FlowStep['visual'] }) {
  if (visual === 'agents') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <circle cx="6" cy="7" r="2.5" fill="currentColor" />
        <circle cx="18" cy="7" r="2.5" fill="currentColor" />
        <circle cx="12" cy="17" r="2.5" fill="currentColor" />
        <path
          d="M7.8 8.7l3.6 5.1M16.2 8.7l-3.6 5.1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (visual === 'thesis') {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8.5 12.3l2.2 2.4 4.8-5.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
      <rect x="5" y="6" width="14" height="3" rx="1.5" fill="currentColor" />
      <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="5" y="15" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export default function StepFlow({ steps }: StepFlowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEngine, setShowEngine] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute('data-index') ?? 0);
          if (!Number.isNaN(index)) {
            setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.35, 0.7, 1] }
    );

    sectionRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [steps.length]);

  const renderVisual = (visual: FlowStep['visual']) => {
    if (visual === 'agents') return <VisualAgents />;
    if (visual === 'thesis') return <VisualThesis />;
    return <VisualContext />;
  };

  return (
    <section className="flow-section section-wrap" id="how-it-works">
      <div className="flow-header">
        <h2>How Thesis Works</h2>
        <button
          type="button"
          className="flow-toggle"
          onClick={() => setShowEngine((prev) => !prev)}
        >
          {showEngine ? 'Hide engine details' : 'See how the engine works'}
        </button>
      </div>
      <div className={`flow-grid ${showEngine ? 'engine' : 'compact'}`}>
        <aside className="flow-visuals" aria-hidden="true">
          <div className="flow-visuals-inner">
            {steps.map((step, index) => (
              <div key={step.title} className={`flow-visual ${activeIndex === index ? 'active' : ''}`}>
                {renderVisual(step.visual)}
              </div>
            ))}
          </div>
        </aside>
        <div className="flow-content">
          <div className="flow-progress">
            {steps.map((step, index) => (
              <div key={step.title} className="flow-progress-item">
                <span className={`flow-progress-dot ${activeIndex === index ? 'active' : ''}`} />
                <span className={`flow-progress-label ${activeIndex === index ? 'active' : ''}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 ? <span className="flow-progress-line" /> : null}
              </div>
            ))}
          </div>
          <p className="flow-hint">Swipe to explore each step</p>
          <div className="flow-panels">
            {steps.map((step, index) => (
              <div
                key={step.title}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
                data-index={index}
                className={`flow-panel ${activeIndex === index ? 'active' : ''}`}
              >
                <p className="flow-label">Step {index + 1}</p>
                <div className="flow-title">
                  <span className="flow-icon">
                    <StepIcon visual={step.visual} />
                  </span>
                  <h3>{step.title}</h3>
                </div>
                <div className="flow-panel-visual" aria-hidden="true">
                  {renderVisual(step.visual)}
                </div>
                <p>{step.description}</p>
                <details className="flow-details">
                  <summary>Learn more</summary>
                  <div className="flow-details-body">
                    <p>{step.detail}</p>
                    <div className="flow-meta">
                      <div className="flow-meta-title">Signal inputs</div>
                      <div className="flow-signal-row">
                        {step.signals.map((signal) => (
                          <span key={signal} className="flow-signal">
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flow-meta">
                      <div className="flow-meta-title">What Thesis does</div>
                      <ul className="flow-highlights">
                        {step.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flow-output">Output: {step.output}</div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
