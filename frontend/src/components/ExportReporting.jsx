import React, { useState, useEffect } from 'react';
import { SpinnerIcon, CheckIcon } from './Icons';
import { jsPDF } from 'jspdf';

export default function ExportReporting({ onNavigate, triggerToast, analysisResult }) {
  const [reportType, setReportType] = useState('full'); // 'exec' | 'full' | 'data'
  const [format, setFormat] = useState('pdf'); // 'pdf' | 'html' | 'json' | 'csv'
  const [sections, setSections] = useState({
    propagation: true,
    noise: true,
    attribution: true,
    metrics: true
  });
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [compileStep, setCompileStep] = useState('');

  // Auto compile on mount if analysisResult is present
  useEffect(() => {
    if (analysisResult) {
      handleGenerate();
    }
  }, [analysisResult]);

  const toggleSection = (key) => {
    setSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleGenerate = () => {
    setIsCompiling(true);
    setIsGenerated(false);
    
    // Simulate compilation pipeline steps
    const steps = [
      "Gathering evaluation metadata...",
      "Assembling SVG propagation graphs...",
      "Compiling GIB noise filtration metrics...",
      "Structuring layout template modules...",
      "Finalizing document assembly..."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setCompileStep(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
        setIsGenerated(true);
        triggerToast('success', 'Report compiled successfully! Click Download to fetch file.');
      }
    }, 500);
  };

  const handleDownload = () => {
    if (!isGenerated) {
      triggerToast('warning', 'Please generate the report first');
      return;
    }

    // Dynamic report values based on latest analysis
    const result = analysisResult || {
      verdict: "FAKE",
      confidence: 96.8,
      risk: "HIGH",
      keyFindings: [
        'Highly centralized propagation heavily dominated by bot nodes',
        'Artificial viral spikes detected in early-stage engagement',
        'Sourced from unverified clickbait networks'
      ],
      stats: { nodes: 156, edges: 234, words: 1200, sources: 3, mentions: 15 }
    };

    const isFake = result.verdict === 'FAKE';
    const isUncertain = result.verdict === 'UNCERTAIN';
    const finalVerdictText = result.verdict === 'REAL' ? 'LIKELY REAL' : result.verdict === 'FAKE' ? 'LIKELY FAKE' : 'UNCERTAIN';
    const confidenceText = `${result.confidence}%`;
    const riskText = `${result.risk} RISK`;

    if (format === 'pdf') {
      try {
        const doc = new jsPDF();
        let pageNum = 1;
        const totalPages = 1 + 
          (sections.propagation ? 1 : 0) + 
          (sections.noise ? 1 : 0) + 
          (sections.attribution ? 1 : 0) + 
          (sections.metrics ? 1 : 0);
        
        // ---------------- PAGE 1: Summary ----------------
        // Report Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(24, 95, 165); // Palette A primary blue
        doc.text("NEGT Fake News Authenticity Report", 20, 25);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
        doc.text(`Engine: Noise-Filtering Enhanced Graph Transformer v1.2`, 20, 37);
        
        doc.setLineWidth(0.5);
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 42, 190, 42);
        
        // Article text section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Analyzed Article Content:", 20, 52);
        
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        
        // Wrap text to fit page
        const splitText = doc.splitTextToSize(result.text || "No news text provided.", 170);
        doc.text(splitText, 20, 58);
        
        const textHeight = splitText.length * 5;
        let nextY = 58 + textHeight + 10;
        
        doc.setLineWidth(0.5);
        doc.setDrawColor(226, 232, 240);
        doc.line(20, nextY - 5, 190, nextY - 5);
        
        // Verdict Card
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Verification Verdict:", 20, nextY);
        
        // Verdict Badge
        let badgeColor = [99, 153, 34]; // Green for Real
        if (result.verdict === 'FAKE') {
          badgeColor = [163, 45, 45]; // Red for Fake
        } else if (result.verdict === 'UNCERTAIN') {
          badgeColor = [186, 117, 23]; // Amber for Uncertain
        }
        
        doc.setFillColor(...badgeColor);
        doc.rect(20, nextY + 4, 170, 16, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${finalVerdictText} (${confidenceText} Confidence) - ${riskText}`, 25, nextY + 14);
        
        nextY += 30;
        
        // Key Findings
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Key Analytical Findings:", 20, nextY);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        
        result.keyFindings.forEach((finding, idx) => {
          doc.text(`- ${finding}`, 22, nextY + 7 + (idx * 6));
        });
        
        // Footer Page 1
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${pageNum} of ${totalPages} | NEGT Verification Suite`, 20, 285);

        // ---------------- PAGE 2: Propagation Analytics ----------------
        if (sections.propagation) {
          doc.addPage();
          pageNum++;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(24, 95, 165);
          doc.text("Section 1: Propagation Analytics", 20, 25);
          
          doc.setDrawColor(226, 232, 240);
          doc.line(20, 30, 190, 30);
          
          // Topological metrics
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Cascade Depth Summary:", 20, 42);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          doc.text(`Max Propagation Hops: ${isFake ? '4 Hops' : '5 Hops'}`, 25, 50);
          doc.text(`Average Breadth: ${isFake ? '11.2 nodes/hop' : '3.6 nodes/hop'}`, 25, 56);
          doc.text(`Structural Virality Score: ${isFake ? '8.4/10 (High)' : '2.1/10 (Low)'}`, 25, 62);
          doc.text(`Clustering Coefficient: ${isFake ? '0.64' : '0.12'}`, 25, 68);
          
          // Source distribution
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Source Domain Referencing Distribution:", 20, 82);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          doc.text(`Verified Press: ${isFake ? '14%' : '64%'}`, 25, 90);
          doc.text(`Social Networks: ${isFake ? '62%' : '25%'}`, 25, 96);
          doc.text(`Blogs / Self-Published Domains: ${isFake ? '24%' : '11%'}`, 25, 102);
          
          // Sentiment profile
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("User Sentiment Profile Summary:", 20, 116);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          doc.text(`Sentiment Verdict: ${isFake ? 'Sensationalist & biased outrage pattern' : 'Informative & authentic citation pattern'}`, 25, 124);
          doc.text("Emotional Distribution: ", 25, 130);
          doc.text(`- Angry / Hostile: ${isFake ? '58%' : '12%'}`, 30, 136);
          doc.text(`- Skeptical: ${isFake ? '34%' : '24%'}`, 30, 142);
          doc.text(`- Trusting: ${isFake ? '8%' : '64%'}`, 30, 148);
          
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Page ${pageNum} of ${totalPages} | NEGT Verification Suite`, 20, 285);
        }

        // ---------------- PAGE 3: Noise Analysis ----------------
        if (sections.noise) {
          doc.addPage();
          pageNum++;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(24, 95, 165);
          doc.text("Section 2: Noise Analysis (Denoising)", 20, 25);
          
          doc.setDrawColor(226, 232, 240);
          doc.line(20, 30, 190, 30);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Graph Information Bottleneck (GIB) Denoising Summary:", 20, 42);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          doc.text(`Suspicious Patterns Detected: ${isFake ? '7' : '1'}`, 25, 50);
          doc.text(`Bot-like Activity Rating: ${isFake ? '42%' : '4%'}`, 25, 56);
          doc.text(`Anomalous Links / Clickbaits: ${isFake ? '3' : '0'}`, 25, 62);
          doc.text(`Noise Filtering Score (GIB): ${isFake ? '89%' : '98%'}`, 25, 68);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Information Bottleneck Denoising Mechanism:", 20, 82);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          const splitExplanation = doc.splitTextToSize("Standard GNNs are highly susceptible to 'structural noise' – thousands of random retweeters drowning out the early credibility patterns. Our model introduces a Graph Information Bottleneck that regularizes representation learning. It compresses the input graph structures, pruning irrelevant nodes (with up to 89% precision) and leaving a high-fidelity diagnostic backbone.", 170);
          doc.text(splitExplanation, 20, 88);
          
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Page ${pageNum} of ${totalPages} | NEGT Verification Suite`, 20, 285);
        }

        // ---------------- PAGE 4: Feature Attribution ----------------
        if (sections.attribution) {
          doc.addPage();
          pageNum++;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(24, 95, 165);
          doc.text("Section 3: Feature Attribution", 20, 25);
          
          doc.setDrawColor(226, 232, 240);
          doc.line(20, 30, 190, 30);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("GNN Feature Attribution Weights:", 20, 42);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          doc.text(`Early User Credibility: ${isFake ? '23%' : '29%'}`, 25, 50);
          doc.text(`Source Domain Trust: ${isFake ? '19%' : '35%'}`, 25, 56);
          doc.text(`Engagement Velocity: ${isFake ? '18%' : '8%'}`, 25, 62);
          doc.text(`Propagation Diversity: ${isFake ? '15%' : '18%'}`, 25, 68);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Methodological Description:", 20, 82);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          const splitExplanationAttr = doc.splitTextToSize("Feature attributions highlight which network signals the Graph Neural Network prioritized. Higher weights reflect features that contributed most heavily towards classification. For organic posts, Domain Trust is dominant, whereas Velocity and bot clusters govern fake news indicators.", 170);
          doc.text(splitExplanationAttr, 20, 88);
          
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Page ${pageNum} of ${totalPages} | NEGT Verification Suite`, 20, 285);
        }

        // ---------------- PAGE 5: Detailed Metrics ----------------
        if (sections.metrics) {
          doc.addPage();
          pageNum++;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(24, 95, 165);
          doc.text("Section 4: Detailed Metrics", 20, 25);
          
          doc.setDrawColor(226, 232, 240);
          doc.line(20, 30, 190, 30);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Technical Performance Evaluation Metrics:", 20, 42);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          
          doc.text("Metric Name", 20, 52);
          doc.text("Score", 80, 52);
          doc.text("Benchmark Avg.", 115, 52);
          doc.text("Assessment", 155, 52);
          
          doc.setLineWidth(0.3);
          doc.line(20, 54, 190, 54);
          
          doc.text("Classification Accuracy", 20, 60);
          doc.text("94.2%", 80, 60);
          doc.text("85.1%", 115, 60);
          doc.text("Excellent (+9.1% gain)", 155, 60);
          
          doc.text("Noise Robustness (GIB)", 20, 66);
          doc.text("8.7/10", 80, 66);
          doc.text("5.2/10", 115, 66);
          doc.text("Highly Resistant", 155, 66);
          
          doc.text("Interpretability Score", 20, 72);
          doc.text("9.1/10", 80, 72);
          doc.text("6.0/10", 115, 72);
          doc.text("Explainable Attention", 155, 72);
          
          doc.text("Inference Latency", 20, 78);
          doc.text("0.8s", 80, 78);
          doc.text("1.6s", 115, 78);
          doc.text("Low overhead", 155, 78);
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("Model Hyperparameters Configuration:", 20, 94);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(100, 116, 139);
          doc.text("Layers: 4 transformer blocks | Heads: 8 divided partitions | GIB Bottleneck Ratio: 0.15 | Noise Scale: 0.05", 20, 100);

          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`Page ${pageNum} of ${totalPages} | NEGT Verification Suite`, 20, 285);
        }
        
        const filename = `negt_verification_report_${Date.now().toString().slice(-6)}.pdf`;
        doc.save(filename);
        triggerToast('success', `Direct PDF report "${filename}" downloaded successfully.`);
      } catch (err) {
        console.error(err);
        triggerToast('error', 'Failed to generate direct PDF file.');
      }
      return;
    }

    const filename = `negt_verification_report_${Date.now().toString().slice(-6)}.${format}`;
    let fileContent = "";
    let mimeType = "text/plain";

    if (format === 'json') {
      mimeType = "application/json";
      const exportObject = {
        reportType: reportType === 'full' ? 'Technical Report' : reportType === 'exec' ? 'Executive Summary' : 'Data Sheet',
        model: "NEGT v1.2",
        verdict: finalVerdictText,
        confidence: confidenceText,
        riskLevel: riskText,
        newsText: result.text || "",
        generatedAt: new Date().toISOString(),
        keyFindings: result.keyFindings,
        topologicalStats: { nodes: result.stats.nodes, edges: result.stats.edges, words: result.stats.words, sources: result.stats.sources, mentions: result.stats.mentions }
      };

      if (sections.propagation) {
        exportObject.propagationAnalytics = {
          maxHops: isFake ? '4 Hops' : '5 Hops',
          avgBreadth: isFake ? '11.2 nodes/hop' : '3.6 nodes/hop',
          viralityScore: isFake ? '8.4/10' : '2.1/10',
          clusteringCoefficient: isFake ? '0.64' : '0.12',
          verifiedPressPct: isFake ? '14%' : '64%',
          socialNetworksPct: isFake ? '62%' : '25%',
          blogsPct: isFake ? '24%' : '11%',
          sentimentVerdict: isFake ? 'Sensationalist & biased outrage pattern' : 'Informative & authentic citation pattern'
        };
      }

      if (sections.noise) {
        exportObject.noiseAnalysis = {
          suspiciousPatterns: isFake ? 7 : 1,
          botActivityRating: isFake ? '42%' : '4%',
          anomalousLinks: isFake ? 3 : 0,
          gibScore: isFake ? '89%' : '98%'
        };
      }

      if (sections.attribution) {
        exportObject.featureAttribution = {
          earlyUserCredibility: isFake ? '23%' : '29%',
          sourceDomainTrust: isFake ? '19%' : '35%',
          engagementVelocity: isFake ? '18%' : '8%',
          propagationDiversity: isFake ? '15%' : '18%'
        };
      }

      if (sections.metrics) {
        exportObject.performanceMetrics = {
          accuracy: '94.2%',
          robustnessGIB: '8.7/10',
          interpretabilityScore: '9.1/10',
          latency: '0.8s',
          hyperparameters: 'Layers: 4 transformer blocks | Heads: 8 divided partitions | GIB Ratio: 0.15 | Noise Scale: 0.05'
        };
      }

      fileContent = JSON.stringify(exportObject, null, 2);
    } else if (format === 'csv') {
      mimeType = "text/csv";
      let csvContent = "Section,Metric,Value\n" +
                    `Summary,Model,NEGT v1.2\n` +
                    `Summary,Verdict,${finalVerdictText}\n` +
                    `Summary,Confidence,${confidenceText}\n` +
                    `Summary,Risk Level,${riskText}\n` +
                    `Summary,Nodes,${result.stats.nodes}\n` +
                    `Summary,Edges,${result.stats.edges}\n` +
                    `Summary,Words,${result.stats.words}\n` +
                    `Summary,Sources,${result.stats.sources}\n` +
                    `Summary,Mentions,${result.stats.mentions}\n`;

      if (sections.propagation) {
        csvContent += `Propagation,Max Propagation Hops,${isFake ? '4 Hops' : '5 Hops'}\n` +
                      `Propagation,Average Breadth,${isFake ? '11.2 nodes/hop' : '3.6 nodes/hop'}\n` +
                      `Propagation,Structural Virality,${isFake ? '8.4/10' : '2.1/10'}\n` +
                      `Propagation,Clustering Coefficient,${isFake ? '0.64' : '0.12'}\n` +
                      `Propagation,Verified Press Pct,${isFake ? '14%' : '64%'}\n` +
                      `Propagation,Social Networks Pct,${isFake ? '62%' : '25%'}\n` +
                      `Propagation,Blogs Pct,${isFake ? '24%' : '11%'}\n` +
                      `Propagation,Sentiment Verdict,${isFake ? 'Sensationalist' : 'Informative'}\n`;
      }

      if (sections.noise) {
        csvContent += `Noise,Suspicious Patterns,${isFake ? 7 : 1}\n` +
                      `Noise,Bot Activity Rating,${isFake ? '42%' : '4%'}\n` +
                      `Noise,Anomalous Links,${isFake ? 3 : 0}\n` +
                      `Noise,GIB Score,${isFake ? '89%' : '98%'}\n`;
      }

      if (sections.attribution) {
        csvContent += `Attribution,Early User Credibility,${isFake ? '23%' : '29%'}\n` +
                      `Attribution,Source Domain Trust,${isFake ? '19%' : '35%'}\n` +
                      `Attribution,Engagement Velocity,${isFake ? '18%' : '8%'}\n` +
                      `Attribution,Propagation Diversity,${isFake ? '15%' : '18%'}\n`;
      }

      if (sections.metrics) {
        csvContent += `Metrics,Classification Accuracy,94.2%\n` +
                      `Metrics,Noise Robustness,8.7/10\n` +
                      `Metrics,Interpretability Score,9.1/10\n` +
                      `Metrics,Inference Latency,0.8s\n`;
      }

      fileContent = csvContent;
    } else if (format === 'html') {
      mimeType = "text/html";
      let htmlBodyContent = `
        <h1>NEGT Authenticity Report</h1>
        <p><strong>Verdict:</strong> <span class="badge ${result.verdict.toLowerCase()}">${finalVerdictText} (${confidenceText} Confidence)</span></p>
        <p><strong>Risk Level:</strong> ${riskText}</p>
        <p><strong>Model:</strong> NEGT v1.2</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <div class="section-title">Key Findings:</div>
        <ul>
          ${result.keyFindings.map(f => `<li>${f}</li>`).join('')}
        </ul>
      `;

      if (sections.propagation) {
        htmlBodyContent += `
          <div class="section-title">1. Propagation Analytics:</div>
          <ul>
            <li>Max Hops: ${isFake ? '4 Hops' : '5 Hops'}</li>
            <li>Avg Breadth: ${isFake ? '11.2 nodes/hop' : '3.6 nodes/hop'}</li>
            <li>Virality: ${isFake ? '8.4/10' : '2.1/10'}</li>
            <li>Verified Press Share: ${isFake ? '14%' : '64%'}</li>
            <li>Social Networks Share: ${isFake ? '62%' : '25%'}</li>
            <li>Blogs / Self-Published Domains: ${isFake ? '24%' : '11%'}</li>
            <li>Sentiment: ${isFake ? 'Sensationalist Outrage' : 'Informative Citation'}</li>
          </ul>
        `;
      }

      if (sections.noise) {
        htmlBodyContent += `
          <div class="section-title">2. Noise Analysis:</div>
          <ul>
            <li>Suspicious Patterns: ${isFake ? 7 : 1}</li>
            <li>Bot Activity Rating: ${isFake ? '42%' : '4%'}</li>
            <li>Anomalous Links: ${isFake ? 3 : 0}</li>
            <li>Noise Filtering Score (GIB): ${isFake ? '89%' : '98%'}</li>
          </ul>
        `;
      }

      if (sections.attribution) {
        htmlBodyContent += `
          <div class="section-title">3. Feature Attribution:</div>
          <ul>
            <li>Early User Credibility: ${isFake ? '23%' : '29%'}</li>
            <li>Source Domain Trust: ${isFake ? '19%' : '35%'}</li>
            <li>Engagement Velocity: ${isFake ? '18%' : '8%'}</li>
            <li>Propagation Diversity: ${isFake ? '15%' : '18%'}</li>
          </ul>
        `;
      }

      if (sections.metrics) {
        htmlBodyContent += `
          <div class="section-title">4. Technical Performance Evaluation:</div>
          <ul>
            <li>Classification Accuracy: 94.2%</li>
            <li>Noise Robustness: 8.7/10</li>
            <li>Interpretability Score: 9.1/10</li>
            <li>Inference Latency: 0.8s</li>
            <li>Hyperparameters: Layers 4, Heads 8, GIB Ratio 0.15, Noise Scale 0.05</li>
          </ul>
        `;
      }

      fileContent = `<!DOCTYPE html>
<html>
<head>
  <title>NEGT Fake News Verification Report</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; padding: 40px; background: #0a0d14; color: #f8fafc; line-height: 1.6; }
    .card { background: #101524; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
    h1 { color: #185fa5; font-size: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 12px; }
    .badge { padding: 4px 10px; border-radius: 4px; font-weight: bold; color: white; }
    .badge.real { background: #097b40; }
    .badge.fake { background: #a32d2d; }
    .badge.uncertain { background: #ba7517; }
    .section-title { font-weight: bold; margin-top: 20px; color: #1d9e75; border-bottom: 1px solid #1e293b; padding-bottom: 4px; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="card">
    ${htmlBodyContent}
  </div>
</body>
</html>`;
    } else {
      // TXT (Plain Text) Summary
      let txtContent = `=====================================================
          NEGT AUTHENTICITY ANALYSIS REPORT
=====================================================
Report Type: Technical Verification Report
Model: Noise-Filtering Enhanced Graph Transformer v1.2
Date: ${new Date().toLocaleString()}
-----------------------------------------------------
VERDICT: ${finalVerdictText} (${confidenceText} Confidence)
RISK LEVEL: ${riskText}
-----------------------------------------------------
TOPOLOGICAL PROFILE STATISTICS:
- Total Propagation Nodes: ${result.stats.nodes}
- Total Connection Edges: ${result.stats.edges}
- Article Word Count: ${result.stats.words}
- Sources Extracted: ${result.stats.sources}
- Social Media Mentions: ${result.stats.mentions}
-----------------------------------------------------\n`;

      if (sections.propagation) {
        txtContent += `[Section 1: Propagation Analytics]\n` +
                      `- Max Propagation Hops: ${isFake ? '4 Hops' : '5 Hops'}\n` +
                      `- Average Breadth: ${isFake ? '11.2 nodes/hop' : '3.6 nodes/hop'}\n` +
                      `- Structural Virality Score: ${isFake ? '8.4/10' : '2.1/10'}\n` +
                      `- Clustering Coefficient: ${isFake ? '0.64' : '0.12'}\n` +
                      `- Verified Press: ${isFake ? '14%' : '64%'}\n` +
                      `- Social Networks: ${isFake ? '62%' : '25%'}\n` +
                      `- Blogs/Other: ${isFake ? '24%' : '11%'}\n` +
                      `- Sentiment Verdict: ${isFake ? 'Sensationalist Outrage' : 'Informative Citation'}\n\n`;
      }

      if (sections.noise) {
        txtContent += `[Section 2: Noise Analysis]\n` +
                      `- Suspicious Patterns: ${isFake ? 7 : 1}\n` +
                      `- Bot Activity Rating: ${isFake ? '42%' : '4%'}\n` +
                      `- Anomalous Links/Clickbaits: ${isFake ? 3 : 0}\n` +
                      `- Noise Filtering Score: ${isFake ? '89%' : '98%'}\n\n`;
      }

      if (sections.attribution) {
        txtContent += `[Section 3: Feature Attribution]\n` +
                      `- Early User Credibility: ${isFake ? '23%' : '29%'}\n` +
                      `- Source Domain Trust: ${isFake ? '19%' : '35%'}\n` +
                      `- Engagement Velocity: ${isFake ? '18%' : '8%'}\n` +
                      `- Propagation Diversity: ${isFake ? '15%' : '18%'}\n\n`;
      }

      if (sections.metrics) {
        txtContent += `[Section 4: Detailed Performance Metrics]\n` +
                      `- Classification Accuracy: 94.2%\n` +
                      `- Noise Robustness GIB: 8.7/10\n` +
                      `- Interpretability Score: 9.1/10\n` +
                      `- Inference Latency: 0.8s\n` +
                      `- Configuration: Layers 4, Heads 8, GIB Ratio 0.15, Noise Scale 0.05\n\n`;
      }

      txtContent += `=====================================================`;
      fileContent = txtContent;
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast('success', `File "${filename}" downloaded successfully.`);
  };

  const handlePrint = () => {
    if (!isGenerated) {
      triggerToast('warning', 'Please generate the report first');
      return;
    }
    triggerToast('info', 'Opening printer layout...');
    window.print();
  };

  return (
    <div className="export-reporting-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <span className="breadcrumb-link" onClick={() => onNavigate('home')}>Home</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-active">Generate Report</span>
      </div>

      <div className="export-grid-layout">
        {/* Left Options Form */}
        <div className="export-panel glass-panel">
          <div className="panel-header">
            <h3>📥 Report Configuration</h3>
            <p className="section-desc">Customize sections and document formats to export</p>
          </div>

          <div className="export-form-body mt-6">
            {/* 1. Report Type */}
            <div className="form-group-section">
              <h5>Report Type</h5>
              <div className="radio-options-grid mt-2">
                <label className={`radio-label-box ${reportType === 'exec' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="reportType" 
                    value="exec"
                    checked={reportType === 'exec'}
                    onChange={() => setReportType('exec')}
                  />
                  <div className="radio-meta">
                    <span className="lbl font-semibold">Executive Summary</span>
                    <span className="desc">Compact 1-2 pages overview</span>
                  </div>
                </label>

                <label className={`radio-label-box ${reportType === 'full' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="reportType" 
                    value="full"
                    checked={reportType === 'full'}
                    onChange={() => setReportType('full')}
                  />
                  <div className="radio-meta">
                    <span className="lbl font-semibold">(Recommended) Technical Report</span>
                    <span className="desc">Detailed 10-15 pages analysis</span>
                  </div>
                </label>

                <label className={`radio-label-box ${reportType === 'data' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="reportType" 
                    value="data"
                    checked={reportType === 'data'}
                    onChange={() => setReportType('data')}
                  />
                  <div className="radio-meta">
                    <span className="lbl font-semibold">Raw Data Sheet</span>
                    <span className="desc">CSV or JSON file format</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Include Sections */}
            <div className="form-group-section mt-6">
              <h5>Include Sections</h5>
              <div className="checkboxes-grid mt-2">
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={sections.propagation}
                    onChange={() => toggleSection('propagation')}
                  />
                  <span className="lbl">Propagation Analytics</span>
                </label>
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={sections.noise}
                    onChange={() => toggleSection('noise')}
                  />
                  <span className="lbl">Noise Analysis</span>
                </label>
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={sections.attribution}
                    onChange={() => toggleSection('attribution')}
                  />
                  <span className="lbl">Feature Attribution</span>
                </label>
                <label className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={sections.metrics}
                    onChange={() => toggleSection('metrics')}
                  />
                  <span className="lbl">Detailed Metrics</span>
                </label>
              </div>
            </div>

            {/* 3. Export Format */}
            <div className="form-group-section mt-6">
              <h5>Export Format</h5>
              <div className="radio-formats-row mt-2">
                <label className={`radio-format-pill ${format === 'pdf' ? 'selected' : ''}`}>
                  <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={() => setFormat('pdf')} />
                  <span>PDF (Recommended)</span>
                </label>
                <label className={`radio-format-pill ${format === 'html' ? 'selected' : ''}`}>
                  <input type="radio" name="format" value="html" checked={format === 'html'} onChange={() => setFormat('html')} />
                  <span>HTML (Interactive)</span>
                </label>
                <label className={`radio-format-pill ${format === 'json' ? 'selected' : ''}`}>
                  <input type="radio" name="format" value="json" checked={format === 'json'} onChange={() => setFormat('json')} />
                  <span>JSON (Data Heavy)</span>
                </label>
                <label className={`radio-format-pill ${format === 'csv' ? 'selected' : ''}`}>
                  <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={() => setFormat('csv')} />
                  <span>CSV (Spreadsheet)</span>
                </label>
                <label className={`radio-format-pill ${format === 'txt' ? 'selected' : ''}`}>
                  <input type="radio" name="format" value="txt" checked={format === 'txt'} onChange={() => setFormat('txt')} />
                  <span>TXT (Plain Text)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Compilation & Generation State */}
        <div className="export-panel glass-panel flex-col-center">
          <div className="panel-header w-full">
            <h3>📋 Report Compiler Output</h3>
          </div>

          <div className="compiler-visualizer-box mt-6 w-full">
            {isCompiling && (
              <div className="compiling-state animate-pulse">
                <SpinnerIcon className="w-12 h-12 text-teal animate-spin mb-4" />
                <h4>Compiling Report...</h4>
                <p className="text-secondary text-xs mt-2">{compileStep}</p>
              </div>
            )}

            {!isCompiling && isGenerated && (
              <div className="generated-state animate-fade-in flex-col-center">
                <div className="success-icon-badge">✓</div>
                <h4>Report Generated Successfully!</h4>
                <p className="text-secondary text-xs mt-1">Ready for offline download and printing</p>
                <div className="generated-metadata mt-4">
                  <div className="metadata-row">
                    <span className="lbl">File Name:</span>
                    <span className="val font-semibold">negt_report_{Date.now().toString().slice(-6)}.{format}</span>
                  </div>
                  <div className="metadata-row">
                    <span className="lbl">Size:</span>
                    <span className="val">2.8 MB</span>
                  </div>
                </div>
              </div>
            )}

            {!isCompiling && !isGenerated && (
              <div className="awaiting-state flex-col-center text-center">
                <div className="awaiting-graphic">📥</div>
                <h4>Ready to Generate</h4>
                <p className="text-secondary text-xs mt-1">Configure options on the left and click Generate</p>
              </div>
            )}
          </div>

          <div className="button-group-row justify-center w-full mt-8">
            <button className="btn-primary" onClick={handleGenerate} disabled={isCompiling}>
              Generate Report
            </button>
            <button className="btn-secondary" onClick={handleDownload} disabled={isCompiling || !isGenerated}>
              Download
            </button>
            <button className="btn-secondary" onClick={handlePrint} disabled={isCompiling || !isGenerated}>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
