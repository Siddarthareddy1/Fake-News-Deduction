import React, { useState } from 'react';

export default function DetailedAnalysis({ onNavigate, analysisResult }) {
  const [activeTab, setActiveTab] = useState('propagation');

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

      {/* SECTION B: Multi-Tab Results */}
      <div className="tabbed-results-panel glass-panel">
        {/* Tab Headers */}
        <div className="tab-headers-row">
          <button 
            className={`tab-btn ${activeTab === 'propagation' ? 'active' : ''}`}
            onClick={() => setActiveTab('propagation')}
          >
            📊 Propagation Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'noise' ? 'active' : ''}`}
            onClick={() => setActiveTab('noise')}
          >
            🔍 Noise Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attribution' ? 'active' : ''}`}
            onClick={() => setActiveTab('attribution')}
          >
            🎯 Feature Attribution
          </button>
          <button 
            className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            📋 Detailed Metrics
          </button>
        </div>

        {/* Tab Body */}
        <div className="tab-content-body">
          
          {/* TAB 1: Propagation Analytics */}
          {activeTab === 'propagation' && (
            <div className="tab-pane propagation-pane animate-fade-in">
              <div className="charts-grid-layout">
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
                        // Viral spike pattern
                        <path d="M 40 170 Q 70 80, 100 30 T 150 90 T 250 140 T 380 160 L 380 170 Z" fill="rgba(216, 90, 48, 0.15)" />
                      ) : (
                        // Organic steady growth pattern
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
                          stroke="var(--accent-secondary)" 
                          strokeWidth="3.5" 
                        />
                      )}
                      
                      {/* Critical Nodes circles on line */}
                      {isFake ? (
                        <circle cx="100" cy="30" r="5" fill="var(--accent-coral)" stroke="#0a0d14" strokeWidth="1.5" />
                      ) : (
                        <circle cx="280" cy="80" r="5" fill="var(--accent-secondary)" stroke="#0a0d14" strokeWidth="1.5" />
                      )}
                    </svg>
                  </div>
                  <p className="chart-footer-text">
                    {isFake ? "⚠️ Abnormal early velocity spike detected. Classic clickbait pattern." : "✓ Steady growth indicating organic peer sharing."}
                  </p>
                </div>

                {/* 2. Source Distribution Pie Chart */}
                <div className="chart-card-sub glass-panel">
                  <h4>Source Distribution (Pie Chart)</h4>
                  <p className="chart-subtitle">Category ratios of referencing domains</p>
                  <div className="pie-chart-wrapper">
                    <svg viewBox="0 0 120 120" className="donut-svg">
                      {/* Donut sectors */}
                      {/* Segment 1: Press (Teal) */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="45" 
                        fill="none" 
                        stroke="var(--accent-secondary)" 
                        strokeWidth="14" 
                        strokeDasharray={isFake ? "80 282" : "180 282"} 
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Social Media (Blue) */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="45" 
                        fill="none" 
                        stroke="var(--accent-primary)" 
                        strokeWidth="14" 
                        strokeDasharray={isFake ? "160 282" : "70 282"} 
                        strokeDashoffset={isFake ? "-80" : "-180"}
                      />
                      {/* Segment 3: Blogs/Unverified (Coral) */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="45" 
                        fill="none" 
                        stroke="var(--accent-coral)" 
                        strokeWidth="14" 
                        strokeDasharray={isFake ? "42 282" : "32 282"} 
                        strokeDashoffset={isFake ? "-240" : "-250"}
                      />
                      <circle cx="60" cy="60" r="30" fill="var(--bg-secondary)" />
                      <text x="60" y="65" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {isFake ? 'Fake' : 'Organic'}
                      </text>
                    </svg>
                    
                    <div className="pie-legend">
                      <div className="legend-row">
                        <span className="dot teal"></span>
                        <span className="lbl">Verified Press</span>
                        <span className="val">{isFake ? '28%' : '64%'}</span>
                      </div>
                      <div className="legend-row">
                        <span className="dot blue"></span>
                        <span className="lbl">Social Networks</span>
                        <span className="val">{isFake ? '57%' : '25%'}</span>
                      </div>
                      <div className="legend-row">
                        <span className="dot coral"></span>
                        <span className="lbl">Blogs / Other</span>
                        <span className="val">{isFake ? '15%' : '11%'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Sentiment Analysis Gauge */}
                <div className="chart-card-sub glass-panel">
                  <h4>User Sentiment Analysis (Gauge)</h4>
                  <p className="chart-subtitle">Aggregate emotional response distribution</p>
                  <div className="gauge-chart-container">
                    <svg viewBox="0 0 160 90" className="gauge-svg">
                      <defs>
                        <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--color-fake)" />
                          <stop offset="50%" stopColor="var(--color-uncertain)" />
                          <stop offset="100%" stopColor="var(--color-real)" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 20 80 A 60 60 0 0 1 140 80" 
                        fill="none" 
                        stroke="url(#gauge-grad)" 
                        strokeWidth="12" 
                        strokeLinecap="round" 
                      />
                      
                      {/* Pointer needle based on sentiment */}
                      {/* angle formula: 0 (Fake/Negative) to 180 (Real/Positive). Let's say fake is mostly negative (45deg), real is mostly positive (135deg) */}
                      <g transform={`rotate(${isFake ? 40 : isUncertain ? 90 : 145}, 80, 80)`}>
                        <line x1="80" y1="80" x2="80" y2="25" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx="80" cy="80" r="6" fill="#ffffff" />
                      </g>
                    </svg>
                    
                    <div className="gauge-labels">
                      <span className="lbl red">Angry / Hostile</span>
                      <span className="lbl orange">Skeptical</span>
                      <span className="lbl green">Trusting</span>
                    </div>
                  </div>
                  <p className="chart-footer-text text-center font-semibold">
                    Sentiment Verdict: <span className={isFake ? "color-fake" : "color-real"}>{isFake ? "Dominant outrage & bot clickbait response" : "Informative & authentic citation pattern"}</span>
                  </p>
                </div>

                {/* 4. Cascade Depth Summary */}
                <div className="chart-card-sub glass-panel flex-col-center">
                  <h4>Cascade Depth Summary</h4>
                  <p className="chart-subtitle">Tree topological metrics</p>
                  <div className="cascade-depth-visual">
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
                  <p className="chart-footer-text">
                    {isFake ? "⚠️ Extremely wide breadth indicates bot broadcast hubs." : "✓ Deep organic chaining indicates normal reader retweeting."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Noise Analysis */}
          {activeTab === 'noise' && (
            <div className="tab-pane noise-pane animate-fade-in">
              <div className="tab-panel-header">
                <h3>🔍 Information Bottleneck Denoising Analysis</h3>
                <p>NEGT isolates user accounts and propagation links that carry no news-verifying value.</p>
              </div>

              <div className="noise-metrics-grid">
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
          )}

          {/* TAB 3: Feature Attribution */}
          {activeTab === 'attribution' && (
            <div className="tab-pane attribution-pane animate-fade-in">
              <div className="tab-panel-header">
                <h3>🎯 Model Feature Attribution Breakdown</h3>
                <p>Weight contribution of different GNN structural signals toward the final verdict classification.</p>
              </div>

              <div className="attribution-bars-container">
                {/* Row 1 */}
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

                {/* Row 2 */}
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

                {/* Row 3 */}
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

                {/* Row 4 */}
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
          )}

          {/* TAB 4: Detailed Metrics */}
          {activeTab === 'metrics' && (
            <div className="tab-pane metrics-pane animate-fade-in">
              <div className="tab-panel-header">
                <h3>📋 Technical Performance Evaluation Metrics</h3>
                <p>Operational benchmark scores for model evaluation.</p>
              </div>

              <table className="technical-metrics-table">
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
          )}

        </div>
      </div>
    </div>
  );
}
