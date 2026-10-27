class Config:
    def __init__(self):
        self.timeout = 30
        self.environment = "production"

def format_output(val: str) -> str:
    return f"[PROCESSED] {val}"
