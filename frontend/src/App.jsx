import React, { useState } from 'react';
import './App.css';

// Mock Cascades Data for Interactive Demo
const MOCK_CASCADES = [
  {
    id: 'PF-104',
    dataset: 'PolitiFact',
    title: "Trump claims 100% of Obama's Syrian refugees are ISIS-affiliated",
    label: 'FAKE',
    confidence: 96.8,
    summary: "A claim made on social media regarding Syrian refugees. GNN analysis reveals highly centralized retweeting behavior heavily dominated by bot networks.",
    stats: { nodes: 14, edges: 13, depth: 4, noiseRatio: '35%' },
    nodes: [
      { id: 0, label: 'Source News', type: 'source', x: 250, y: 50, depth: 0, desc: 'Original Tweet' },
      { id: 1, label: 'User @alpha', type: 'user', x: 120, y: 150, depth: 1, desc: 'Retweet' },
      { id: 2, label: 'User @beta', type: 'user', x: 250, y: 150, depth: 1, desc: 'Retweet' },
      { id: 3, label: 'User @gamma', type: 'user', x: 380, y: 150, depth: 1, desc: 'Retweet' },
      { id: 4, label: 'Bot @spam_1', type: 'bot', x: 50, y: 250, depth: 2, desc: 'Malicious Spam Node' },
      { id: 5, label: 'User @delta', type: 'user', x: 150, y: 250, depth: 2, desc: 'Retweet' },
      { id: 6, label: 'User @epsilon', type: 'user', x: 210, y: 250, depth: 2, desc: 'Retweet' },
      { id: 7, label: 'Bot @promo_bot', type: 'bot', x: 290, y: 250, depth: 2, desc: 'Spurious promo Link' },
      { id: 8, label: 'User @zeta', type: 'user', x: 350, y: 250, depth: 2, desc: 'Retweet' },
      { id: 9, label: 'Bot @bot_acc', type: 'bot', x: 450, y: 250, depth: 2, desc: 'Automated spammer' },
      { id: 10, label: 'User @theta', type: 'user', x: 120, y: 350, depth: 3, desc: 'Reply' },
      { id: 11, label: 'User @iota', type: 'user', x: 180, y: 350, depth: 3, desc: 'Reply' },
      { id: 12, label: 'User @kappa', type: 'user', x: 350, y: 350, depth: 3, desc: 'Reply' },
      { id: 13, label: 'User @lambda', type: 'user', x: 350, y: 430, depth: 4, desc: 'Reply' }
    ],
    edges: [
      { from: 0, to: 1, isNoisy: false },
      { from: 0, to: 2, isNoisy: false },
      { from: 0, to: 3, isNoisy: false },
      { from: 1, to: 4, isNoisy: true },
      { from: 1, to: 5, isNoisy: false },
      { from: 2, to: 6, isNoisy: false },
      { from: 2, to: 7, isNoisy: true },
      { from: 3, to: 8, isNoisy: false },
      { from: 3, to: 9, isNoisy: true },
      { from: 5, to: 10, isNoisy: false },
      { from: 5, to: 11, isNoisy: false },
      { from: 8, to: 12, isNoisy: false },
      { from: 12, to: 13, isNoisy: false }
    ]
  },
  {
    id: 'GC-512',
    dataset: 'GossipCop',
    title: "Brad Pitt and Angelina Jolie reuniting after private dinner in LA",
    label: 'FAKE',
    confidence: 94.2,
    summary: "An entertainment rumor. The propagation tree shows high density around bot clusters spreading clickbait links, with low authentic user-to-user engagement.",
    stats: { nodes: 10, edges: 9, depth: 3, noiseRatio: '20%' },
    nodes: [
      { id: 0, label: 'Source Post', type: 'source', x: 250, y: 60, depth: 0, desc: 'Original Article Link' },
      { id: 1, label: 'User @gossip1', type: 'user', x: 150, y: 160, depth: 1, desc: 'Retweet' },
      { id: 2, label: 'User @fanpage', type: 'user', x: 350, y: 160, depth: 1, desc: 'Retweet' },
      { id: 3, label: 'Bot @auto_buzz', type: 'bot', x: 80, y: 260, depth: 2, desc: 'Clickbait Spammer' },
      { id: 4, label: 'User @bPittFan', type: 'user', x: 160, y: 260, depth: 2, desc: 'Retweet' },
      { id: 5, label: 'User @jolieFam', type: 'user', x: 220, y: 260, depth: 2, desc: 'Retweet' },
      { id: 6, label: 'Bot @buzz_feed', type: 'bot', x: 300, y: 260, depth: 2, desc: 'Automated Bot Account' },
      { id: 7, label: 'User @stars', type: 'user', x: 380, y: 260, depth: 2, desc: 'Retweet' },
      { id: 8, label: 'User @cinema', type: 'user', x: 440, y: 260, depth: 2, desc: 'Retweet' },
      { id: 9, label: 'User @popcorn', type: 'user', x: 380, y: 350, depth: 3, desc: 'Reply' }
    ],
    edges: [
      { from: 0, to: 1, isNoisy: false },
      { from: 0, to: 2, isNoisy: false },
      { from: 1, to: 3, isNoisy: true },
      { from: 1, to: 4, isNoisy: false },
      { from: 1, to: 5, isNoisy: false },
      { from: 2, to: 6, isNoisy: true },
      { from: 2, to: 7, isNoisy: false },
      { from: 2, to: 8, isNoisy: false },
      { from: 7, to: 9, isNoisy: false }
    ]
  },
  {
    id: 'GC-208',
    dataset: 'GossipCop',
    title: "Taylor Swift announces surprise acoustic track during London show",
    label: 'REAL',
    confidence: 99.1,
    summary: "Authentic entertainment news. The tree shows a highly organic, deep structure with massive peer-to-peer engagement and zero detected bot-spammed clusters.",
    stats: { nodes: 12, edges: 11, depth: 4, noiseRatio: '0%' },
    nodes: [
      { id: 0, label: 'Swift News', type: 'source', x: 250, y: 50, depth: 0, desc: 'Original Concert Video' },
      { id: 1, label: 'User @swiftie13', type: 'user', x: 150, y: 150, depth: 1, desc: 'Retweet' },
      { id: 2, label: 'User @taylor_news', type: 'user', x: 350, y: 150, depth: 1, desc: 'Retweet' },
      { id: 3, label: 'User @folklore', type: 'user', x: 100, y: 250, depth: 2, desc: 'Retweet' },
      { id: 4, label: 'User @midnights', type: 'user', x: 180, y: 250, depth: 2, desc: 'Retweet' },
      { id: 5, label: 'User @reputation', type: 'user', x: 300, y: 250, depth: 2, desc: 'Retweet' },
      { id: 6, label: 'User @evermore', type: 'user', x: 400, y: 250, depth: 2, desc: 'Retweet' },
      { id: 7, label: 'User @lover_boy', type: 'user', x: 60, y: 350, depth: 3, desc: 'Reply' },
      { id: 8, label: 'User @fearless', type: 'user', x: 120, y: 350, depth: 3, desc: 'Reply' },
      { id: 9, label: 'User @cardigan', type: 'user', x: 300, y: 350, depth: 3, desc: 'Reply' },
      { id: 10, label: 'User @willow', type: 'user', x: 400, y: 350, depth: 3, desc: 'Reply' },
      { id: 11, label: 'User @champagne', type: 'user', x: 400, y: 430, depth: 4, desc: 'Reply' }
    ],
    edges: [
      { from: 0, to: 1, isNoisy: false },
      { from: 0, to: 2, isNoisy: false },
      { from: 1, to: 3, isNoisy: false },
      { from: 1, to: 4, isNoisy: false },
      { from: 2, to: 5, isNoisy: false },
      { from: 2, to: 6, isNoisy: false },
      { from: 3, to: 7, isNoisy: false },
      { from: 3, to: 8, isNoisy: false },
      { from: 5, to: 9, isNoisy: false },
      { from: 6, to: 10, isNoisy: false },
      { from: 10, to: 11, isNoisy: false }
    ]
  }
];

