import requests
import random
import string
import sys

BASE_URL = "http://localhost:8000"

def log(step, success, details=""):
    icon = "✅" if success else "❌"
    print(f"{icon} {step}: {details}")
    if not success:
        sys.exit(1)

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def verify_system():
    print("🧪 Starting System Verification...\n")

    # 1. Health Check
    try:
        r = requests.get(f"{BASE_URL}/")
        success = r.status_code == 200
        log("Health Check", success, f"Status {r.status_code}")
    except Exception as e:
        log("Health Check", False, f"Failed to connect: {e}")

    # 2. Auth Flow
    email = f"test_{random_string()}@example.com"
    password = "password123"
    name = "Test User"

    # Register
    try:
        payload = {"name": name, "email": email, "password": password}
        r = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
        success = r.status_code == 200
        log("Register User", success, f"{email}")
        if not success: print(r.text)
    except Exception as e:
        log("Register User", False, str(e))

    # Login
    token = None
    try:
        payload = {"email": email, "password": password}
        r = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        data = r.json()
        token = data.get("token")
        success = r.status_code == 200 and token
        log("Login & Get Token", success)
    except Exception as e:
        log("Login", False, str(e))

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Data Flow
    
    # Get Profile
    try:
        r = requests.get(f"{BASE_URL}/api/users/me", headers=headers)
        data = r.json()
        # Check backend field match. Backend has avatar_url, Frontend might expect avatar. 
        # We just verify we got the user.
        success = r.status_code == 200 and data["email"] == email
        log("Fetch Profile (/users/me)", success)
    except Exception as e:
        log("Fetch Profile", False, str(e))

    # Create Contact
    try:
        contact_payload = {
            "name": "Verify Bot",
            "phone": f"+1{random_string(10)}", # Mock phone
            "tags": ["verification", "test"],
            "avatar": "https://example.com/avatar.png"
        }
        r = requests.post(f"{BASE_URL}/api/contacts/", json=contact_payload, headers=headers)
        success = r.status_code == 200
        log("Create Contact", success)
    except Exception as e:
        log("Create Contact", False, str(e))

    # Fetch Templates
    try:
        r = requests.get(f"{BASE_URL}/api/templates/", headers=headers)
        data = r.json()
        # Verify seed data exists (length > 0)
        success = r.status_code == 200 and len(data) > 0
        log("Fetch Templates", success, f"Found {len(data)} templates")
    except Exception as e:
        log("Fetch Templates", False, str(e))

    # Fetch Sheets
    try:
        r = requests.get(f"{BASE_URL}/api/sheets/", headers=headers)
        # Verify mock sheets
        success = r.status_code == 200
        log("Fetch Sheets", success)
    except Exception as e:
        log("Fetch Sheets", False, str(e))

    print("\n✅ SYSTEM VERIFIED SUCCESSFULLY")

if __name__ == "__main__":
    verify_system()
