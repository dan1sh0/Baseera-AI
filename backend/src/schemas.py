from pydantic import BaseModel
from typing import List, Optional

class VerseBase(BaseModel):
    surah_id: int
    verse_number: int
    arabic: str
    english: str

class VerseResponse(VerseBase):
    id: int
    surah_name: str

    class Config:
        from_attributes = True

class SearchResult(BaseModel):
    id: int
    surah_number: int
    verse_number: int
    arabic: str
    english: str
    surah_name: str

class SearchResponse(BaseModel):
    results: List[SearchResult]
    count: int 