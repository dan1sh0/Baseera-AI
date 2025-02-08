from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ...database import get_db
from ...services.search import SearchService
from ...schemas import SearchResponse

router = APIRouter()

@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., description="Search query"),
    search_type: str = Query("hybrid", description="Search type: text, semantic, or hybrid"),
    db: Session = Depends(get_db)
):
    search_service = SearchService(db)
    results = await search_service.search(q, search_type)
    
    return {
        "results": results,
        "count": len(results)
    } 