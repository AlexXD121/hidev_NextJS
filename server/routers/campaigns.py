from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from models import Campaign
from beanie import PydanticObjectId

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.get("/", response_model=List[Campaign])
async def get_campaigns():
    return await Campaign.find_all().to_list()

@router.post("/", response_model=Campaign)
async def create_campaign(campaign: Campaign):
    await campaign.insert()
    return campaign

@router.post("/{campaign_id}/send")
async def send_campaign(campaign_id: str, background_tasks: BackgroundTasks):
    from routers.chat import simulate_reply  # Import here to avoid circular dependencies if any
    from models import Contact, Message, MessageStatus, CampaignStatus

    # 1. Fetch Campaign
    campaign = await Campaign.get(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # 2. Logic: If no audience defined, maybe fetch all? For now, assume audience_ids are used.
    # If audience_ids is empty, we might want to fail or fetch all. 
    # Let's assume strict explicit audience for safety.
    # PROMPT REQUIREMENT: "Fetch the associated Contact list"
    
    contacts = []
    if not campaign.audience_ids:
         # Fallback: Send to ALL if empty? Or just fail? 
         # Let's fail safety.
         raise HTTPException(status_code=400, detail="No audience defined for this campaign.")
    else:
         # Fetch contacts where ID is in the list
         contacts = await Contact.find({"_id": {"$in": [PydanticObjectId(oid) for oid in campaign.audience_ids]}}).to_list()

    sent_count = 0
    for contact in contacts:
        # 3. Create Message
        msg = Message(
            chat_id=str(contact.id),
            sender_id="me",
            text=f"Hello {contact.name}, this is a campaign message: {campaign.name}", # Templated content would go here
            status=MessageStatus.SENT,
            type="text", # or campaign.template_type
            contact_id=str(contact.id)
        )
        await msg.insert()
        sent_count += 1
        
        # 4. Trigger Simulated Reply (The "Customer" replies)
        background_tasks.add_task(simulate_reply, str(contact.id))

    # 5. Update Campaign Status
    campaign.status = CampaignStatus.COMPLETED # or SENDING if async queue
    campaign.stats.sent = sent_count
    await campaign.save()

    return {"status": "success", "sent_count": sent_count}


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
