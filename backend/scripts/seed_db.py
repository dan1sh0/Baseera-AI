import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.models import Surah, Verse
import time

def fetch_quran_data():
    print("Fetching Quran data...")
    surahs = []
    model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-mpnet-base-v2')
    
    for surah_num in range(1, 115):  # Quran has 114 surahs
        try:
            print(f"Fetching Surah {surah_num}...")
            response = requests.get(
                f"http://api.alquran.cloud/v1/surah/{surah_num}/editions/quran-uthmani,en.asad"
            )
            data = response.json()
            
            if response.status_code == 200 and 'data' in data:
                surah_data = data['data'][0]  # Arabic
                surah_en_data = data['data'][1]  # English
                
                # Create Surah
                surah = {
                    'id': surah_num,
                    'name': surah_en_data['englishName'],
                    'name_arabic': surah_data['name'],
                    'is_makki': surah_data['revelationType'] == 'Meccan',
                    'verses_count': len(surah_data['ayahs']),
                    'verses': []
                }
                
                # Process verses
                for i, (ayah_ar, ayah_en) in enumerate(zip(surah_data['ayahs'], surah_en_data['ayahs']), 1):
                    # Generate embedding from English text
                    embedding = model.encode(ayah_en['text']).tolist()
                    
                    verse = {
                        'verse_number': i,
                        'arabic': ayah_ar['text'],
                        'english': ayah_en['text'],
                        'embedding': embedding
                    }
                    surah['verses'].append(verse)
                
                surahs.append(surah)
                print(f"Processed Surah {surah_num}: {surah['name']}")
                time.sleep(1)  # Be nice to the API
                
        except Exception as e:
            print(f"Error processing Surah {surah_num}: {str(e)}")
    
    return surahs

def seed_database(surahs):
    print("Seeding database...")
    db = SessionLocal()
    try:
        # First clear existing data
        db.query(Verse).delete()
        db.query(Surah).delete()
        
        # Add new data
        for surah_data in surahs:
            verses = surah_data.pop('verses')
            surah = Surah(**surah_data)
            db.add(surah)
            db.flush()  # Get the surah ID
            
            for verse_data in verses:
                verse = Verse(surah_id=surah.id, **verse_data)
                db.add(verse)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    surahs = fetch_quran_data()
    seed_database(surahs) 