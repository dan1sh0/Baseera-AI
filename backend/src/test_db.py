from database import engine
from sqlalchemy import text

def test_connection():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Database connection successful!")

if __name__ == "__main__":
    test_connection() 