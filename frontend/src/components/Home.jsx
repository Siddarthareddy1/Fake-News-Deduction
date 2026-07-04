import React, { useEffect, useState } from 'react';
import { DashboardIcon, GraphIcon, RobustnessIcon } from './Icons';

export default function Home({ onNavigate }) {
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <div className="badge-wrapper">
            <span className="hero-badge">NEGT Model v1.2</span>
          </div>
          <h1 className="hero-title">
            Analyze Fake News with <span className="gradient-text">Noise-Filtered AI</span>
          </h1>
          <p className="hero-description">
            A trustworthy, data-driven platform designed to verify information authenticity. 
            Visualize propagation networks, filter task-irrelevant user noise, and leverage deep 
            structural graph transformers to detect deceptive patterns with explainable metrics.
          </p>
          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
              Analyze News Now
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('dashboard', { loadDemo: true })}>
              View Demo Cascade
            </button>
          </div>
        </div>
        
        {/* Animated Propagation Graph SVG Hero Image */}
        <div className="hero-visual">
          <div className="visual-canvas-card">
            <svg viewBox="0 0 400 300" width="100%" height="100%" className="hero-svg">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Background glows */}
              <circle cx="200" cy="150" r="100" fill="url(#glow)" />
              
              {/* Edges with animations */}
              <line x1="200" y1="50" x2="100" y2="120" stroke="var(--border-muted)" strokeWidth="2" />
              <line x1="200" y1="50" x2="200" y2="120" stroke="var(--border-muted)" strokeWidth="2" />
              <line x1="200" y1="50" x2="300" y2="120" stroke="var(--border-muted)" strokeWidth="2" />
              
              <line x1="100" y1="120" x2="60" y2="200" stroke={activePulse >= 1 ? "var(--accent-secondary)" : "var(--border-muted)"} strokeWidth={activePulse >= 1 ? "3" : "1.5"} className="transition-all" />
              <line x1="100" y1="120" x2="140" y2="200" stroke={activePulse >= 1 ? "var(--accent-secondary)" : "var(--border-muted)"} strokeWidth={activePulse >= 1 ? "3" : "1.5"} className="transition-all" />
              <line x1="200" y1="120" x2="200" y2="200" stroke={activePulse >= 1 ? "var(--accent-coral)" : "var(--border-muted)"} strokeWidth="1.5" strokeDasharray="3,3" style={{ opacity: 0.6 }} />
              <line x1="300" y1="120" x2="260" y2="200" stroke={activePulse >= 1 ? "var(--accent-secondary)" : "var(--border-muted)"} strokeWidth={activePulse >= 1 ? "3" : "1.5"} className="transition-all" />
              <line x1="300" y1="120" x2="340" y2="200" stroke={activePulse >= 1 ? "var(--accent-secondary)" : "var(--border-muted)"} strokeWidth={activePulse >= 1 ? "3" : "1.5"} className="transition-all" />

              {/* Hops 3 */}
              <line x1="60" y1="200" x2="40" y2="260" stroke="var(--border-muted)" strokeWidth="1" />
              <line x1="60" y1="200" x2="80" y2="260" stroke="var(--border-muted)" strokeWidth="1" />
              <line x1="260" y1="200" x2="250" y2="260" stroke="var(--border-muted)" strokeWidth="1" />
              <line x1="340" y1="200" x2="350" y2="260" stroke="var(--border-muted)" strokeWidth="1" />

              {/* Source Node */}
              <g className="hero-node-group">
                <circle cx="200" cy="50" r="16" fill="var(--bg-secondary)" stroke="var(--accent-primary)" strokeWidth="4" />
                <circle cx="200" cy="50" r="24" fill="none" stroke="var(--accent-primary)" strokeWidth="1" className="hero-pulse" />
                <text x="200" y="55" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">NEWS</text>
              </g>

              {/* Depth 1 Nodes */}
              <circle cx="100" cy="120" r="10" fill="var(--accent-secondary)" />
              <circle cx="200" cy="120" r="10" fill="var(--accent-coral)" style={{ opacity: activePulse >= 2 ? 0.3 : 1 }} />
              <circle cx="300" cy="120" r="10" fill="var(--accent-secondary)" />
              
              {/* Depth 2 Nodes */}
              <circle cx="60" cy="200" r="8" fill="var(--accent-secondary)" className={activePulse === 2 ? "scale-node" : ""} />
              <circle cx="140" cy="200" r="8" fill="var(--accent-secondary)" className={activePulse === 2 ? "scale-node" : ""} />
              <circle cx="200" cy="200" r="8" fill="var(--color-fake)" style={{ opacity: activePulse >= 2 ? 0.2 : 0.8 }} /> {/* Bot node pruned */}
              <circle cx="260" cy="200" r="8" fill="var(--accent-secondary)" className={activePulse === 2 ? "scale-node" : ""} />
              <circle cx="340" cy="200" r="8" fill="var(--accent-secondary)" className={activePulse === 2 ? "scale-node" : ""} />

              {/* Depth 3 Nodes */}
              <circle cx="40" cy="260" r="5" fill="var(--text-muted)" />
              <circle cx="80" cy="260" r="5" fill="var(--text-muted)" />
              <circle cx="250" cy="260" r="5" fill="var(--text-muted)" />
              <circle cx="350" cy="260" r="5" fill="var(--text-muted)" />

              {/* Labels for graph structure */}
              <text x="200" y="290" fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                Information Bottleneck (IB) Filtering active bot nodes (red)
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <h2 className="section-title text-center">Core Pillars of NEGT</h2>
        <p className="section-desc text-center max-w-xl mx-auto mb-10">
          How our Noise-Filtering Enhanced Graph Transformer leverages graph machine learning 
          to identify fake news propagation cascades.
        </p>
        
        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card glass-panel border-teal">
            <div className="feature-icon-wrapper teal">
              <GraphIcon className="w-8 h-8 text-teal" />
            </div>
            <h3>📊 Propagation Analysis</h3>
            <p>
              Tracks and models news engagement timelines, mapping the cascade depth and peer-to-peer 
              retweeting pathways to identify patterns unique to fake claims.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card glass-panel border-coral">
            <div className="feature-icon-wrapper coral">
              <RobustnessIcon className="w-8 h-8 text-coral" />
            </div>
            <h3>🛡️ AI Denoising Filter</h3>
            <p>
              Utilizes a Graph Information Bottleneck (GIB) mechanism to filter out noisy, bot-like, 
              or clickbait connections, ensuring the classification models focus strictly on authentic flows.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card glass-panel border-green">
            <div className="feature-icon-wrapper green">
              <DashboardIcon className="w-8 h-8 text-green" />
            </div>
            <h3>📈 Credibility Metrics</h3>
            <p>
              Delivers detailed explainability with confidence badges, source trust ratios, 
              bot-likelihood analysis, and interactive heatmaps showing node importance.
            </p>
          </div>
        </div>
      </section>
      
      {/* Overview stats panel */}
      <section className="overview-stats-banner glass-panel">
        <div className="overview-stat-item">
          <span className="overview-stat-num">93.7%</span>
          <span className="overview-stat-label">PolitiFact Accuracy</span>
        </div>
        <div className="overview-divider"></div>
        <div className="overview-stat-item">
          <span className="overview-stat-num">98.4%</span>
          <span className="overview-stat-label">GossipCop Accuracy</span>
        </div>
        <div className="overview-divider"></div>
        <div className="overview-stat-item">
          <span className="overview-stat-num">&lt; 2.5s</span>
          <span className="overview-stat-label">Average Analysis Time</span>
        </div>
        <div className="overview-divider"></div>
        <div className="overview-stat-item">
          <span className="overview-stat-num">Highly Robust</span>
          <span className="overview-stat-label">Against Perturbation Noise</span>
        </div>
      </section>
    </div>
  );
}
