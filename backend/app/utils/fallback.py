import json
import os

def load_local_json(filename: str):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    path = os.path.join(base_dir, "frontend", "src", "data", filename)
    if not os.path.exists(path):
        path = os.path.join(base_dir, "temp_old", "src", "data", filename)
    
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading fallback JSON {filename}: {e}")
            return []
    else:
        print(f"Fallback JSON file not found: {path}")
        return []
