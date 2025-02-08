from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.search import SearchService
from typing import List, Optional

router = APIRouter()
search_service = SearchService()

@router.get("/api/search")
async def search(
    q: str,
    limit: Optional[int] = 10,
    db: Session = Depends(get_db)
):
    results = search_service.search(q, db, limit)
    return {
        "results": results,
        "count": len(results)
    } 