import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

supabase_client = None
if SUPABASE_URL != "https://your-project.supabase.co" and SUPABASE_KEY != "your-service-role-key":
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Successfully connected to Supabase.")
    except Exception as e:
        print(f"Failed to connect to Supabase: {e}")
else:
    print("Supabase URL or Key not set. Running backend in local JSON fallback mode.")