const BASELINE_MODELS = [
  { name: 'CSI (Content-only)', politifact: 73.4, gossipcop: 86.6, color: '#f87171' },
  { name: 'GCN (Message-passing)', politifact: 83.3, gossipcop: 95.7, color: '#fb923c' },
  { name: 'GAT (Graph Attention)', politifact: 89.5, gossipcop: 96.1, color: '#fbbf24' },
  { name: 'UPFD (User-preference)', politifact: 87.5, gossipcop: 96.5, color: '#38bdf8' },
  { name: 'ChatGLM2-6B (LLM)', politifact: 85.6, gossipcop: 89.2, color: '#a78bfa' },
  { name: 'NEGT (Our Model)', politifact: 93.7, gossipcop: 98.4, color: '#10b981' }
];

export default function App() {
  const [selectedCascade, setSelectedCascade] = useState(MOCK_CASCADES[0]);
  const [filterNoise, setFilterNoise] = useState(false);
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'eval' | 'architecture'
  const [noiseLevel, setNoiseLevel] = useState(0); // 0% to 60%
  const [hoverNode, setHoverNode] = useState(null);

  // Custom simulation for noise robustness
  const getRobustnessAccuracy = (modelName, noise) => {
    let base = 0;
    if (modelName === 'NEGT') base = selectedCascade.dataset === 'PolitiFact' ? 93.7 : 98.4;
    else if (modelName === 'UPFD') base = selectedCascade.dataset === 'PolitiFact' ? 87.5 : 96.5;
    else if (modelName === 'GCN') base = selectedCascade.dataset === 'PolitiFact' ? 83.3 : 95.7;
    else base = selectedCascade.dataset === 'PolitiFact' ? 80.0 : 90.0;

    // NEGT is robust and maintains accuracy; standard GNNs drop quickly
    const dropFactor = modelName === 'NEGT' ? 0.05 : modelName === 'UPFD' ? 0.22 : 0.35;
    return Math.max(70.0, base - (noise * dropFactor)).toFixed(1);
  };

  return (
    <div className="app-container">
      {/* Header Banner */}
      <header className="app-header glass-panel">
        <div className="header-logo">
          <div className="logo-icon"></div>
          <div>
            <h1>NEGT</h1>
            <p className="subtitle">Noise-Filtering Enhanced Graph Transformer</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className={activeTab === 'demo' ? 'active' : ''} onClick={() => setActiveTab('demo')}>Interactive Demo</button>
          <button className={activeTab === 'eval' ? 'active' : ''} onClick={() => setActiveTab('eval')}>Benchmark Results</button>
          <button className={activeTab === 'architecture' ? 'active' : ''} onClick={() => setActiveTab('architecture')}>Architecture Details</button>
        </nav>
      </header>

      {activeTab === 'demo' && (
        <div className="main-content demo-layout">
          {/* Sidebar */}
          <div className="sidebar glass-panel">
            <h3 className="section-title">Propagation Trees</h3>
            <p className="section-desc">Select a propagation graph from the FakeNewsNet benchmark dataset to visualize and analyze:</p>
            <div className="cascade-list">
              {MOCK_CASCADES.map((c) => (
                <button
                  key={c.id}
                  className={`cascade-item ${selectedCascade.id === c.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCascade(c);
                    setFilterNoise(false);
                  }}
                >
                  <div className="item-meta">
                    <span className="item-dataset">{c.dataset}</span>
                    <span className={`item-label ${c.label.toLowerCase()}`}>{c.label}</span>
                  </div>
                  <div className="item-title">{c.title}</div>
                  <div className="item-stats">
                    <span>{c.stats.nodes} Nodes</span>
                    <span>•</span>
                    <span>{c.stats.depth} Hops Depth</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="model-summary-panel">
              <h3 className="section-title">GNN Prediction</h3>
              <div className={`prediction-banner ${selectedCascade.label.toLowerCase()}`}>
                <div className="pred-label">{selectedCascade.label} NEWS</div>
                <div className="pred-confidence">Confidence: {selectedCascade.confidence}%</div>
              </div>
              <p className="summary-text">{selectedCascade.summary}</p>
            </div>
          </div>

          {/* Main Visualizer Area */}
          <div className="visualizer-container glass-panel">
            <div className="visualizer-header">
              <div>
                <h2>Visualizing Cascade: {selectedCascade.id}</h2>
                <p className="text-secondary">Twitter news propagation tree structure</p>
              </div>
              <div className="visualizer-controls">
                <div className="legend">
                  <span className="legend-item"><span className="dot source"></span> Source News</span>
                  <span className="legend-item"><span className="dot user"></span> Real User</span>
                  <span className="legend-item"><span className="dot bot"></span> Bot Spammer</span>
                </div>
                <button 
                  className={`btn-toggle-ib ${filterNoise ? 'active' : ''}`}
                  onClick={() => setFilterNoise(!filterNoise)}
                >
                  {filterNoise ? "Disable Noise-Filter" : "Apply Information Bottleneck (IB)"}
                </button>
              </div>
            </div>

            {/* Interactive Graph Canvas */}
            <div className="canvas-wrapper">
              <svg className="graph-svg" width="100%" height="480">
                {/* Defs for gradients/glowing effects */}
                <defs>
                  <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-real" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-fake" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Render Edges */}
                {selectedCascade.edges.map((edge, idx) => {
                  const fromNode = selectedCascade.nodes.find(n => n.id === edge.from);
                  const toNode = selectedCascade.nodes.find(n => n.id === edge.to);
                  const isPruned = filterNoise && edge.isNoisy;

                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={`graph-edge ${edge.isNoisy ? 'noisy' : ''} ${isPruned ? 'pruned' : ''}`}
                        strokeDasharray={edge.isNoisy ? "4,4" : "0"}
                      />
                      {edge.isNoisy && isPruned && (
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2 - 5}
                          className="pruned-label"
                          textAnchor="middle"
                        >
                          PRUNED
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {selectedCascade.nodes.map((node) => {
                  const isNodePruned = filterNoise && node.type === 'bot';
                  return (
                    <g 
                      key={node.id}
                      className={`node-group ${isNodePruned ? 'pruned-node' : ''}`}
                      onMouseEnter={() => setHoverNode(node)}
                      onMouseLeave={() => setHoverNode(null)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.type === 'source' ? 14 : 9}
                        className={`graph-node ${node.type}`}
                        filter={node.type === 'source' ? "url(#glow-indigo)" : ""}
                      />
                      {node.type === 'source' && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={18}
                          className="node-ring-pulse"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Overlay Info Card on Hover */}
              {hoverNode && (
                <div 
                  className="hover-card glass-panel"
                  style={{
                    position: 'absolute',
                    left: `${hoverNode.x + 15}px`,
                    top: `${hoverNode.y - 40}px`
                  }}
                >
                  <div className="hover-card-header">
                    <span className={`node-badge ${hoverNode.type}`}>{hoverNode.type.toUpperCase()}</span>
                    <h4>Node ID: {hoverNode.id}</h4>
                  </div>
                  <p className="node-label-text">{hoverNode.label}</p>
                  <p className="node-desc">{hoverNode.desc}</p>
                  <p className="node-depth">Depth: {hoverNode.depth} hops from source</p>
                </div>
              )}
            </div>

            {/* Tree Info Summary Bar */}
            <div className="visualizer-footer">
              <div className="stat-card">
                <span className="stat-label">Total Spreading Users</span>
                <span className="stat-val">{selectedCascade.stats.nodes}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Cascade Depth</span>
                <span className="stat-val">{selectedCascade.stats.depth} Hops</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Task-Irrelevant Noise</span>
                <span className="stat-val color-fake">{selectedCascade.stats.noiseRatio}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Information Bottleneck Mask</span>
                <span className="stat-val color-real">{filterNoise ? "ACTIVE" : "INACTIVE"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'eval' && (
        <div className="main-content evaluation-layout">
          {/* Baseline Comparisons */}
          <div className="glass-panel card-panel">
            <h2>Overall Classification Performance (RQ1)</h2>
            <p className="text-secondary">Accuracy comparisons on standard FakeNewsNet datasets (PolitiFact and GossipCop)</p>
            
            <div className="bar-charts-wrapper">
              <div className="dataset-chart">
                <h3>PolitiFact Dataset</h3>
                <div className="chart-bars">
                  {BASELINE_MODELS.map((model) => (
                    <div key={model.name} className="chart-row">
                      <span className="model-label">{model.name}</span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${model.politifact}%`, backgroundColor: model.color }}
                        >
                          <span className="bar-val">{model.politifact}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dataset-chart">
                <h3>GossipCop Dataset</h3>
                <div className="chart-bars">
                  {BASELINE_MODELS.map((model) => (
                    <div key={model.name} className="chart-row">
                      <span className="model-label">{model.name}</span>
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${model.gossipcop}%`, backgroundColor: model.color }}
                        >
                          <span className="bar-val">{model.gossipcop}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Robustness Stress-Tester */}
          <div className="glass-panel card-panel">
            <div className="stress-tester-header">
              <div>
                <h2>Adversarial Noise Robustness Stress Tester (RQ2)</h2>
                <p className="text-secondary">Simulate injecting Gaussian perturbations into user node representations</p>
              </div>
              <div className="slider-wrapper">
                <label>Noise Level: <strong>{noiseLevel}%</strong></label>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  step="10" 
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="stress-tester-results">
              <div className="tester-grid">
                {['NEGT (Our Model)', 'UPFD (Baseline GNN)', 'GCN (Shallow GNN)'].map((name) => {
                  const acc = getRobustnessAccuracy(name, noiseLevel);
                  const isBest = name.includes('NEGT');
                  return (
                    <div key={name} className={`tester-card ${isBest ? 'highlight' : ''}`}>
                      <h4>{name}</h4>
                      <div className="tester-metric">
                        <span className="metric-val">{acc}%</span>
                        <span className="metric-label">Accuracy</span>
                      </div>
                      <p className="desc-text">
                        {isBest 
                          ? "Noise-augmented GIB mask keeps high-relevance connections, maintaining stable accuracy."
                          : "Lacks structural denoising, leading to information leakage and accuracy deterioration."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="main-content architecture-layout">
          <div className="glass-panel card-panel">
            <h2>NEGT Model Architectural Contributions</h2>
            <div className="arch-sections">
              <div className="arch-card">
                <div className="arch-num">01</div>
                <h3>Noise-Augmented Information Bottleneck</h3>
                <p>
                  Guided by the Information Bottleneck (IB) principle, NEGT injects Gaussian noise to node features during training to contract representations, lowering the generalization error.
                </p>
                <div className="formula">
                  {"$$\\tilde{x}_i = \\lambda_i x_i + (1 - \\lambda_i)(x_i + n_i)$$"}
                </div>
                <p className="text-secondary text-small">
                  {"Where $\\lambda_i \\sim Bernoulli(1-\\eta)$ acts as a noise-injection mask, and $n_i \\sim N(0, \\sigma^2 I)$ is additive Gaussian noise."}
                </p>
              </div>

              <div className="arch-card">
                <div className="arch-num">02</div>
                <h3>Propagation-Aware Relative Positional Encoding</h3>
                <p>
                  Captures local tree details and global depths, mapping multi-scale connections that shallow GNNs miss.
                </p>
                <div className="formula">
                  {"$$p_{uv} = e^{\\frac{1}{d_{uv}}} \\cdot e^{-\\frac{d_u + d_v}{2}}$$"}
                </div>
                <p className="text-secondary text-small">
                  {"Combines the shortest path distance $d_{uv}$ (restricted to 2-hop neighborhoods) with root distances $d_u$ and $d_v$ to model topic divergence and decay."}
                </p>
              </div>

              <div className="arch-card">
                <div className="arch-num">03</div>
                <h3>Attention-Head Partitioning</h3>
                <p>
                  To leverage different structural biases, self-attention heads are divided into four distinct functional sets.
                </p>
                <div className="head-partition-viz">
                  <div className="head-box group-s">
                    <span className="head-title">Head 1 (G_s)</span>
                    <p>Noise-filtered subgraph mask</p>
                  </div>
                  <div className="head-box group-p">
                    <span className="head-title">Head 2 (G_p)</span>
                    <p>Propagation RPE mask</p>
                  </div>
                  <div className="head-box group-f">
                    <span className="head-title">Head 3 (G_f)</span>
                    <p>Fully-connected</p>
                  </div>
                  <div className="head-box group-f">
                    <span className="head-title">Head 4 (G_f)</span>
                    <p>Fully-connected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
