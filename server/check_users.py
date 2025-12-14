
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import User
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

async def check_users():
    print("Connecting to DB...")
    MONGO_URI = os.getenv("MONGO_URI")
    client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
    
    # Init Beanie
    await init_beanie(database=client.whatsapp_dashboard, document_models=[User])
    
    users = await User.find_all().to_list()
    print(f"Found {len(users)} users.")
    
    for user in users:
        print(f"\nUser: {user.email}")
        print(f"Hash: {user.password_hash}")
        
        # Try checking against '12345678'
        try:
            if bcrypt.checkpw("12345678".encode(), user.password_hash.encode()):
                print("✅ Matches '12345678'")
                continue
        except Exception as e:
            print(f"Error checking '12345678': {e}")
            
        # Try checking against 'password123'
        try:
            if bcrypt.checkpw("password123".encode(), user.password_hash.encode()):
                print("✅ Matches 'password123'")
                continue
        except Exception as e:
            print(f"Error checking 'password123': {e}")
            
        print("❌ Does not match known passwords.")

if __name__ == "__main__":
    asyncio.run(check_users())
