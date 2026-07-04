import React from 'react';

export default function AblationStudy({ onNavigate }) {
  const ablationData = [
    { name: 'NEGT (Full Model)', acc: '93.6%', prec: '0.945', rec: '0.928', f1: '0.936', rating: '⭐⭐⭐', highlight: true },
    { name: 'w/o Noise Augmentation', acc: '91.7%', prec: '0.912', rec: '0.901', f1: '0.906', rating: '⭐⭐', highlight: false },
    { name: 'w/o Propagation RPE', acc: '90.2%', prec: '0.894', rec: '0.887', f1: '0.890', rating: '⭐⭐', highlight: false },
    { name: 'w/o IB Filter', acc: '88.5%', prec: '0.871', rec: '0.863', f1: '0.867', rating: '⭐', highlight: false },
    { name: 'w/o Transformer Attention', acc: '87.3%', prec: '0.856', rec: '0.849', f1: '0.852', rating: '⭐', highlight: false },
    { name: 'BiGCN (Baseline GNN)', acc: '84.2%', prec: '0.823', rec: '0.812', f1: '0.817', rating: 'Baselines', highlight: false },
    { name: 'GraphGPS (Baseline GT)', acc: '85.1%', prec: '0.834', rec: '0.824', f1: '0.829', rating: 'Baselines', highlight: false }
  ];

  const moduleImprovements = [
    { name: 'Noise Augmentation', value: 2.8, color: 'var(--accent-coral)' },
    { name: 'Propagation Encoding', value: 2.0, color: 'var(--accent-secondary)' },
    { name: 'IB Filter', value: 1.7, color: 'var(--accent-primary)' },
    { name: 'Transformer Block', value: 1.2, color: 'var(--text-muted)' }
  ];

  return (
    <div className="ablation-study-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Ablation &amp; Model Comparison</span>
      </div>

      {/* Model Performance Comparison Grid */}
      <div className="ablation-grid-layout">
        {/* Table Panel */}
        <div className="study-panel glass-panel">
          <div className="panel-header">
            <h3>🔬 Model Performance Comparison</h3>
            <p className="section-desc">FakeNewsNet Benchmark Results under ablation variants (RQ3)</p>
          </div>
          
          <div className="table-responsive-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Model Variant</th>
                  <th>Accuracy</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                  <th>Assessment</th>
                </tr>
              </thead>
              <tbody>
                {ablationData.map((row, idx) => (
                  <tr key={idx} className={row.highlight ? 'highlight-row' : ''}>
                    <td className="model-name font-semibold">{row.name}</td>
                    <td className="val-text font-bold">{row.acc}</td>
                    <td>{row.prec}</td>
                    <td>{row.rec}</td>
                    <td className="val-text">{row.f1}</td>
                    <td className="rating-col">{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contribution Bar Chart Panel */}
        <div className="study-panel glass-panel">
          <div className="panel-header">
            <h3>📈 Module Contributions Breakdown</h3>
            <p className="section-desc">Incremental accuracy gains (%) from each architecture addition</p>
          </div>

          <div className="contribution-chart-body mt-6">
            {moduleImprovements.map((module, idx) => (
              <div key={idx} className="contribution-bar-row">
                <div className="bar-labels-row">
                  <span className="title font-semibold">{module.name}</span>
                  <span className="gain-val" style={{ color: module.color }}>+{module.value}% gain</span>
                </div>
                
                <div className="bar-track">
                  {/* Scale to max of 3.0% */}
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(module.value / 3.0) * 100}%`, 
                      backgroundColor: module.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="study-insight-box glass-panel mt-6">
            <h5>Ablation Study Summary</h5>
            <p className="text-secondary text-xs mt-1">
              The ablation studies highlight that the **Noise-Augmented Information Bottleneck** delivers the 
              single largest performance jump (+2.8% Accuracy). Adding propagation-aware relative position encodings 
              further enhances node connection context, helping our model outperform shallow GNN structures (BiGCN) 
              by a net **+9.4%** accuracy threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
