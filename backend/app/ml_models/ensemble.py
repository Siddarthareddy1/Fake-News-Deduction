from typing import Dict, Any, List

def calculate_ensemble_score(gnn_score: int, nlp_score: int, source_score: int) -> int:
    """
    Combines sub-scores with weights:
      - GNN: 40%
      - NLP: 35%
      - Source: 25%
    """
    final_score = (gnn_score * 0.40) + (nlp_score * 0.35) + (source_score * 0.25)
    return int(round(final_score))

def get_verdict(score: int) -> str:
    """
    Determines classification verdict based on final score.
    """
    if score >= 75:
        return "Likely Authentic"
    elif score >= 45:
        return "Uncertain"
    else:
        return "Likely Fake"

def assess_risks(gnn_score: int, nlp_score: int, source_score: int) -> Dict[str, str]:
    """
    Assesses specific risks based on model scores.
    Categories: "Very Low", "Low", "Medium", "High", "Very High"
    """
    # 1. Clickbait Risk (linked mostly to NLP sensationalism)
    if nlp_score >= 80:
        clickbait = "Low"
    elif nlp_score >= 60:
        clickbait = "Medium"
    else:
        clickbait = "High"
        
    # 2. Bias Risk (combination of source and NLP)
    avg_content_score = (nlp_score + source_score) / 2
    if avg_content_score >= 85:
        bias = "Low"
    elif avg_content_score >= 60:
        bias = "Medium"
    else:
        bias = "High"
        
    # 3. Misinformation Risk (linked heavily to GNN spread + Source)
    avg_veracity_score = (gnn_score + source_score) / 2
    if avg_veracity_score >= 80:
        misinformation = "Very Low"
    elif avg_veracity_score >= 60:
        misinformation = "Low"
    elif avg_veracity_score >= 40:
        misinformation = "Medium"
    elif avg_veracity_score >= 20:
        misinformation = "High"
    else:
        misinformation = "Very High"
        
    return {
        "clickbait_risk": clickbait,
        "bias_risk": bias,
        "misinformation_risk": misinformation
    }

def compile_findings(gnn_score: int, nlp_score: int, source_score: int) -> List[Dict[str, str]]:
    """
    Generates a structured list of semantic findings for the report.
    """
    findings = []
    
    # NLP Finding
    if nlp_score >= 80:
        findings.append({
            "type": "positive",
            "title": "Authentic Language Patterns",
            "description": "No sensationalism or clickbait phrasing detected."
        })
    elif nlp_score >= 50:
        findings.append({
            "type": "warning",
            "title": "Biased Language Indicators",
            "description": "Linguistic style displays moderate sensationalism."
        })
    else:
        findings.append({
            "type": "negative",
            "title": "Clickbait/Shouting Patterns",
            "description": "High density of emotional or capitalized text detected."
        })
        
    # GNN Finding
    if gnn_score >= 80:
        findings.append({
            "type": "positive",
            "title": "Organic Social Cascade",
            "description": "Article propagates naturally across verified channels."
        })
    elif gnn_score >= 50:
        findings.append({
            "type": "warning",
            "title": "Moderate Social Spread",
            "description": "Propagation pattern shows minor artificial amplification."
        })
    else:
        findings.append({
            "type": "negative",
            "title": "High Bot Engagement",
            "description": "Social network propagation heavily dominated by bot accounts."
        })
        
    # Source Finding
    if source_score >= 80:
        findings.append({
            "type": "positive",
            "title": "Verified Publisher",
            "description": "Published by established outlet with clean record."
        })
    elif source_score >= 50:
        findings.append({
            "type": "warning",
            "title": "Unverified Platform",
            "description": "Published on self-published blog or unranked domain."
        })
    else:
        findings.append({
            "type": "negative",
            "title": "Blacklisted Domain",
            "description": "Source is a known provider of biased or false articles."
        })
        
    return findings
