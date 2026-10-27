from config import format_output

def process_data(raw_input: str, timeout: int):
    cleaned = raw_input.strip()
    return format_output(cleaned)
