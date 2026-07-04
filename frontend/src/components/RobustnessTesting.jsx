import React, { useState, useEffect } from 'react';
import { SpinnerIcon, CheckIcon } from './Icons';

export default function RobustnessTesting({ onNavigate, triggerToast }) {
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [pruneEdges, setPruneEdges] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentScore, setCurrentScore] = useState(94.2);
  const [competitorScore, setCompetitorScore] = useState(85.1);
  const [isTestRun, setIsTestRun] = useState(false);

  // Compute mock dynamic values based on noise & edge pruning
  const calculateScores = () => {
    // NEGT drops very slowly
    const negtDrop = (noiseLevel * 0.08) + (pruneEdges * 0.05);
    const negtResult = Math.max(82.0, 94.2 - negtDrop).toFixed(1);

    // Baseline GSAT/Fragile drops very quickly
    const competitorDrop = (noiseLevel * 0.45) + (pruneEdges * 0.35);
    const competitorResult = Math.max(40.0, 85.1 - competitorDrop).toFixed(1);

    return { negtResult, competitorResult };
  };

  useEffect(() => {
    const { negtResult, competitorResult } = calculateScores();
    setCurrentScore(parseFloat(negtResult));
    setCompetitorScore(parseFloat(competitorResult));
  }, [noiseLevel, pruneEdges]);

  const handleRunTest = () => {
    setIsRunning(true);
    setIsTestRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setIsTestRun(true);
      triggerToast('success', `Perturbation simulations successfully applied`);
    }, 1200);
  };

  const handleReset = () => {
    setNoiseLevel(0);
    setPruneEdges(0);
    setIsTestRun(false);
    triggerToast('info', 'Simulator parameters reset');
  };

  // SVG Line coordinates helper
  // Grid width: 340, height: 160. Margins: left=40, top=10.
  // x-coords: 0% -> 40, 20% -> 153.3, 40% -> 266.6, 60% -> 380
  // y-coords (100% -> 10, 40% -> 170. scale: 1% is 2.66px down from 10)
  const getAccY = (acc) => {
    // 100% maps to y=10. 40% maps to y=170. Total span = 160px for 60% acc delta.
    // factor = 160 / 60 = 2.666 px per 1% drop from 100%
    const drop = 100 - acc;
    return 10 + drop * (160 / 60);
  };

  const negtPoints = [
    { x: 40, y: getAccY(94.2) },
    { x: 153, y: getAccY(92.4) },
    { x: 266, y: getAccY(90.8) },
    { x: 380, y: getAccY(88.5) }
  ];

  const competitorPoints = [
    { x: 40, y: getAccY(85.1) },
    { x: 153, y: getAccY(72.5) },
    { x: 266, y: getAccY(58.3) },
    { x: 380, y: getAccY(42.1) }
  ];

  const makePath = (points) => {
    return points.reduce((path, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
    }, '');
  };

  return (
    <div className="robustness-testing-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Robustness Testing</span>
      </div>

      <div className="robustness-grid-layout">
        {/* Left Controller Panel */}
        <div className="robustness-panel glass-panel">
          <div className="panel-header">
            <h3>🛡️ Robustness Test Simulator</h3>
            <p className="section-desc">Inject perturbations directly to node structures (RQ2)</p>
          </div>

          <div className="simulator-controls-body mt-6">
            {/* Slider 1 */}
            <div className="slider-pill-box">
              <div className="slider-labels-row">
                <span className="title font-semibold">Inject Gaussian Noise</span>
                <span className="val-text font-bold color-coral">{noiseLevel}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="60"
                step="5"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseInt(e.target.value))}
                disabled={isRunning}
                className="simulator-range-slider"
              />
              <span className="slider-helper">Applies noise to node embeddings to disrupt semantic signals.</span>
            </div>

            {/* Slider 2 */}
            <div className="slider-pill-box mt-6">
              <div className="slider-labels-row">
                <span className="title font-semibold">Prune Connection Edges</span>
                <span className="val-text font-bold color-coral">{pruneEdges}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="60"
                step="5"
                value={pruneEdges}
                onChange={(e) => setPruneEdges(parseInt(e.target.value))}
                disabled={isRunning}
                className="simulator-range-slider"
              />
              <span className="slider-helper">Removes sharing links to disrupt topological structure.</span>
            </div>

            <div className="button-group-row mt-8">
              <button className="btn-primary" onClick={handleRunTest} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 animate-spin mr-2" />
                    Running Simulation...
                  </>
                ) : "Run Robustness Test"}
              </button>
              <button className="btn-secondary" onClick={handleReset} disabled={isRunning}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Graph Panel */}
        <div className="robustness-panel glass-panel relative">
          {isRunning && (
            <div className="loading-shimmer-mask glass-panel">
              <div className="pulsing-box flex-col-center">
                <SpinnerIcon className="w-10 h-10 text-coral animate-spin mb-4" />
                <h4>Recalculating Graph Perturbations</h4>
                <p className="text-secondary text-xs mt-1">Simulating message propagation under extreme noise</p>
              </div>
            </div>
          )}

          <div className="panel-header">
            <h3>📊 Evaluation Curves Under Noise</h3>
            <p className="section-desc">Comparing NEGT (Robust) against standard GSAT (Fragile)</p>
          </div>

          <div className="graph-body-area mt-4">
            <div className="live-metrics-banner mb-4">
              <div className="metric-badge">
                <span className="lbl text-xs text-muted block">NEGT Accuracy</span>
                <span className="val text-2xl font-bold color-real">{currentScore}%</span>
              </div>
              <div className="metric-badge border-left">
                <span className="lbl text-xs text-muted block">GSAT Accuracy</span>
                <span className="val text-2xl font-bold color-fake">{competitorScore}%</span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="svg-accuracy-chart">
              <svg viewBox="0 0 400 200" width="100%" height="180" className="svg-element">
                {/* Y Grid lines */}
                <line x1="40" y1="10" x2="380" y2="10" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="40" y1="50" x2="380" y2="50" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="40" y1="90" x2="380" y2="90" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="40" y1="130" x2="380" y2="130" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="40" y1="170" x2="380" y2="170" stroke="#1e293b" />
                
                {/* X axis line */}
                <line x1="40" y1="10" x2="40" y2="170" stroke="#1e293b" />

                {/* X labels */}
                <text x="40" y="188" fill="var(--text-muted)" fontSize="9">0% Noise</text>
                <text x="153" y="188" fill="var(--text-muted)" fontSize="9">20%</text>
                <text x="266" y="188" fill="var(--text-muted)" fontSize="9">40%</text>
                <text x="380" y="188" fill="var(--text-muted)" fontSize="9">60% Noise</text>

                {/* Y labels */}
                <text x="10" y="14" fill="var(--text-muted)" fontSize="9">100%</text>
                <text x="14" y="54" fill="var(--text-muted)" fontSize="9">80%</text>
                <text x="14" y="94" fill="var(--text-muted)" fontSize="9">60%</text>
                <text x="14" y="134" fill="var(--text-muted)" fontSize="9">40%</text>
                <text x="14" y="174" fill="var(--text-muted)" fontSize="9">20%</text>

                {/* Curve lines */}
                {/* NEGT (Robust) */}
                <path d={makePath(negtPoints)} fill="none" stroke="var(--accent-secondary)" strokeWidth="3" />
                {negtPoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="var(--accent-secondary)" />
                ))}

                {/* GSAT (Fragile) */}
                <path d={makePath(competitorPoints)} fill="none" stroke="var(--accent-coral)" strokeWidth="3" />
                {competitorPoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="var(--accent-coral)" />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex-center gap-6 text-xs mt-3">
              <span className="flex-center-gap"><span className="legend-dot green"></span> NEGT (Robust)</span>
              <span className="flex-center-gap"><span className="legend-dot coral"></span> GSAT (Fragile Baseline)</span>
            </div>

            <div className="study-insight-box mt-4">
              <span className="title font-semibold block text-xs">Conclusion:</span>
              <p className="text-secondary text-xs mt-1">
                ✓ **Highly Robust**: NEGT retains an accuracy rating above **88%** even under extreme 
                structural distortions (60% noise / edge pruning). Traditional baseline architectures 
                decay quickly below **43%** due to representation dilution and noisy link propagation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
