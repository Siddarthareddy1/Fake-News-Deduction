import pytest
from app.ml_models.source_credibility import get_source_credibility
from app.ml_models.nlp_model import predict_nlp_authenticity
from app.ml_models.gnn_model import predict_gnn_authenticity
from app.ml_models.ensemble import calculate_ensemble_score, get_verdict, assess_risks

def test_source_credibility():
    # Test known credible source
    score, name = get_source_credibility("https://reuters.com/article/something")
    assert score >= 90
    assert "reuters" in name.lower()
    
    # Test known fake source
    score, name = get_source_credibility("http://abcnews.com.co/viral-lie")
    assert score <= 10
    
    # Test unknown default source
    score, name = get_source_credibility("")
    assert score == 50

def test_nlp_heuristics():
    # High capitalization shouting text should get lower score
    shouting_text = "SHOCKING REVEAL!!! NASA DISCOVERS SECRETS ON MARS!!! CONSPIRACY LEAK EXPOSED IMMEDIATELY!!! SHOCKING TRUTH!!!"
    # Add filler characters to reach 50 chars limit
    shouting_text += " " * 50
    score_shout = predict_nlp_authenticity(shouting_text)
    
    # Clean text
    clean_text = "The scientific community published a detailed study describing the properties of qubits on quantum silicon processors."
    score_clean = predict_nlp_authenticity(clean_text)
    
    assert score_clean > score_shout

def test_gnn_heuristics():
    # AP news url (credible)
    score_ap, stats_ap = predict_gnn_authenticity("Some article text " * 5, "https://apnews.com/article")
    assert score_ap >= 80
    assert stats_ap["bot_activity_rating"] == 4
    
    # Clickbait URL (unreliable)
    score_fake, stats_fake = predict_gnn_authenticity("Some article text " * 5, "http://clickbaitspam.net/viral")
    assert score_fake <= 30
    assert stats_fake["bot_activity_rating"] == 42

def test_ensemble_aggregation():
    gnn = 80
    nlp = 70
    source = 90
    
    # 40% GNN, 35% NLP, 25% Source
    # 80*0.4 + 70*0.35 + 90*0.25 = 32 + 24.5 + 22.5 = 79
    final_score = calculate_ensemble_score(gnn, nlp, source)
    assert final_score == 79
    
    verdict = get_verdict(final_score)
    assert verdict == "Likely Authentic"
    
    risks = assess_risks(gnn, nlp, source)
    assert "Low" in risks.values() or "Very Low" in risks.values()
