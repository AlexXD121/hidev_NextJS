from fastapi import APIRouter
from typing import List
from models import Campaign

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.get("/", response_model=List[Campaign])
async def get_campaigns():
    return await Campaign.find_all().to_list()

@router.post("/", response_model=Campaign)
async def create_campaign(campaign: Campaign):
    await campaign.insert()
    return campaign

@router.get("/campaign_contacts", response_model=List[dict])
async def get_campaign_contacts(campaign_id: str):
    # Mock return
    return [
        {"name": "John Doe", "phone": "+123456789"},
        {"name": "Jane Smith", "phone": "+987654321"}
    ]

@router.get("/{campaign_name}")
async def get_campaign_stats(campaign_name: str):
    # Mock stats
    return {
        "sent": 120,
        "delivered": 115,
        "read": 85,
        "failed": 5
    }
