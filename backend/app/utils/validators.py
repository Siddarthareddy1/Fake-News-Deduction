import re
from typing import Optional, Tuple

def validate_text_length(text: str) -> Tuple[bool, Optional[str]]:
    """
    Validates that the text length is within the required range (50 to 50,000 characters).
    """
    if not text:
        return False, "Text is required."
        
    length = len(text)
    if length < 50:
        return False, f"Text is too short ({length} characters). Minimum required is 50 characters."
    if length > 50000:
        return False, f"Text is too long ({length} characters). Maximum allowed is 50,000 characters."
        
    return True, None

def validate_url(url: str) -> bool:
    """
    Validates that the provided string matches a general URL regex format.
    """
    if not url:
        return True # URL is optional
        
    regex = re.compile(
        r'^(?:http|ftp)s?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE
    )
    return re.match(regex, url) is not None
