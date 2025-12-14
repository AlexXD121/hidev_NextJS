import requests
import json
import sys
import uuid

# Configuration
BASE_URL = "http://localhost:8000/api"
EMAIL = "test_responsive@example.com" # Using a known user if possible, or register new
PASSWORD = "password123"

# Colors
class Colors:
    OKGREEN = '\033[92m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_pass(msg):
    print(f"{Colors.OKGREEN}✅ PASS:{Colors.ENDC} {msg}")

def print_fail(msg, details=""):
    print(f"{Colors.FAIL}❌ FAIL:{Colors.ENDC} {msg}")
    if details:
        print(f"   Details: {details}")
    sys.exit(1)

def run():
    print(f"\n{Colors.BOLD}🚀 Starting Full-Stack Integration Verification{Colors.ENDC}\n")

    # 1. Login (Simulate Frontend Login Page)
    print("🔹 Step 1: Simulating Login...")
    login_url = f"{BASE_URL}/auth/login"
    try:
        # Try known user first
        resp = requests.post(login_url, json={"email": EMAIL, "password": PASSWORD})
        
        # If 401, maybe user doesn't exist (if seed didn't run), so register fallback
        if resp.status_code == 401:
            print("   (User not found, registering temporary user...)")
            temp_email = f"temp_{uuid.uuid4().hex[:8]}@example.com"
            reg_resp = requests.post(f"{BASE_URL}/auth/register", json={
                "name": "Integration Test",
                "email": temp_email,
                "password": PASSWORD
            })
            if reg_resp.status_code != 200:
                print_fail("Registration Failed", reg_resp.text)
            
            # Login with new user
            resp = requests.post(login_url, json={"email": temp_email, "password": PASSWORD})

        if resp.status_code != 200:
            print_fail("Login Failed", resp.text)
            
        data = resp.json()
        token = data.get("token") or data.get("access_token")
        if not token:
             print_fail("No token received", json.dumps(data))
             
        print_pass("Login Successful & Token Captured")
        
    except Exception as e:
        print_fail("Network/Script Error during Login", str(e))

    # Headers for subsequent requests (Simulating Axios Interceptor)
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Fetch Initial Contacts (Simulating Contacts Page Load)
    print("\n🔹 Step 2: Fetching Contacts List...")
    contacts_url = f"{BASE_URL}/contacts/" 
    # Note: real-api.ts uses trailing slash '/contacts/'
    contacts_resp = requests.get(contacts_url, headers=headers)
    
    if contacts_resp.status_code != 200:
        print_fail("Fetch Contacts Failed", contacts_resp.text)
        
    initial_count = len(contacts_resp.json())
    print_pass(f"Fetched {initial_count} existing contacts")

    # 3. Create New Contact (Simulating 'Add Contact' Modal)
    print("\n🔹 Step 3: Creating New Contact...")
    new_contact = {
        "name": "Integration Test User",
        "phone": "+999888777",
        "email": f"integ_{uuid.uuid4().hex[:6]}@test.com",
        "tags": ["integration", "test"]
    }
    
    create_resp = requests.post(contacts_url, json=new_contact, headers=headers)
    if create_resp.status_code not in [200, 201]:
        print_fail("Create Contact Failed", create_resp.text)
        
    created_data = create_resp.json()
    created_id = created_data.get("_id") or created_data.get("id")
    print_pass(f"Contact Created (ID: {created_id})")

    # 4. Verify Persistence (Simulating Page Refresh / Refetch)
    print("\n🔹 Step 4: Verifying Data Persistence...")
    verify_resp = requests.get(contacts_url, headers=headers)
    if verify_resp.status_code != 200:
        print_fail("Verify Fetch Failed", verify_resp.text)
        
    current_contacts = verify_resp.json()
    found = any((c.get("_id") or c.get("id")) == created_id for c in current_contacts)
    
    if found:
        print_pass("New Contact successfully found in subsequent fetch!")
    else:
        print_fail("New Contact NOT found in list (Persistence Issue)")
        
    # Cleanup
    print("\n🔹 Step 5: Cleanup...")
    del_resp = requests.delete(f"{contacts_url}{created_id}", headers=headers)
    if del_resp.status_code == 200:
        print_pass("Test Data Cleaned Up")
    else:
        print(f"   ⚠️ Cleanup failed: {del_resp.status_code}")

    print(f"\n{Colors.OKGREEN}{Colors.BOLD}🎉 INTEGRATION VERIFICATION SUCCESSFUL!{Colors.ENDC}\n")

if __name__ == "__main__":
    run()
