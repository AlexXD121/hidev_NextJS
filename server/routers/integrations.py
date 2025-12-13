from fastapi import APIRouter, HTTPException, Depends
from models import User
from dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/integrations", tags=["integrations"])

class GoogleSheetConnect(BaseModel):
    sheet_url: str

@router.post("/google-sheets/connect")
async def connect_google_sheet(data: GoogleSheetConnect, current_user: User = Depends(get_current_user)):
    # Mock connection logic
    if "docs.google.com/spreadsheets" not in data.sheet_url:
         raise HTTPException(status_code=400, detail="Invalid Google Sheet URL")
    
    return {
        "status": "success",
        "message": "Connected to Google Sheet successfully",
        "sheet_id": "mock-sheet-id-12345",
        "columns_mapped": ["Name", "Phone", "Email"]
    }
