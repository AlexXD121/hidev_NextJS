from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/sheets", tags=["sheets"])

class SheetInfo(BaseModel):
    id: str
    name: str

class ImportedContact(BaseModel):
    name: str
    phone: str

@router.get("/", response_model=List[SheetInfo])
async def get_sheets(current_user: User = Depends(get_current_user)):
    return [
        {"id": "sheet1", "name": "Q1 Leads"},
        {"id": "sheet2", "name": "Webinar Signups"},
        {"id": "sheet3", "name": "Newsletter Subscribers"}
    ]

@router.get("/imported_numbers", response_model=List[ImportedContact])
async def get_imported_numbers(sheet_name: Optional[str] = None, current_user: User = Depends(get_current_user)):
    # Mock return of contacts based on info
    return [
        {"name": "Alice Smith", "phone": "+15550100"},
        {"name": "Bob Jones", "phone": "+15550101"},
        {"name": "Charlie Brown", "phone": "+15550102"},
        {"name": "David Wilson", "phone": "+15550103"},
        {"name": "Eve Davis", "phone": "+15550104"}
    ]
