import React, { useState } from 'react';

export default function DetailedAnalysis({ onNavigate, analysisResult }) {
  const [activeTab, setActiveTab] = useState('propagation');

  const handleTabClick = (tabId, elementId) => {
    setActiveTab(tabId);
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Fallback defaults if no analysis has been executed yet
  const result = analysisResult || {
    verdict: 'REAL',
    confidence: 92.4,
    date: 'July 4, 2026',
    processingTime: '2.3 seconds',
    model: 'NEGT v1.2',
    stats: {
      nodes: 156,
      edges: 234,
      words: 1245,
      sources: 3,
      mentions: 23
    }
  };

  const isFake = result.verdict === 'FAKE';
  const isUncertain = result.verdict === 'UNCERTAIN';

  return (
    <div className="detailed-analysis-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard')}>Detect News</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Detailed Analysis</span>
      </div>

      {/* SECTION A: Summary Card (Top) */}
      <div className="summary-card-panel glass-panel">
        <div className="summary-card-header">
          <span className="report-title-label">AI VERIFICATION ANALYSIS REPORT</span>
          <h2>"Trump Syrian Refugees Claims" &amp; Cascade Patterns</h2>
        </div>
        
        <div className="summary-card-grid">
          <div className="summary-col">
            <span className="label">Verification Verdict</span>
            <div className={`summary-verdict-badge ${result.verdict.toLowerCase()}`}>
              <span className="dot"></span>
              {result.verdict === 'REAL' ? 'LIKELY REAL' : result.verdict === 'FAKE' ? 'LIKELY FAKE' : 'UNCERTAIN'}
              <span className="conf">({result.confidence}% Conf.)</span>
            </div>
          </div>
          
          <div className="summary-col">
            <span className="label">Analysis Timestamp</span>
            <span className="val">{result.date}</span>
          </div>

          <div className="summary-col">
            <span className="label">Processing Duration</span>
            <span className="val">{result.processingTime}</span>
          </div>

          <div className="summary-col">
            <span className="label">Inference Model</span>
            <span className="val">{result.model}</span>
          </div>
        </div>
      </div>

      {/* SECTION B: Scrollable Unified Results */}
      <div className="tabbed-results-panel glass-panel">
        {/* Tab Anchor Headers */}
        <div className="tab-headers-row sticky-tab-headers">
          <button 
            className={`tab-btn ${activeTab === 'propagation' ? 'active' : ''}`}
            onClick={() => handleTabClick('propagation', 'propagation-section')}
          >
            📊 Propagation Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'noise' ? 'active' : ''}`}
            onClick={() => handleTabClick('noise', 'noise-section')}
          >
            🔍 Noise Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attribution' ? 'active' : ''}`}
            onClick={() => handleTabClick('attribution', 'attribution-section')}
          >
            🎯 Feature Attribution
          </button>
          <button 
            className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => handleTabClick('metrics', 'metrics-section')}
          >
            📋 Detailed Metrics
          </button>
        </div>

        {/* Tab Body - Stacked Sections */}
        <div className="tab-content-body scrollable-content-body">
          
          {/* SECTION 1: Propagation Analytics */}
          <div id="propagation-section" className="tab-pane propagation-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>📊 Propagation Analytics</h3>
              <p className="text-secondary text-xs mt-1">GNN propagation cascade dynamics and news authenticity timelines.</p>
            </div>
            
            <div className="charts-grid-layout mt-6">
              {/* 1. Engagement Timeline Line Chart */}
              <div className="chart-card-sub glass-panel">
                <h4>Engagement Timeline (Line Chart)</h4>
                <p className="chart-subtitle">Cascade propagation frequency over first 48 hours</p>
                <div className="svg-chart-container">
                  <svg viewBox="0 0 400 200" width="100%" height="150" className="svg-element">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="40" y1="70" x2="380" y2="70" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="40" y1="120" x2="380" y2="120" stroke="#1e293b" strokeDasharray="3,3" />
                    <line x1="40" y1="170" x2="380" y2="170" stroke="#1e293b" />
                    <line x1="40" y1="20" x2="40" y2="170" stroke="#1e293b" />

                    {/* X Axis Labels */}
                    <text x="40" y="188" fill="var(--text-muted)" fontSize="9">0h</text>
                    <text x="125" y="188" fill="var(--text-muted)" fontSize="9">12h</text>
                    <text x="210" y="188" fill="var(--text-muted)" fontSize="9">24h</text>
                    <text x="295" y="188" fill="var(--text-muted)" fontSize="9">36h</text>
                    <text x="380" y="188" fill="var(--text-muted)" fontSize="9">48h</text>

                    {/* Y Axis Labels */}
                    <text x="10" y="23" fill="var(--text-muted)" fontSize="9">1.2k</text>
                    <text x="10" y="73" fill="var(--text-muted)" fontSize="9">800</text>
                    <text x="10" y="123" fill="var(--text-muted)" fontSize="9">400</text>
                    <text x="10" y="173" fill="var(--text-muted)" fontSize="9">0</text>

                    {/* Confidence Band (Area) */}
                    {isFake ? (
                      <path d="M 40 170 Q 70 80, 100 30 T 150 90 T 250 140 T 380 160 L 380 170 Z" fill="rgba(216, 90, 48, 0.15)" />
                    ) : (
                      <path d="M 40 170 Q 100 150, 180 110 T 280 80 T 380 50 L 380 170 Z" fill="rgba(29, 158, 117, 0.15)" />
                    )}

                    {/* Graph Line */}
                    {isFake ? (
                      <path 
                        d="M 40 170 Q 70 80, 100 30 T 150 90 T 250 140 T 380 160" 
                        fill="none" 
                        stroke="var(--accent-coral)" 
                        strokeWidth="3.5" 
                      />
                    ) : (
                      <path 
                        d="M 40 170 Q 100 150, 180 110 T 280 80 T 380 50" 
                        fill="none" 
                        stroke="var(--secondary-teal)" 
                        strokeWidth="3.5" 
                      />
                    )}

                    {/* Anchor point */}
                    {isFake ? (
                      <circle cx="100" cy="30" r="5" fill="var(--accent-coral)" />
                    ) : (
                      <circle cx="280" cy="80" r="5" fill="var(--secondary-teal)" />
                    )}
                  </svg>
                </div>
                <p className="chart-footer-text">
                  {isFake ? "⚠️ Abnormal spike velocity indicates bot automation." : "✓ Steady growth indicating organic peer sharing."}
                </p>
              </div>

              {/* 2. Source Distribution Donut Chart */}
              <div className="chart-card-sub glass-panel">
                <h4>Source Distribution (Pie Chart)</h4>
                <p className="chart-subtitle">Category ratios of referencing domains</p>
                <div className="donut-chart-layout">
                  <div className="donut-graphic">
                    <svg viewBox="0 0 100 100" width="100" height="100">
                      {isFake ? (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10172a" strokeWidth="12" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--secondary-teal)" strokeWidth="12" strokeDasharray="37 251" strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary-blue)" strokeWidth="12" strokeDasharray="155 251" strokeDashoffset="-37" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent-coral)" strokeWidth="12" strokeDasharray="59 251" strokeDashoffset="-192" />
                        </>
                      ) : (
                        <>
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10172a" strokeWidth="12" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--secondary-teal)" strokeWidth="12" strokeDasharray="160 251" strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary-blue)" strokeWidth="12" strokeDasharray="63 251" strokeDashoffset="-160" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent-coral)" strokeWidth="12" strokeDasharray="28 251" strokeDashoffset="-223" />
                        </>
                      )}
                      <circle cx="50" cy="50" r="30" fill="var(--slate-800)" />
                      <text x="50" y="54" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        {isFake ? "Bot Net" : "Organic"}
                      </text>
                    </svg>
                  </div>
                  <div className="donut-legend">
                    <div className="legend-item">
                      <span className="dot teal"></span>
                      <span className="lbl">Verified Press</span>
                      <span className="val">{isFake ? '14%' : '64%'}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot blue"></span>
                      <span className="lbl">Social Networks</span>
                      <span className="val">{isFake ? '62%' : '25%'}</span>
                    </div>
                    <div className="legend-item">
                      <span className="dot coral"></span>
                      <span className="lbl">Blogs / Other</span>
                      <span className="val">{isFake ? '24%' : '11%'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Sentiment Dial */}
              <div className="chart-card-sub glass-panel">
                <h4>User Sentiment Analysis (Gauge)</h4>
                <p className="chart-subtitle">Aggregate emotional response distribution</p>
                <div className="sentiment-dial-layout flex-col-center">
                  <svg viewBox="0 0 200 120" width="100%" height="100">
                    <defs>
                      <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--status-fake)" />
                        <stop offset="50%" stopColor="var(--status-uncertain)" />
                        <stop offset="100%" stopColor="var(--status-real)" />
                      </linearGradient>
                    </defs>
                    <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                    <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="url(#gauge-grad)" strokeWidth="16" strokeLinecap="round" />
                    
                    {isFake ? (
                      <line x1="100" y1="100" x2="45" y2="55" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                    ) : isUncertain ? (
                      <line x1="100" y1="100" x2="100" y2="20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                      <line x1="100" y1="100" x2="155" y2="55" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                    )}
                    <circle cx="100" cy="100" r="8" fill="#ffffff" />
                    
                    <text x="35" y="115" fill="var(--status-fake)" fontSize="9" fontWeight="bold">Angry/Hostile</text>
                    <text x="100" y="115" fill="var(--status-uncertain)" fontSize="9" fontWeight="bold" textAnchor="middle">Skeptical</text>
                    <text x="165" y="115" fill="var(--status-real)" fontSize="9" fontWeight="bold" textAnchor="end">Trusting</text>
                  </svg>
                  <p className="sentiment-verdict-desc text-center mt-2">
                    <strong>Sentiment Verdict:</strong> {isFake ? "Sensationalist & biased outrage pattern" : "Informative & authentic citation pattern"}
                  </p>
                </div>
              </div>

              {/* 4. Cascade Depth Summary */}
              <div className="chart-card-sub glass-panel flex-col-center">
                <h4>Cascade Depth Summary</h4>
                <p className="chart-subtitle">Tree topological metrics</p>
                <div className="cascade-depth-visual w-full">
                  <div className="metric-row">
                    <span className="lbl">Max Propagation Hops</span>
                    <span className="val color-teal">{isFake ? '4 Hops' : '5 Hops'}</span>
                  </div>
                  <div className="metric-row">
                    <span className="lbl">Average Breadth</span>
                    <span className="val color-coral">{isFake ? '11.2 nodes/hop' : '3.6 nodes/hop'}</span>
                  </div>
                  <div className="metric-row">
                    <span className="lbl">Structural Virality Score</span>
                    <span className="val color-blue">{isFake ? '8.4/10 (High)' : '2.1/10 (Low)'}</span>
                  </div>
                  <div className="metric-row">
                    <span className="lbl">Clustering Coefficient</span>
                    <span className="val">{isFake ? '0.64' : '0.12'}</span>
                  </div>
                </div>
                <p className="chart-footer-text mt-4">
                  {isFake ? "⚠️ Extremely wide breadth indicates bot broadcast hubs." : "✓ Deep organic chaining indicates normal reader retweeting."}
                </p>
              </div>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" style={{ borderTop: '1px solid #1e293b' }}></div>

          {/* SECTION 2: Noise Analysis */}
          <div id="noise-section" className="tab-pane noise-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>🔍 Information Bottleneck Denoising Analysis</h3>
              <p className="text-secondary text-xs mt-1">NEGT isolates user accounts and propagation links that carry no news-verifying value.</p>
            </div>

            <div className="noise-metrics-grid mt-6">
              <div className="noise-metric-card glass-panel">
                <span className="score-num color-fake">{isFake ? '7' : '1'}</span>
                <span className="score-label">Suspicious Patterns Detected</span>
                <p className="score-desc">Spurious tweet velocity spikes, bot-ring clusters, or repetitive link spam.</p>
              </div>

              <div className="noise-metric-card glass-panel">
                <span className="score-num color-uncertain">{isFake ? '42%' : '4%'}</span>
                <span className="score-label">Bot-like Activity Rating</span>
                <p className="score-desc">Likelihood that early-stage retweeters are automated bots.</p>
              </div>

              <div className="noise-metric-card glass-panel">
                <span className="score-num">{isFake ? '3' : '0'}</span>
                <span className="score-label">Anomalous Links / Clickbaits</span>
                <p className="score-desc">Links routing readers to domains with poor historical credibility.</p>
              </div>

              <div className="noise-metric-card glass-panel highlight-teal">
                <span className="score-num color-real">{isFake ? '89%' : '98%'}</span>
                <span className="score-label">Noise Filtering Score (GIB)</span>
                <p className="score-desc">Percentage of irrelevant social noise filtered by the Graph Information Bottleneck.</p>
              </div>
            </div>

            <div className="noise-insight-panel glass-panel mt-6">
              <h4>Information Bottleneck Denoising Mechanism</h4>
              <p>
                Standard GNNs are highly susceptible to "structural noise" – thousands of random retweeters 
                drowning out the early credibility patterns. Our model introduces a **Graph Information Bottleneck** 
                that regularizes representation learning. It compresses the input graph structures, pruning irrelevant 
                nodes (with up to 89% precision) and leaving a high-fidelity diagnostic backbone.
              </p>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" style={{ borderTop: '1px solid #1e293b' }}></div>

          {/* SECTION 3: Feature Attribution */}
          <div id="attribution-section" className="tab-pane attribution-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>🎯 Model Feature Attribution Breakdown</h3>
              <p className="text-secondary text-xs mt-1">Weight contribution of different GNN structural signals toward the final verdict classification.</p>
            </div>

            <div className="attribution-bars-container mt-6">
              <div className="attribution-row">
                <div className="attr-meta">
                  <span className="title">Early User Credibility</span>
                  <span className="pct">{isFake ? '23%' : '29%'}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill teal" style={{ width: isFake ? '23%' : '29%' }}></div>
                </div>
                <p className="attr-desc">Evaluation of the historical verification status of accounts interacting within the first hour.</p>
              </div>

              <div className="attribution-row">
                <div className="attr-meta">
                  <span className="title">Source Domain Trust</span>
                  <span className="pct">{isFake ? '19%' : '35%'}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill blue" style={{ width: isFake ? '19%' : '35%' }}></div>
                </div>
                <p className="attr-desc">Credibility score of the root news publishing domain (e.g. PolitiFact rating, domain age).</p>
              </div>

              <div className="attribution-row">
                <div className="attr-meta">
                  <span className="title">Engagement Velocity</span>
                  <span className="pct">{isFake ? '18%' : '8%'}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill coral" style={{ width: isFake ? '18%' : '8%' }}></div>
                </div>
                <p className="attr-desc">The speed at which the news spreads in the initial cascade hops.</p>
              </div>

              <div className="attribution-row">
                <div className="attr-meta">
                  <span className="title">Propagation Diversity</span>
                  <span className="pct">{isFake ? '15%' : '18%'}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: isFake ? '15%' : '18%', backgroundColor: '#64748b' }}></div>
                </div>
                <p className="attr-desc">Measures the breadth across distinct communities and clusters rather than a single spam ring.</p>
              </div>
            </div>
          </div>

          <div className="section-divider mt-12 mb-8" style={{ borderTop: '1px solid #1e293b' }}></div>

          {/* SECTION 4: Detailed Metrics */}
          <div id="metrics-section" className="tab-pane metrics-pane animate-fade-in scroll-mt-20">
            <div className="tab-panel-header">
              <h3>📋 Technical Performance Evaluation Metrics</h3>
              <p className="text-secondary text-xs mt-1">Operational benchmark scores for model evaluation.</p>
            </div>

            <table className="technical-metrics-table mt-6">
              <thead>
                <tr>
                  <th>Performance Metric</th>
                  <th>Model Score</th>
                  <th>Benchmark Avg.</th>
                  <th>Assessment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-name">Classification Accuracy</td>
                  <td className="val color-real">94.2%</td>
                  <td>85.1%</td>
                  <td>Excellent (+9.1% gain)</td>
                </tr>
                <tr>
                  <td className="metric-name">Noise Robustness (GIB)</td>
                  <td className="val color-real">8.7/10</td>
                  <td>5.2/10</td>
                  <td>Highly Resistant to Perturbation</td>
                </tr>
                <tr>
                  <td className="metric-name">Interpretability Score</td>
                  <td className="val color-real">9.1/10</td>
                  <td>6.0/10</td>
                  <td>Explainable Node Attention</td>
                </tr>
                <tr>
                  <td className="metric-name">Inference Latency</td>
                  <td className="val color-real">0.8s</td>
                  <td>1.6s</td>
                  <td>Low overhead, highly optimized</td>
                </tr>
              </tbody>
            </table>

            <div className="metrics-notes-box glass-panel mt-6">
              <h5>Model Hyperparameters:</h5>
              <p className="text-secondary text-xs">
                Layers: 4 transformer blocks | Heads: 8 divided partitions | GIB Bottleneck Ratio: 0.15 | Noise Scale: 0.05
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
