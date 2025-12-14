import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import User
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

async def create_test_user():
    print("Connecting to DB...")
    MONGO_URI = os.getenv("MONGO_URI")
    client = AsyncIOMotorClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
    
    # Init Beanie
    await init_beanie(database=client.whatsapp_dashboard, document_models=[User])
    
    email = "test_responsive@example.com"
    password = "password123"
    
    # Hash using bcrypt directly
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
    
    # Check if exists
    existing = await User.find_one(User.email == email)
    if existing:
        print(f"User {email} already exists. Updating password...")
        existing.password_hash = hashed
        await existing.save()
    else:
        print(f"Creating user {email}...")
        user = User(
            name="Responsive Tester",
            email=email,
            password_hash=hashed,
            role="admin",
            avatar="https://github.com/shadcn.png"
        )
        await user.insert()
    
    print("Test user ready.")

if __name__ == "__main__":
    asyncio.run(create_test_user())
