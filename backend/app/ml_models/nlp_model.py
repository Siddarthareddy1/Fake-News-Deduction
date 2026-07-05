import re
import os
from app.config import settings
from app.utils.logger import logger
from app.utils.feature_extraction import extract_text_features

# Global model state
_pipeline = None
_has_loaded = False

def init_nlp_model():
    global _pipeline, _has_loaded
    if _has_loaded:
        return
        
    try:
        import torch
        from transformers import pipeline
        # Load classification model if configured and exists, otherwise load tiny default
        model_name = settings.NLP_MODEL_PATH
        # Fallback to a lightweight model for default testing
        if not os.path.exists(model_name):
            model_name = "distilbert-base-uncased-finetuned-sst-2-english"
            
        logger.info(f"Loading BERT-based NLP classifier from {model_name}...")
        _pipeline = pipeline("text-classification", model=model_name, device=-1)
        _has_loaded = True
        logger.info("BERT-based NLP model loaded successfully.")
    except ImportError:
        logger.warning("torch/transformers packages not installed. NLP service running in fallback heuristic mode.")
        _has_loaded = True
    except Exception as e:
        logger.error(f"Failed to load NLP model: {e}. NLP service running in fallback heuristic mode.")
        _has_loaded = True

def predict_nlp_authenticity(text: str) -> int:
    """
    Computes an authenticity score (0 to 100) using BERT or fallback linguistics heuristics.
    """
    init_nlp_model()
    
    # 1. BERT classifier evaluation
    if _pipeline:
        try:
            # Chunk long text to avoid BERT max length constraints (512 tokens)
            truncated_text = text[:1000]
            result = _pipeline(truncated_text)[0]
            
            # Translate fine-tuned model outputs into authenticity scores
            label = result["label"].upper()
            score = float(result["score"])
            
            if "LABEL_1" in label or "REAL" in label or "POSITIVE" in label:
                return int(score * 100)
            else:
                return int((1.0 - score) * 100)
        except Exception as e:
            logger.error(f"Error during BERT inference: {e}. Falling back to heuristics.")

    # 2. Heuristics fallback (Linguistic & Syntax Analyzer)
    features = extract_text_features(text)
    
    # Baseline score starts at 85 (likely real)
    base_score = 85
    
    # Capitalization penalty (all-caps indicates sensationalism/fake news)
    if features["uppercase_ratio"] > 0.2:
        base_score -= 15
    elif features["uppercase_ratio"] > 0.1:
        base_score -= 5
        
    # Sensational vocabulary penalty
    density = features["sensational_word_density"]
    if density > 0.05:
        base_score -= 25
    elif density > 0.02:
        base_score -= 10
        
    # Punctuation spam penalty
    if features["exclamation_count"] > 3:
        base_score -= 15
    elif features["exclamation_count"] > 1:
        base_score -= 5
        
    # Length validation (extremely short or long texts get slight variance checks)
    if features["word_count"] < 100:
        base_score -= 5
        
    return max(0, min(100, base_score))
