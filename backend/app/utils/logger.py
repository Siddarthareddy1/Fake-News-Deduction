import logging
import json
import sys
from datetime import datetime
from app.config import settings

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_data)

def setup_logger():
    logger = logging.getLogger("app")
    logger.setLevel(logging.INFO)
    
    # Clean previous handlers
    logger.handlers.clear()
    
    handler = logging.StreamHandler(sys.stdout)
    if settings.ENV == "production":
        handler.setFormatter(JSONFormatter())
    else:
        # Readable standard format for dev
        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
        )
        handler.setFormatter(formatter)
        
    logger.addHandler(handler)
    return logger

logger = setup_logger()
