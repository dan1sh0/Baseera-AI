import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "postgresql://baseera_user:baseeraFounder11@localhost:5432/baseera_db"
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY') 