from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import User, Contact, Campaign, Message
import os
from dotenv import load_dotenv
import certifi # Kept for safety, but unused in the connection below
import traceback

load_dotenv()

async def init_db():
    print("🔄 [1/3] Loading Environment Variables...")
    uri = os.getenv("MONGO_URI")
    
    if not uri:
        print("❌ CRITICAL ERROR: 'MONGO_URI' is missing from .env file!")
        return

    print(f"🔄 [2/3] Connecting to MongoDB Atlas (Workaround Mode)...")

    try:
        # 🛡️ WINDOWS SSL WORKAROUND:
        # 1. We DROP 'tlsCAFile' (parsing it was causing the crash).
        # 2. We ADD 'tls=True' (Atlas requires encryption).
        # 3. We ADD 'tlsAllowInvalidCertificates=True' (Skip the verification step).
        client = AsyncIOMotorClient(
            uri,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        
        # Test the connection
        await client.admin.command('ping')
        print("✅ [SUCCESS] Connection Established! (SSL Verification Skipped)")

        print("🔄 [3/3] Initializing Beanie Models...")
        await init_beanie(database=client.whatsapp_dashboard, document_models=[
            User,
            Contact,
            Campaign,
            Message
        ])
        print("✅ [SUCCESS] Database & Models Ready!")

    except Exception as e:
        print("\n🔴🔴🔴 DATABASE CONNECTION FAILED 🔴🔴🔴")
        print(f"❌ Error Type: {type(e).__name__}")
        print(f"❌ Error Message: {str(e)}")
        print("\n👇 FULL TRACEBACK:")
        traceback.print_exc()
        print("---------------------------------------------------\n")