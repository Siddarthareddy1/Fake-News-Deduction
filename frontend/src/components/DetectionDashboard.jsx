import React, { useState, useEffect } from 'react';
import { SpinnerIcon, CheckIcon, WarningIcon, AlertIcon, GraphIcon } from './Icons';

export default function DetectionDashboard({ 
  onNavigate, 
  analysisResult, 
  setAnalysisResult, 
  triggerToast,
  loadDemoPayload
}) {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [stats, setStats] = useState({ words: 0, sources: 0, mentions: 0 });
  const [sampleIndex, setSampleIndex] = useState(0);

  const steps = [
    "Fetching source URL & metadata...",
    "Extracting engagement propagation cascade...",
    "Applying GIB noise-filtering mask...",
    "Running Graph Transformer neural inference...",
    "Generating credibility verdict report..."
  ];

  // If a demo was requested from landing, load it automatically
  useEffect(() => {
    if (loadDemoPayload) {
      setInputText("http://politifact.com/article/syrian-refugee-claims-analysis-march-2026");
      setStats({ words: 1245, sources: 8, mentions: 34 });
    }
  }, [loadDemoPayload]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    
    // Simple dynamic stats calculations
    if (!text.trim()) {
      setStats({ words: 0, sources: 0, mentions: 0 });
      return;
    }
    const words = text.trim().split(/\s+/).length;
    const sources = Math.max(1, Math.min(10, Math.floor(words / 150)));
    const mentions = Math.max(0, Math.min(100, Math.floor(words / 40)));
    setStats({ words, sources, mentions });
  };

  const handleClear = () => {
    setInputText('');
    setStats({ words: 0, sources: 0, mentions: 0 });
    setAnalysisResult(null);
    triggerToast('info', 'Input cleared');
  };

  const SAMPLE_ARTICLES = [
    {
      text: "Trump claims 100% of Obama's Syrian refugees are ISIS-affiliated in surprise social media address",
      words: 1245,
      sources: 3,
      mentions: 23
    },
    {
      text: "Taylor Swift announces surprise acoustic track during London show, breaking stadium attendance records and sending fans into frenzy.",
      words: 850,
      sources: 6,
      mentions: 54
    },
    {
      text: "SHOCKING REPORT: Brad Pitt and Angelina Jolie reuniting after private dinner in LA!!! Insider reports conspiracy to hide relationship exposed!!!",
      words: 620,
      sources: 1,
      mentions: 89
    },
    {
      text: "A recent academic study published in Nature scientific reports demonstrates a breakthrough in quantum silicon computing qubits verified by Stanford research team.",
      words: 950,
      sources: 8,
      mentions: 12
    },
    {
      text: "URGENT SECURITY ALERT!!! Conspiracy: Massive data leak exposes all national bank passwords online! Transfer all funds immediately before midnight!!!",
      words: 510,
      sources: 2,
      mentions: 74
    },
    {
      text: "Official press release confirms US Treasury inflation index dropped to 2.1% in the latest quarter, citing strong consumer spending data.",
      words: 780,
      sources: 5,
      mentions: 18
    },
    {
      text: "Conspiracy theory: Secret Mars mission base discovered by independent bloggers, claiming NASA is hiding alien contact evidence.",
      words: 680,
      sources: 2,
      mentions: 43
    },
    {
      text: "Unbelievable tech leak: Shocking secret exposed! Tech CEO using secret bot armies to boost stock price by 500% overnight!!!",
      words: 490,
      sources: 1,
      mentions: 92
    }
  ];

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      triggerToast('error', 'Please enter article text or a news URL');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeStep(0);
    setAnalysisResult(null);

    // Dynamic steps simulation
    const runSteps = (idx) => {
      if (idx < steps.length) {
        setAnalyzeStep(idx);
        setTimeout(() => runSteps(idx + 1), 600);
      } else {
        setIsAnalyzing(false);
        
        // Advanced heuristic news checker
        const textLower = inputText.toLowerCase();
        let score = 50; // default middle
        const reasons = [];

        // Heuristic A: clickbait trigger words
        const clickbaitWords = ['shocking', 'conspiracy', 'exposed', 'secret', 'miracle', 'leak', 'insider', 'rumor', 'unbelievable', 'breakout', 'disaster', 'urgent', 'alert', 'wonder'];
        let clickbaitCount = 0;
        clickbaitWords.forEach(word => {
          if (textLower.includes(word)) clickbaitCount++;
        });
        if (clickbaitCount > 0) {
          score -= clickbaitCount * 8;
          reasons.push(`${clickbaitCount} sensationalist tags detected`);
        }

        // Heuristic B: excessive shouting (all capitals)
        const wordsList = inputText.trim().split(/\s+/);
        const shoutingWords = wordsList.filter(w => w.length > 3 && w === w.toUpperCase());
        if (shoutingWords.length / wordsList.length > 0.12) {
          score -= 15;
          reasons.push("Excessive capitalized words (sensationalist shouting)");
        }

        // Heuristic C: multiple exclamation marks
        const exclamations = (inputText.match(/!/g) || []).length;
        if (exclamations > 2) {
          score -= Math.min(15, exclamations * 4);
          reasons.push("High density of exclamation marks indicates emotional bias");
        }

        // Heuristic D: trustworthy citation vocabulary
        const citationWords = ['research', 'scientific', 'official', 'published', 'data', 'university', 'study', 'spokesperson', 'reuters', 'associated press', 'verified', 'nature', 'nasa', 'treasury'];
        let citationCount = 0;
        citationWords.forEach(word => {
          if (textLower.includes(word)) citationCount++;
        });
        if (citationCount > 0) {
          score += citationCount * 6;
          reasons.push(`Contains ${citationCount} professional citations`);
        }

        // Heuristic E: domain extensions
        if (textLower.includes('.gov') || textLower.includes('.edu') || textLower.includes('reuters.com') || textLower.includes('apnews.com')) {
          score += 20;
          reasons.push("Referenced highly credible source domains (.gov, .edu)");
        } else if (textLower.includes('.xyz') || textLower.includes('.cc') || textLower.includes('blogspot') || textLower.includes('forum')) {
          score -= 20;
          reasons.push("Contains suspicious link sources (.xyz, blogs)");
        }

        score = Math.max(8, Math.min(99, score));

        let finalVerdict = 'UNCERTAIN';
        let risk = 'MEDIUM';
        let keyFindings = [
          'Mixed engagement containing both real and suspicious accounts',
          'Origins tracing back to self-published blogging platforms',
          reasons.length > 0 ? reasons[0] : 'Contains conflicting linguistic signals'
        ];
        
        let sampleNodes = [
          { id: 0, type: 'source', x: 150, y: 30, label: 'Source' },
          { id: 1, type: 'user', x: 80, y: 90, label: 'User A' },
          { id: 2, type: 'bot', x: 220, y: 90, label: 'Bot B' }
        ];

        let sampleEdges = [
          { from: 0, to: 1, isNoisy: false },
          { from: 0, to: 2, isNoisy: true }
        ];

        if (score >= 65) {
          finalVerdict = 'REAL';
          risk = 'LOW';
          keyFindings = [
            'Sourced from highly trusted, domain-verified roots',
            'Organic peer-to-peer sharing network structure',
            reasons.length > 0 ? reasons[0] : 'Low linguistic emotional bias detected'
          ];
          sampleNodes = [
            { id: 0, type: 'source', x: 150, y: 30, label: 'Source' },
            { id: 1, type: 'user', x: 60, y: 90, label: 'User @verified' },
            { id: 2, type: 'user', x: 150, y: 90, label: 'User @regular' },
            { id: 3, type: 'user', x: 240, y: 90, label: 'User @news_feed' },
            { id: 4, type: 'user', x: 30, y: 150, label: 'Subuser A' },
            { id: 5, type: 'user', x: 90, y: 150, label: 'Subuser B' }
          ];
          sampleEdges = [
            { from: 0, to: 1, isNoisy: false },
            { from: 0, to: 2, isNoisy: false },
            { from: 0, to: 3, isNoisy: false },
            { from: 1, to: 4, isNoisy: false },
            { from: 1, to: 5, isNoisy: false }
          ];
        } else if (score <= 43) {
          finalVerdict = 'FAKE';
          risk = 'HIGH';
          keyFindings = [
            'Highly centralized propagation heavily dominated by bot nodes',
            'Artificial viral spikes detected in early-stage engagement',
            reasons.length > 0 ? reasons[0] : 'Sourced from unverified clickbait networks'
          ];
          sampleNodes = [
            { id: 0, type: 'source', x: 150, y: 30, label: 'Source' },
            { id: 1, type: 'bot', x: 60, y: 90, label: 'Bot @spam_acc' },
            { id: 2, type: 'user', x: 150, y: 90, label: 'User @unwitting' },
            { id: 3, type: 'bot', x: 240, y: 90, label: 'Bot @promo_link' },
            { id: 4, type: 'bot', x: 30, y: 150, label: 'Sub-spammer' }
          ];
          sampleEdges = [
            { from: 0, to: 1, isNoisy: true },
            { from: 0, to: 2, isNoisy: false },
            { from: 0, to: 3, isNoisy: true },
            { from: 1, to: 4, isNoisy: true }
          ];
        }

        setAnalysisResult({
          text: inputText,
          verdict: finalVerdict,
          confidence: score,
          risk,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          processingTime: '2.1s',
          model: 'NEGT v1.2',
          keyFindings,
          stats: {
            nodes: score <= 43 ? 156 : score >= 65 ? 180 : 86,
            edges: score <= 43 ? 234 : score >= 65 ? 312 : 94,
            words: stats.words,
            sources: stats.sources,
            mentions: stats.mentions
          },
          nodes: sampleNodes,
          edges: sampleEdges
        });

        triggerToast('success', 'Analysis complete');
      }
    };

    runSteps(0);
  };

  const loadDemoClick = () => {
    const sample = SAMPLE_ARTICLES[sampleIndex];
    setInputText(sample.text);
    setStats({ words: sample.words, sources: sample.sources, mentions: sample.mentions });
    setSampleIndex((prev) => (prev + 1) % SAMPLE_ARTICLES.length);
    triggerToast('info', `Loaded news sample #${sampleIndex + 1} of ${SAMPLE_ARTICLES.length}`);
  };

  return (
    <div className="dashboard-container">
      {/* Page Title & Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Detect News</span>
      </div>

      <div className="dashboard-grid-split">
        {/* Left Input Panel */}
        <div className="dashboard-panel input-panel glass-panel">
          <div className="panel-header">
            <h3>📰 Enter News Article</h3>
            <button className="btn-text" onClick={loadDemoClick}>Load Sample</button>
          </div>
          <div className="panel-body">
            <textarea
              className="text-input-field"
              placeholder="Paste the full article text, news headline, or article URL here to start GNN verification..."
              value={inputText}
              onChange={handleInputChange}
              disabled={isAnalyzing}
            />
            
            <div className="button-group-row">
              <button 
                className="btn-primary" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : "Analyze News Now"}
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleClear} 
                disabled={isAnalyzing}
              >
                Clear
              </button>
            </div>
            
            <div className="quick-stats-section">
              <h4>📊 Input Quick Stats</h4>
              <div className="quick-stats-grid">
                <div className="quick-stat-pill">
                  <span className="label">Word Count</span>
                  <span className="val">{stats.words}</span>
                </div>
                <div className="quick-stat-pill">
                  <span className="label">Sources Extracted</span>
                  <span className="val">{stats.sources}</span>
                </div>
                <div className="quick-stat-pill">
                  <span className="label">Social Mentions</span>
                  <span className="val">{stats.mentions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results Panel */}
        <div className="dashboard-panel results-panel glass-panel relative">
          {isAnalyzing && (
            <div className="loading-overlay glass-panel">
              <div className="loading-content">
                <SpinnerIcon className="w-12 h-12 text-teal animate-spin mb-4" />
                <h3 className="loading-title">Neural Denoising in Progress</h3>
                <div className="loading-steps-box">
                  {steps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`step-item ${idx < analyzeStep ? 'completed' : idx === analyzeStep ? 'active' : 'upcoming'}`}
                    >
                      <span className="step-bullet">{idx < analyzeStep ? '✓' : '•'}</span>
                      <span className="step-text">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="loading-est">Estimated remaining time: {Math.max(1, 3 - Math.floor(analyzeStep * 0.6))}s</p>
              </div>
            </div>
          )}

          {!isAnalyzing && !analysisResult && (
            <div className="empty-results-placeholder">
              <GraphIcon className="w-16 h-16 text-muted mb-4 opacity-50" />
              <h3>Awaiting News Input</h3>
              <p>
                Provide an article headline, text copy, or URL on the left panel 
                and select "Analyze News Now" to extract the propagation graph and compute predictions.
              </p>
            </div>
          )}

          {!isAnalyzing && analysisResult && (
            <div className="results-wrapper animate-fade-in">
              <div className="panel-header">
                <h3>🎯 DETECTION RESULTS</h3>
                <span className="processing-badge">NEGT Neural Model</span>
              </div>
              
              <div className="results-body">
                {/* Confidence Badge */}
                <div className="verdict-banner-row">
                  <div className={`verdict-badge-large ${analysisResult.verdict.toLowerCase()}`}>
                    <span className="verdict-txt">{analysisResult.verdict}</span>
                    <span className="verdict-divider">|</span>
                    <span className="verdict-conf">{analysisResult.confidence}% Confidence</span>
                  </div>
                  <div className="risk-level-badge">
                    <span className="risk-label">Risk Level</span>
                    <span className={`risk-val ${analysisResult.risk.toLowerCase()}`}>
                      {analysisResult.risk} {analysisResult.risk === 'LOW' ? '✓' : '⚠️'}
                    </span>
                  </div>
                </div>

                <div className="result-divider"></div>

                {/* 4 Key Evaluation Metrics Grid */}
                <div className="dashboard-metrics-grid mb-6">
                  <div className="pastel-metric-card nlp-card">
                    <span className="card-lbl">NLP Metric</span>
                    <span className="card-val">{analysisResult.verdict === 'FAKE' ? '32%' : analysisResult.verdict === 'UNCERTAIN' ? '58%' : '84%'}</span>
                    <p className="card-desc">Linguistic style & low emotional bias</p>
                  </div>
                  
                  <div className="pastel-metric-card gnn-card">
                    <span className="card-lbl">GNN Metric</span>
                    <span className="card-val">{analysisResult.verdict === 'FAKE' ? '24%' : analysisResult.verdict === 'UNCERTAIN' ? '52%' : '91%'}</span>
                    <p className="card-desc">Structural cascade organic validity</p>
                  </div>
                  
                  <div className="pastel-metric-card source-card">
                    <span className="card-lbl">Source Rep</span>
                    <span className="card-val">{analysisResult.verdict === 'FAKE' ? '18%' : analysisResult.verdict === 'UNCERTAIN' ? '60%' : '95%'}</span>
                    <p className="card-desc">Verified domain & source trust</p>
                  </div>
                  
                  <div className="pastel-metric-card spread-card">
                    <span className="card-lbl">Spread Rate</span>
                    <span className="card-val">{analysisResult.verdict === 'FAKE' ? '8.4x' : analysisResult.verdict === 'UNCERTAIN' ? '3.1x' : '1.2x'}</span>
                    <p className="card-desc">Propagation speed & bot density</p>
                  </div>
                </div>

                <div className="result-divider"></div>

                {/* mini propagation graph preview */}
                <div className="mini-graph-section">
                  <div className="mini-graph-header">
                    <h4>📈 Propagation Graph Preview</h4>
                    <span className="graph-stats-text">
                      Nodes: {analysisResult.stats.nodes} | Edges: {analysisResult.stats.edges}
                    </span>
                  </div>
                  
                  <div className="mini-graph-canvas">
                    <svg viewBox="0 0 300 150" className="w-full h-36">
                      {/* Edges */}
                      {analysisResult.edges.map((edge, idx) => {
                        const fromNode = analysisResult.nodes.find(n => n.id === edge.from);
                        const toNode = analysisResult.nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;
                        return (
                          <line
                            key={idx}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={edge.isNoisy ? "var(--color-fake)" : "var(--border-muted)"}
                            strokeWidth="1.5"
                            strokeDasharray={edge.isNoisy ? "3,3" : "0"}
                            opacity={edge.isNoisy ? 0.3 : 0.7}
                          />
                        );
                      })}
                      {/* Nodes */}
                      {analysisResult.nodes.map((node) => (
                        <circle
                          key={node.id}
                          cx={node.x}
                          cy={node.y}
                          r={node.type === 'source' ? 7 : 5}
                          fill={
                            node.type === 'source' ? 'var(--accent-primary)' :
                            node.type === 'bot' ? 'var(--color-fake)' :
                            'var(--accent-secondary)'
                          }
                          stroke="#0a0d14"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                    <div className="mini-graph-legend">
                      <span className="legend-dot blue"></span> Source
                      <span className="legend-dot green"></span> User
                      <span className="legend-dot red"></span> Bot Noise
                    </div>
                  </div>
                </div>

                <div className="result-divider"></div>

                {/* Key Findings */}
                <div className="findings-section">
                  <h4>💡 Key Findings</h4>
                  <ul className="findings-list">
                    {analysisResult.keyFindings.map((finding, idx) => (
                      <li key={idx} className="finding-item">
                        <span className="bullet">
                          {idx === 2 ? '⚠' : '✓'}
                        </span>
                        <span className="text">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="button-group-row justify-end mt-6">
                  <button className="btn-primary" onClick={() => onNavigate('detailed')}>
                    View Full Report
                  </button>
                  <button className="btn-secondary" onClick={() => onNavigate('export')}>
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
