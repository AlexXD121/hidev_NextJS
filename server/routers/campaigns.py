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
