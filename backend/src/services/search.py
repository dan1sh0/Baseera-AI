from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from sqlalchemy import or_
import numpy as np
from openai import OpenAI
from ..models import Verse, Surah
from ..config import OPENAI_API_KEY
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict

class SearchService:
    def __init__(self, db: Session):
        self.db = db
        self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        self.ai_client = OpenAI(api_key=OPENAI_API_KEY)

    async def search(self, query: str, search_type: str = "hybrid") -> List[Dict]:
        if search_type == "text":
            return self.text_search(query)
        elif search_type == "semantic":
            return self.semantic_search(query)
        else:
            text_results = self.text_search(query)
            semantic_results = self.semantic_search(query)
            return self.combine_results(text_results, semantic_results)

    def text_search(self, query: str) -> List[Dict]:
        """Traditional database text search"""
        results = self.db.query(Verse).join(Surah).filter(
            or_(
                Verse.english.ilike(f"%{query}%"),
                Verse.arabic.ilike(f"%{query}%"),
                Surah.name.ilike(f"%{query}%")
            )
        ).all()
        return [self.verse_to_dict(verse) for verse in results]

    async def semantic_search(self, query: str) -> List[Dict]:
        """AI-enhanced semantic search"""
        # Get AI to understand query intent
        ai_response = await self.ai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": """You are an Islamic scholar helping to understand search queries 
                for Islamic texts. Your role is to:
                1. Understand the core meaning and intent of the query
                2. Expand it to include:
                   - Related Quranic concepts and terms
                   - Relevant Hadith topics and themes
                   - Arabic terminology (both Quranic and Hadith terms)
                   - Common variations and synonyms
                   - Related prophetic teachings and sunnah
                   - Historical context when relevant
                3. Consider both:
                   - Direct references (specific verses/hadiths)
                   - Thematic connections (related principles/teachings)
                
                Format your response as a clear, expanded search query that captures
                these various dimensions while maintaining the original intent."""
            }, {
                "role": "user",
                "content": f"Understand and expand this query: {query}"
            }]
        )
        
        enhanced_query = ai_response.choices[0].message.content
        
        # Generate embedding for enhanced query
        query_embedding = self.model.encode(enhanced_query)
        
        # Find similar verses
        verses = self.db.query(Verse).all()
        verses_with_embeddings = [(v, np.array(v.embedding)) for v in verses if v.embedding is not None]
        
        if verses_with_embeddings:
            similarities = [
                (verse, cosine_similarity([emb], [query_embedding])[0][0])
                for verse, emb in verses_with_embeddings
            ]
            results = [v for v, _ in sorted(similarities, key=lambda x: x[1], reverse=True)[:10]]
            return [self.verse_to_dict(verse) for verse in results]
        
        return []

    @staticmethod
    def verse_to_dict(verse: Verse) -> Dict:
        return {
            "id": verse.id,
            "surah_number": verse.surah_id,
            "verse_number": verse.verse_number,
            "arabic": verse.arabic,
            "english": verse.english,
            "surah_name": verse.surah_name
        }

    def _calculate_relevance_score(self, verse, query, semantic_score=None):
        """Calculate overall relevance score for ranking"""
        score = 0
        
        # Direct text match bonus
        if query.lower() in verse.english.lower():
            score += 0.5
            
        # Semantic similarity score
        if semantic_score is not None:
            score += semantic_score * 0.5
            
        return score 