import React from 'react';

export default function ConfidenceBreakdown({ onNavigate, analysisResult }) {
  const score = analysisResult ? analysisResult.confidence : 92.4;
  const isFake = analysisResult ? analysisResult.verdict === 'FAKE' : false;
  const isUncertain = analysisResult ? analysisResult.verdict === 'UNCERTAIN' : false;

  // Determine color based on ranges
  const getColor = (val) => {
    if (val <= 30) return '#A32D2D'; // Red
    if (val <= 60) return '#BA7517'; // Amber
    if (val <= 85) return '#1D9E75'; // Teal / Green-Blue
    return '#097B40'; // Deep Green
  };

  const getVerdictext = () => {
    if (isFake) return 'FAKE NEWS';
    if (isUncertain) return 'UNCERTAIN';
    return 'REAL NEWS';
  };

  const color = getColor(score);

  // Circumference for stroke-dasharray (radius 40 => circum ~251.2)
  // For a semi-circle we use half-circumference ~125.6, or we can draw an arc using path.
  // Let's use a beautiful SVG circle with a stroke dash representing the confidence value!
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.15
  // We want a 3/4 circle gauge (starts at 135deg, ends at 45deg, length is 270deg).
  // Total gauge path length = 3/4 * circumference = 235.6
  // Offset to fill = (100 - score)/100 * 235.6
  const gaugeLength = circumference * 0.75;
  const strokeDashoffset = gaugeLength - (score / 100) * gaugeLength;

  const factors = isFake ? [
    { name: 'Source Credibility', value: -28, type: 'negative' },
    { name: 'Early Engagement Velocity', value: +14, type: 'neutral' },
    { name: 'Bot-like Accounts Density', value: -32, type: 'negative' },
    { name: 'Propagation Structure Anomaly', value: -18, type: 'negative' },
    { name: 'Content Linguistic Bias', value: -15, type: 'negative' }
  ] : [
    { name: 'Source Credibility', value: 23, type: 'positive' },
    { name: 'Engagement Pattern', value: 18, type: 'positive' },
    { name: 'Mixed User Sentiment', value: -4, type: 'negative' },
    { name: 'Propagation Depth', value: 12, type: 'positive' },
    { name: 'User Trustworthiness', value: 15, type: 'positive' },
    { name: 'Anomaly Detection Index', value: -3, type: 'negative' },
    { name: 'Content Authenticity Analysis', value: 21, type: 'positive' }
  ];

  return (
    <div className="confidence-breakdown-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-link" onClick={() => onNavigate('dashboard')}>Detect News</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Confidence Breakdown</span>
      </div>

      <div className="breakdown-grid-layout">
        {/* Left Side: Circular Gauge Card */}
        <div className="gauge-card glass-panel flex-col-center">
          <h3 className="section-title">Confidence Metric</h3>
          <p className="section-desc">Overall evaluated authenticity index</p>
          
          <div className="radial-gauge-wrapper">
            <svg viewBox="0 0 120 120" className="radial-gauge-svg">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#185FA5" />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              </defs>
              
              {/* Background Arc */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeDasharray={`${gaugeLength} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(135 60 60)"
              />
              
              {/* Foreground Progress Arc */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="10"
                strokeDasharray={`${gaugeLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(135 60 60)"
                className="gauge-fill-transition"
              />
              
              {/* Central text */}
              <text x="60" y="58" fill="#ffffff" fontSize="20" fontWeight="bold" textAnchor="middle">
                {score}%
              </text>
              <text x="60" y="78" fill={color} fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
                {getVerdictext()}
              </text>
            </svg>
          </div>

          <div className="risk-banner mt-6 w-full text-center">
            <span className="lbl text-muted uppercase text-xs tracking-wider block mb-1">Risk Category</span>
            <span className={`val text-lg font-bold ${isFake ? 'color-fake' : isUncertain ? 'color-uncertain' : 'color-real'}`}>
              {isFake ? 'HIGH RISK ⚠️' : isUncertain ? 'MODERATE RISK ⚡' : 'LOW RISK ✓'}
            </span>
          </div>
        </div>

        {/* Right Side: Contributing Factors list */}
        <div className="factors-card glass-panel">
          <h3 className="section-title">Confidence Factor Breakdown</h3>
          <p className="section-desc">Key positive &amp; negative influences affecting GNN prediction output</p>
          
          <div className="factors-list-wrapper mt-4">
            {factors.map((factor, idx) => {
              const isPositive = factor.value > 0;
              const formattedVal = isPositive ? `+${factor.value}%` : `${factor.value}%`;
              
              return (
                <div key={idx} className="factor-row-item">
                  <div className="factor-meta-info">
                    <span className={`factor-indicator-bullet ${factor.type}`}></span>
                    <span className="factor-name-label">{factor.name}</span>
                  </div>
                  <span className={`factor-impact-val ${isPositive ? 'positive' : 'negative'}`}>
                    {formattedVal}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="final-score-bar-box mt-6">
            <div className="flex-between text-xs mb-2">
              <span className="font-semibold text-secondary">Final Authenticity Output Score</span>
              <span className="font-bold text-white">{score}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${score}%`, backgroundColor: color }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
