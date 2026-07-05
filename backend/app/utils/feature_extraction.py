import re
from urllib.parse import urlparse
from typing import Dict, Any

SENSATIONAL_WORDS = {
    "shocking", "unbelievable", "secret", "exposed", "breaking", "miracle", 
    "leak", "conspiracy", "critical", "insane", "bombshell", "propaganda",
    "must-read", "hidden", "proven", "confidential", "scandal", "lie", "fake"
}

def extract_domain(url: str) -> str:
    """
    Extracts the clean domain name (e.g. bbc.com) from a full URL.
    """
    if not url:
        return ""
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc or parsed.path
        # Remove www.
        if netloc.startswith("www."):
            netloc = netloc[4:]
        # Remove port if exists
        netloc = netloc.split(":")[0]
        return netloc.lower()
    except Exception:
        return ""

def extract_text_features(text: str) -> Dict[str, Any]:
    """
    Extracts numeric and signal features from plain text.
    """
    if not text:
        return {
            "word_count": 0,
            "uppercase_ratio": 0.0,
            "exclamation_count": 0,
            "sensational_word_density": 0.0,
            "has_clickbait_format": False
        }
        
    words = text.split()
    word_count = len(words)
    
    # Capitalization ratio
    caps_count = sum(1 for c in text if c.isupper())
    total_letters = sum(1 for c in text if c.isalpha())
    uppercase_ratio = caps_count / total_letters if total_letters > 0 else 0.0
    
    # Sensational words check
    sensational_count = sum(1 for w in words if w.lower().strip(",.!?\"'") in SENSATIONAL_WORDS)
    sensational_word_density = sensational_count / word_count if word_count > 0 else 0.0
    
    # Question/Exclamation points count
    exclamation_count = text.count("!")
    question_count = text.count("?")
    
    # Has clickbait format (e.g., all caps word, question and exclamation marks)
    has_clickbait_format = (
        uppercase_ratio > 0.3 or 
        sensational_word_density > 0.05 or 
        exclamation_count > 2
    )
    
    return {
        "word_count": word_count,
        "uppercase_ratio": uppercase_ratio,
        "exclamation_count": exclamation_count,
        "sensational_word_density": sensational_word_density,
        "has_clickbait_format": has_clickbait_format
    }
