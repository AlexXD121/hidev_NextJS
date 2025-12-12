from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import User, Contact, Campaign, Message
import os
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    uri = os.getenv("MONGO_URI")
    if not uri:
        print("Warning: MONGO_URI not found in environment variables.")
        # Fallback (optional, but better to fail if missing) or empty handling
    
    client = AsyncIOMotorClient(uri)
    
    # Ping to confirm connection (Optional but requested logic)
    try:
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"MongoDB Configuration Error: {e}")

    # Initialize Beanie (Database Name: whatsapp_dashboard)
    await init_beanie(database=client.whatsapp_dashboard, document_models=[
        User,
        Contact,
        Campaign,
        Message
    ])
