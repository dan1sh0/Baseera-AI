from database import SessionLocal
from models import Surah, Verse

def test_models():
    db = SessionLocal()
    try:
        # Create a test surah
        test_surah = Surah(
            id=1,
            name="Al-Fatiha",
            name_arabic="الفاتحة",
            is_makki=True,
            verses_count=7
        )
        db.add(test_surah)
        db.commit()
        
        # Query it back
        surah = db.query(Surah).first()
        print(f"Added surah: {surah.name} ({surah.name_arabic})")
        
    finally:
        db.close()

if __name__ == "__main__":
    test_models() 