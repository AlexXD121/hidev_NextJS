import asyncio
import os
from database import init_db
from models import Campaign, Template, CampaignStatus, TemplateCategory
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

async def seed():
    # Connect to DB (using workaround settings from database.py)
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        print("❌ MONGO_URI not found in environment variables.")
        return

    try:
        client = AsyncIOMotorClient(
            MONGO_URI,
    
    try:
        client = AsyncIOMotorClient(
            MONGO_URI,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        # Verify connection
        await client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        # Initialize Beanie with explicit database
        await init_beanie(database=client.whatsapp_dashboard, document_models=[Campaign, Template])
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    print("🌱 Seeding data...")

    # Clear existing data to ensure clean state
    await Template.delete_all()
    await Campaign.delete_all()
    print("🧹 Cleared existing Templates and Campaigns.")

    # Seed Templates
    print("Creating Templates...")
    templates = [
        Template(
            name="Welcome Series #1",
            content="Hi {{1}}, welcome to our community! 🌟 We're excited to have you on board. Check out our getting started guide here: {{2}}",
            category=TemplateCategory.MARKETING,
            status="approved",
            language="en",
            components=[{
                "type": "BODY", 
                "text": "Hi {{1}}, welcome to our community! 🌟 We're excited to have you on board. Check out our getting started guide here: {{2}}"
            }]
        ),
        Template(
            name="Order Confirmation",
            content="Hello {{1}}, thank you for your order #{{2}}. Your package will be shipped within 24 hours. Track it here: {{3}}",
            category=TemplateCategory.UTILITY,
            status="approved",
            language="en",
            components=[{
                "type": "BODY", 
                "text": "Hello {{1}}, thank you for your order #{{2}}. Your package will be shipped within 24 hours. Track it here: {{3}}"
            }]
        ),
        Template(
            name="Abandoned Cart Recovery",
            content="Hi {{1}}, you left something in your cart! 🛒 Complete your purchase now and get 10% off with code SAVE10. Link: {{2}}",
            category=TemplateCategory.MARKETING,
            status="approved",
            language="en",
            components=[{
                "type": "BODY", 
                "text": "Hi {{1}}, you left something in your cart! 🛒 Complete your purchase now and get 10% off with code SAVE10. Link: {{2}}"
            }]
        ),
        Template(
            name="2FA Code",
            content="Your verification code is {{1}}. Do not share this code with anyone.",
            category=TemplateCategory.UTILITY,
            status="approved",
            language="en",
            components=[{
                "type": "BODY", 
                "text": "Your verification code is {{1}}. Do not share this code with anyone."
            }]
        ),
        Template(
            name="Event Invitation",
            content="You're invited! 📅 Join us for our exclusive webinar on {{1}} at {{2}}. Reserve your spot: {{3}}",
            category=TemplateCategory.MARKETING,
            status="rejected",
            language="en",
            components=[{
                "type": "BODY", 
                "text": "You're invited! 📅 Join us for our exclusive webinar on {{1}} at {{2}}. Reserve your spot: {{3}}"
            }]
        ),
        Template(
            name="Support Ticket Update",
            content="Dear {{1}}, your support ticket #{{2}} has been updated. Status: {{3}}. View details: {{4}}",
            category=TemplateCategory.UTILITY,
            status="approved",
            language="en",
            components=[{
                "type": "BODY", 
                "text": "Dear {{1}}, your support ticket #{{2}} has been updated. Status: {{3}}. View details: {{4}}"
            }]
        )
    ]
    await Template.insert_many(templates)
    print(f"✅ Added {len(templates)} templates.")

    # Seed Campaigns
    print("Creating Campaigns...")
    campaigns = [
        Campaign(
            name="Black Friday Sale",
            status=CampaignStatus.COMPLETED,
            stats={"sent": 5000, "delivered": 4950, "read": 3200, "total": 5000},
            total_contacts=5000,
            sent_count=5000,
            delivered_count=4950,
            read_count=3200
        ),
        Campaign(
            name="Weekly Newsletter - Dec",
            status=CampaignStatus.SENDING,
            stats={"sent": 1200, "delivered": 1100, "read": 450, "total": 2500},
            total_contacts=2500,
            sent_count=1200,
            delivered_count=1100,
            read_count=450
        ),
        Campaign(
            name="Product Launch: Model X",
            status=CampaignStatus.SCHEDULED,
            stats={"sent": 0, "delivered": 0, "read": 0, "total": 10000},
            total_contacts=10000,
            sent_count=0,
            delivered_count=0,
            read_count=0
        ),
        Campaign(
            name="Inactive User Reactivation",
            status=CampaignStatus.DRAFT,
            stats={"sent": 0, "delivered": 0, "read": 0, "total": 0},
            total_contacts=0,
            sent_count=0,
            delivered_count=0,
            read_count=0
        ),
        Campaign(
            name="Webinar Reminders",
            status=CampaignStatus.COMPLETED,
            stats={"sent": 300, "delivered": 298, "read": 250, "total": 300},
            total_contacts=300,
            sent_count=300,
            delivered_count=298,
            read_count=250
        ),
         Campaign(
            name="Beta Testing Invite",
            status=CampaignStatus.FAILED,
            stats={"sent": 50, "delivered": 10, "read": 5, "total": 50},
            total_contacts=50,
            sent_count=50,
            delivered_count=10,
            read_count=5
        )
    ]
    # Iterate to safe insert
    for c in campaigns:
        await c.insert()
    print(f"✅ Added {len(campaigns)} campaigns.")

    print("🌱 Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
