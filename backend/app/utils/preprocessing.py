import re

def clean_text(text: str) -> str:
    """
    Cleans text by lowering it, stripping HTML tags, removing special characters,
    and normalizing whitespaces.
    """
    if not text:
        return ""
        
    # Convert to lowercase
    text = text.lower()
    
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # Strip URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def tokenize_text(text: str):
    """
    Splits text into words/tokens.
    """
    cleaned = clean_text(text)
    return [t for t in cleaned.split(" ") if t]
