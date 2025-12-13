from fastapi import APIRouter, HTTPException, Depends
from models import User
from dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/integrations", tags=["integrations"])

class GoogleSheetConnect(BaseModel):
    sheet_url: str

@router.post("/google-sheets/connect")
async def connect_google_sheet(data: GoogleSheetConnect, current_user: User = Depends(get_current_user)):
    try:
        import pandas as pd
        
        # 1. Optimize URL for CSV export (if it's a standard web link)
        # Standard: https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
        # Export: https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv
        
        url = data.sheet_url
        if "/edit" in url:
            url = url.split("/edit")[0] + "/export?format=csv"
            
        # 2. Attempt to read
        # This works for "Published to Web" sheets or Public (Anyone with link) if permissions allow CSV export
        df = pd.read_csv(url, nrows=5) # Read only first few rows for header
        
        columns = df.columns.tolist()
        
        return {
            "status": "success",
            "message": "Connected to Google Sheet successfully",
            "sheet_id": url.split("/d/")[1].split("/")[0] if "/d/" in url else "unknown",
            "columns_mapped": columns
        }
        
    except Exception as e:
        # If pandas fails, it might be private. check for Service Account (Advanced)
        # For now, return error as requested for "Public" sheets.
        print(f"Sheet Error: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to connect. Ensure sheet is 'Public' or 'Published to Web'. Error: {str(e)}")
