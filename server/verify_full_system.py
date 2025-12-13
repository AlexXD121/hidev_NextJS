import asyncio
import os
from colorama import init, Fore, Style
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import Campaign, Template, User

# Initialize colorama
init()

async def verify_system():
    print(f"{Fore.CYAN}🚀 Starting System Cross-Verification (Direct DB Mode)...{Style.RESET_ALL}\n")

    # Connect to DB (using workaround settings from database.py/seed_data.py)
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://doadmin:4098K67i2XfA51jZ@db-mongodb-blr1-89302-60298a58.mongo.ondigitalocean.com/whatsapp-dashboard?tls=true&authSource=admin&replicaSet=db-mongodb-blr1-89302")
    
    try:
        client = AsyncIOMotorClient(
            MONGO_URI,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        await client.admin.command('ping')
        print(f"{Fore.GREEN}✅ Connected to MongoDB.{Style.RESET_ALL}\n")
        
        await init_beanie(database=client.whatsapp_dashboard, document_models=[Campaign, Template, User])
    except Exception as e:
        print(f"{Fore.RED}❌ Database Connection Failed: {e}{Style.RESET_ALL}")
        return

    # 1. User Verification
    print(f"{Fore.YELLOW}👤 Verifying Users...{Style.RESET_ALL}")
    users_count = await User.count()
    print(f"   Found {users_count} users.")
    if users_count > 0:
        first_user = await User.find_one({})
        print(f"   Sample User: {first_user.name} ({first_user.email})")

    # 2. Templates Verification (Check for Duplicates)
    print(f"{Fore.YELLOW}📝 Verifying Templates (No Duplicates)...{Style.RESET_ALL}")
    templates = await Template.find_all().to_list()
    ids = [str(t.id) for t in templates]
    print(f"   Fetched {len(templates)} templates.")
    
    if len(ids) != len(set(ids)):
            print(f"{Fore.RED}❌ DUPLICATE TEMPLATES FOUND! IDs: {ids}{Style.RESET_ALL}")
            # Optional: Deduplicate logic could go here if requested
    else:
            print(f"{Fore.GREEN}✅ No Duplicate Template IDs found.{Style.RESET_ALL}")

    # Content check
    names = [t.name for t in templates]
    if "Welcome Packet" in names:
        print(f"{Fore.GREEN}✅ 'Welcome Packet' found.{Style.RESET_ALL}\n")
    else:
        print(f"{Fore.RED}⚠️ 'Welcome Packet' seed data missing?{Style.RESET_ALL}\n")


    # 3. Campaigns Verification (No Duplicates)
    print(f"{Fore.YELLOW}📢 Verifying Campaigns (No Duplicates)...{Style.RESET_ALL}")
    campaigns = await Campaign.find_all().to_list()
    ids = [str(c.id) for c in campaigns]
    print(f"   Fetched {len(campaigns)} campaigns.")

    if len(ids) != len(set(ids)):
            print(f"{Fore.RED}❌ DUPLICATE CAMPAIGNS FOUND! IDs: {ids}{Style.RESET_ALL}")
    else:
            print(f"{Fore.GREEN}✅ No Duplicate Campaign IDs found.{Style.RESET_ALL}")
    
    # Content check
    names = [c.name for c in campaigns]
    if "Summer Sale Blast" in names:
        print(f"{Fore.GREEN}✅ 'Summer Sale Blast' found.{Style.RESET_ALL}\n")
    else:
        print(f"{Fore.RED}⚠️ 'Summer Sale Blast' seed data missing?{Style.RESET_ALL}\n")

    print(f"{Fore.CYAN}🏁 Verification Complete.{Style.RESET_ALL}")

if __name__ == "__main__":
    asyncio.run(verify_system())
