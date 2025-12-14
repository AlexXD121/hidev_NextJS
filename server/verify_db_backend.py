import requests
import sys
import random
import string
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"

# ANSI Colors
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_pass(message):
    print(f"{Colors.OKGREEN}✅ PASS:{Colors.ENDC} {message}")

def print_fail(message, details=""):
    print(f"{Colors.FAIL}❌ FAIL:{Colors.ENDC} {message}")
    if details:
        print(f"{Colors.FAIL}   Details: {details}{Colors.ENDC}")
    sys.exit(1)

def print_info(message):
    print(f"{Colors.OKBLUE}ℹ️  INFO:{Colors.ENDC} {message}")

def print_section(title):
    print(f"\n{Colors.HEADER}{Colors.BOLD}=== {title} ==={Colors.ENDC}")

# Helper to generate random string
def random_string(length=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def run_verification():
    print_section("1. 🔌 Connection & Health")
    
    # 1.1 Check Base URL
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            print_pass(f"Hit {BASE_URL} - Status 200")
        else:
            print_fail(f"Hit {BASE_URL} returned {response.status_code}")
    except requests.exceptions.ConnectionError:
        print_fail(f"Could not connect to {BASE_URL}. Is the server running?")

    # 1.2 Check Health (Optional, assuming root / serves as health)
    # If /api/health exists, we could test it. adhering to 'Action: Hit GET /'
    
    print_section("2. 👤 User Data Persistence (Auth)")
    
    # 2.1 Register
    email = f"test_db_{random_string()}@example.com"
    password = "password123"
    payload = {
        "name": "DB Tester",
        "email": email,
        "password": password
    }
    
    print_info(f"Registering User: {email}")
    reg_response = requests.post(f"{API_URL}/auth/register", json=payload)
    
    if reg_response.status_code == 200 or reg_response.status_code == 201:
        print_pass("Registration Successful")
    else:
        print_fail("Registration Failed", reg_response.text)

    # 2.2 Login
    print_info("Attempting Login...")
    login_payload = {
        "email": email,
        "password": password
    }
    # Using form-data usually for OAuth2PasswordRequestForm, but let's check assumptions. 
    # Usually FastAPI OAuth2 expects form data.
    # Let's try Form Data first as per standard FastAPI dependencies.py logic
    # But wait, previous edits showed `LoginRequest` model which implies JSON?
    # Let's check typical use. If models.py has LoginRequest, it's likely JSON.
    # Let's try JSON first based on standard modern practice in this app.
    
    login_response = requests.post(f"{API_URL}/auth/login", json=login_payload)
    
    if login_response.status_code != 200:
         # Fallback to form data if JSON fails (typical for OAuth2)
         # But wait, looking at my history, I saw `server/routers/auth.py` and it seemed to use a Pydantic model for login.
         # So JSON is likely correct.
         print_fail("Login Failed", login_response.text)

    data = login_response.json()
    if "token" not in data:
        print_fail("No token in login response", details=json.dumps(data))
    
    token = data["token"]
    print_pass("Login Successful - Token Received")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }

    print_section("3. 📝 CRUD Data Integrity (Contacts)")
    
    # 3.1 Create Contact
    contact_payload = {
        "name": "DB Test",
        "phone": "+1234567890",
        "email": "dbtest@example.com", 
        "tags": ["test"]
    }
    print_info("Creating Contact...")
    create_resp = requests.post(f"{API_URL}/contacts", json=contact_payload, headers=headers)
    
    if create_resp.status_code not in [200, 201]:
        print_fail("Create Contact Failed", create_resp.text)
        
    created_contact = create_resp.json()
    contact_id = created_contact.get("_id") or created_contact.get("id")
    if not contact_id:
        print_fail("Created contact has no ID", json.dumps(created_contact))
        
    print_pass(f"Contact Created - ID: {contact_id}")

    # 3.2 Read Contacts & Verify
    print_info("Reading Contacts...")
    list_resp = requests.get(f"{API_URL}/contacts", headers=headers)
    if list_resp.status_code != 200:
        print_fail("Get Contacts Failed", list_resp.text)
        
    contacts_list = list_resp.json()
    found = False
    for c in contacts_list:
        c_id = c.get("_id") or c.get("id")
        if c_id == contact_id:
            found = True
            break
            
    if found:
        print_pass(f"Contact {contact_id} found in list")
    else:
        print_fail(f"Contact {contact_id} NOT found in list")

    # 3.3 Update Contact
    print_info(f"Updating Contact {contact_id}...")
    update_payload = {"name": "DB Test Updated"}
    # Assuming endpoint is PATCH /contacts/{id} or PUT
    update_resp = requests.put(f"{API_URL}/contacts/{contact_id}", json=update_payload, headers=headers)
    
    if update_resp.status_code != 200:
        # Try PATCH if PUT fails? Standard is usually one or other. Let's assume PUT as per requirement prompt.
        print_fail("Update Contact Failed", update_resp.text)
        
    updated_data = update_resp.json()
    if updated_data.get("name") == "DB Test Updated":
        print_pass("Update Returned Correct Data")
    else:
        print_fail(f"Update response name mismatch: {updated_data.get('name')}")

    # 3.4 Verify Update Persistence
    print_info("Verifying Update Persistence...")
    get_single_resp = requests.get(f"{API_URL}/contacts/{contact_id}", headers=headers)
    if get_single_resp.status_code == 200:
         single_data = get_single_resp.json()
         if single_data.get("name") == "DB Test Updated":
             print_pass("Persistence Verified: Name is 'DB Test Updated'")
         else:
             print_fail(f"Persistence Failed: Name is {single_data.get('name')}")
    else:
        print_fail("Could not fetch single contact", get_single_resp.text)

    # 3.5 Delete Contact
    print_info(f"Deleting Contact {contact_id}...")
    del_resp = requests.delete(f"{API_URL}/contacts/{contact_id}", headers=headers)
    if del_resp.status_code != 200:
        print_fail("Delete Contact Failed", del_resp.text)
    print_pass("Delete Request Successful")

    # 3.6 Verify Deletion
    print_info("Verifying Deletion...")
    verify_del_resp = requests.get(f"{API_URL}/contacts/{contact_id}", headers=headers)
    if verify_del_resp.status_code == 404:
        print_pass("Deletion Verified (404 Not Found)")
    else:
        # Also check list
        list_again = requests.get(f"{API_URL}/contacts", headers=headers).json()
        ids = [c.get("_id") or c.get("id") for c in list_again]
        if contact_id in ids:
             print_fail("Deletion Failed: Contact still in list")
        else:
             print_pass("Deletion Verified (Gone from list)")

    print_section("4. 🔗 Relationship & Error Handling")

    # 4.1 Duplicate User
    print_info("Testing Duplicate Registration...")
    dup_resp = requests.post(f"{API_URL}/auth/register", json=payload)
    if dup_resp.status_code == 400:
        print_pass("Duplicate Register Blocked (400 Bad Request)")
    else:
        print_fail(f"Duplicate Register Allowed or Wrong Code: {dup_resp.status_code}")

    # 4.2 Bad ID Check
    fake_id = "507f1f77bcf86cd799439011"
    print_info(f"Testing Bad ID Access: {fake_id}")
    bad_id_resp = requests.get(f"{API_URL}/contacts/{fake_id}", headers=headers)
    
    if bad_id_resp.status_code == 404:
        print_pass("Bad ID Handled Correctly (404 Not Found)")
    else:
        print_fail(f"Bad ID returned unexpected code: {bad_id_resp.status_code}")

    print_section("Summary")
    print(f"{Colors.OKGREEN}{Colors.BOLD}🎉 ALL BACKEND CHECKS PASSED!{Colors.ENDC}")

if __name__ == "__main__":
    try:
        run_verification()
    except Exception as e:
        print_fail("Unexpected Script Error", str(e))
