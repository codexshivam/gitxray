from config import Config
from services import process_data

def main():
    cfg = Config()
    result = process_data("payload", cfg.timeout)
    print(result)

if __name__ == "__main__":
    main()
