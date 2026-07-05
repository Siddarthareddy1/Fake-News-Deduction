from typing import Tuple
from app.utils.feature_extraction import extract_domain

# Pre-defined database of known domains with credibility scores
# Scale: 0 to 100 (high is highly credible)
DOMAINS_DATABASE = {
    # Mainstream Credible News (90-100)
    "bbc.co.uk": 95,
    "bbc.com": 95,
    "nytimes.com": 94,
    "reuters.com": 98,
    "apnews.com": 97,
    "cnn.com": 85,
    "npr.org": 93,
    "guardian.co.uk": 90,
    "theguardian.com": 90,
    "wallstreetjournal.com": 92,
    "wsj.com": 92,
    "washingtonpost.com": 91,
    "bloomberg.com": 93,
    "economist.com": 94,
    "ft.com": 95,
    
    # Established Outlets / Tech (80-90)
    "techcrunch.com": 88,
    "wired.com": 87,
    "forbes.com": 82,
    "time.com": 85,
    
    # Sensationalist / Partisan Tabloids (40-60)
    "dailymail.co.uk": 55,
    "nypost.com": 58,
    "breitbart.com": 42,
    "infowars.com": 15,
    
    # Known Fake / Conspiracy Outlets (0-30)
    "abcnews.com.co": 5, # Fake domain cloning ABC
    "baltimoregazette.com": 10,
    "nationalreport.net": 8,
    "worldnewsdailyreport.com": 7,
    "beforeitsnews.com": 12,
    "naturalnews.com": 18,
    "yournewswire.com": 10,
    "disclose.tv": 22,
    "clickbaitspam.net": 12,
    "fakeenewsexposed.com": 8,
    "globalconspiracynews.net": 9,
    "dailybuzzclick.com": 14
}

def get_source_credibility(url: str) -> Tuple[int, str]:
    """
    Extracts the domain from a URL and checks it against the database.
    Returns: (score (0-100), source_name)
    """
    if not url:
        return 50, "Unknown Source" # Default neutral score for missing URL
        
    domain = extract_domain(url)
    if not domain:
        return 50, "Unknown Source"
        
    # Direct lookup
    if domain in DOMAINS_DATABASE:
        score = DOMAINS_DATABASE[domain]
        source_name = domain.split(".")[0].upper() + " News"
        return score, source_name
        
    # Check if domain matches any substring (e.g. bbc.co.uk matches bbc.com)
    for db_domain, db_score in DOMAINS_DATABASE.items():
        if domain.endswith(db_domain) or db_domain.endswith(domain):
            source_name = db_domain.split(".")[0].upper() + " News"
            return db_score, source_name
            
    # Heuristics for unknown domains
    score = 50 # Default neutral
    source_name = domain
    
    # Flags for low credibility
    low_credibility_suffixes = [".xyz", ".click", ".buzz", ".info", ".online", ".today", ".vip", ".cc"]
    low_credibility_keywords = ["conspiracy", "truth", "leak", "exposed", "secret", "viral", "buzz", "daily"]
    
    if any(suffix in domain for suffix in low_credibility_suffixes):
        score -= 20
    if any(keyword in domain for keyword in low_credibility_keywords):
        score -= 15
        
    return max(0, score), source_name
