import asyncio
import os
from database import init_db
from models import Campaign, Template, CampaignStatus, TemplateCategory
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

async def seed():
    # Connect to DB (using workaround settings from database.py)
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://doadmin:4098K67i2XfA51jZ@db-mongodb-blr1-89302-60298a58.mongo.ondigitalocean.com/whatsapp-dashboard?tls=true&authSource=admin&replicaSet=db-mongodb-blr1-89302")
    
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

    # Seed Templates
    templates_count = await Template.count()
    if templates_count == 0:
        print("Creating Templates...")
        templates = [
            Template(
                name="Welcome Packet",
                content="Hi {{1}}, welcome! Here is your starter packet.",
                category=TemplateCategory.MARKETING,
                status="approved",
                language="en",
                components=[{"type": "BODY", "text": "Hi {{1}}, welcome! Here is your starter packet."}]
            ),
            Template(
                name="Order Shipped",
                content="Your order {{1}} has shipped.",
                category=TemplateCategory.UTILITY,
                status="approved",
                language="en",
                components=[{"type": "BODY", "text": "Your order {{1}} has shipped."}]
            ),
             Template(
                name="Holiday Promo",
                content="Happy Holidays! Use code HOLIDAY for 20% off.",
                category=TemplateCategory.MARKETING,
                status="approved",
                language="en",
                components=[{"type": "BODY", "text": "Happy Holidays! Use code HOLIDAY for 20% off."}]
            )
        ]
        await Template.insert_many(templates)
        print(f"✅ Added {len(templates)} templates.")
    else:
        print("Templates already exist. Skipping.")

    # Seed Campaigns
    campaigns_count = await Campaign.count()
    if campaigns_count == 0:
        print("Creating Campaigns...")
        campaigns = [
            Campaign(
                name="Summer Sale Blast",
                status=CampaignStatus.COMPLETED,
                stats={"sent": 1200, "delivered": 1150, "read": 980, "total": 1200},
                total_contacts=1200
            ),
            Campaign(
                name="New Product Launch",
                status=CampaignStatus.DRAFT,
                stats={"sent": 0, "delivered": 0, "read": 0, "total": 500},
                total_contacts=500
            ),
             Campaign(
                name="Customer Feedback",
                status=CampaignStatus.SCHEDULED,
                stats={"sent": 0, "delivered": 0, "read": 0, "total": 100},
                total_contacts=100
             )
        ]
        # Iterate to safe insert (some might have extra fields in model not in params)
        for c in campaigns:
            await c.insert()
        print(f"✅ Added {len(campaigns)} campaigns.")
    else:
         print("Campaigns already exist. Skipping.")

    print("🌱 Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
