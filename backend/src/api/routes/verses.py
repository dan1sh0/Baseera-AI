from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ...database import get_db
from ...models import Verse
from ...schemas import VerseResponse

router = APIRouter(prefix="/api/verses")

@router.get("/", response_model=List[VerseResponse])
async def get_verses(
    surah_id: Optional[int] = None,
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get verses with pagination"""
    query = db.query(Verse)
    if surah_id:
        query = query.filter(Verse.surah_id == surah_id)
    return query.offset(offset).limit(limit).all()

@router.get("/{verse_id}", response_model=VerseResponse)
async def get_verse(verse_id: int, db: Session = Depends(get_db)):
    """Get a specific verse"""
    verse = db.query(Verse).filter(Verse.id == verse_id).first()
    if not verse:
        raise HTTPException(status_code=404, detail="Verse not found")
    return verse 