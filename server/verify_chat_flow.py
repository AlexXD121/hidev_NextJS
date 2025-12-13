import requests
import sys

BASE_URL = "http://localhost:8000"
EMAIL = "admin@hidevs.com"
PASSWORD = "password123"

def print_pass(msg):
    print(f"\033[92m✅ {msg}\033[0m")

def print_fail(msg):
    print(f"\033[91m❌ {msg}\033[0m")
    sys.exit(1)

def verify_chat_flow():
    print(f"Testing Chat Flow on {BASE_URL}...")
    session = requests.Session()

    # 1. Login
    try:
        auth_payload = {"username": EMAIL, "password": PASSWORD} # Assuming standard OAuth2 form or similar, but prompt says login as agent. 
        # Checking if it's JSON or Form data based on standard FastAPI. Usually /auth/login is POST.
        # Let's try standard JSON login if defined, or OAuth2 form.
        # Based on previous context (verify_system.py), let's assume /auth/login JSON or form.
        # If standard FastAPI simple-auth:
        res = session.post(f"{BASE_URL}/api/auth/login", json={"email": EMAIL, "password": PASSWORD})
        
        if res.status_code == 401:
            print("Login failed (401). Attempting to register...")
            reg_res = session.post(f"{BASE_URL}/api/auth/register", json={
                "name": "Admin User",
                "email": EMAIL,
                "password": PASSWORD
            })
            if reg_res.status_code == 200:
                print_pass("Registered new admin user")
                # Retry login
                res = session.post(f"{BASE_URL}/api/auth/login", json={"email": EMAIL, "password": PASSWORD})
            else:
                 print(f"Registration failed: {reg_res.text}")

        if res.status_code != 200:
            print_fail(f"Login failed: {res.text}")
        
        token = res.json().get("access_token") or res.json().get("token")
        if not token:
            print_fail("No token returned")
        
        headers = {"Authorization": f"Bearer {token}"}
        print_pass("Login successful")

    except Exception as e:
        print_fail(f"Login exception: {str(e)}")

    # 2. Create Dummy Contact
    contact_id = ""
    try:
        contact_payload = {
            "name": "Test Client",
            "phone": "+1234567890",
            "email": "testclient@example.com",
            "tags": ["test"]
        }
        res = requests.post(f"{BASE_URL}/api/contacts/", json=contact_payload, headers=headers)
        if res.status_code not in [200, 201]:
             print_fail(f"Create Contact failed: {res.text}")
        
        contact = res.json()
        print(f"DEBUG Response: {contact}")
        contact_id = contact.get("id") or contact.get("_id")
        if not contact_id:
             print_fail(f"ID not found in contact response: {contact}")

        print_pass(f"Created Contact: {contact['name']} (ID: {contact_id})")
    except Exception as e:
        print_fail(f"Create Contact exception: {str(e)}")

    # 3. Send Message
    try:
        msg_payload = {
            "chatId": contact_id, # Assuming chatId can be contactId for first message or handled by backend
            "text": "Hello, this is a test message",
            "type": "text",
            "senderId": "me"
        }
        # Note: Prompt said POST /api/chats/{contact_id}/messages
        # Adjust URL to match prompt requirement
        res = requests.post(f"{BASE_URL}/api/chats/{contact_id}/messages", json=msg_payload, headers=headers)
        
        # Fallback if the prompt's URL structure was slightly off from actual implementation, 
        # but let's stick to prompt first or try common path if 404.
        if res.status_code == 404:
             # Maybe it's /chats/{id}/messages without /api prefix if BASE_URL has /api? 
             # Or maybe standard path /chats/...
             res = requests.post(f"{BASE_URL}/chats/{contact_id}/messages", json=msg_payload, headers=headers)

        if res.status_code not in [200, 201]:
            print_fail(f"Send Message failed: {res.status_code} {res.text}")
        
        print_pass("Message sent successfully")
    except Exception as e:
        print_fail(f"Send Message exception: {str(e)}")

    # 4. Fetch Chats
    try:
        # Prompt said GET /api/chats
        res = requests.get(f"{BASE_URL}/api/chats", headers=headers)
        if res.status_code == 404:
             res = requests.get(f"{BASE_URL}/chats", headers=headers)

        if res.status_code != 200:
            print_fail(f"Fetch Chats failed: {res.text}")
        
        chats = res.json()
        print_pass(f"Fetched {len(chats)} chats")

        # 5. Verify Message
        found = False
        for chat in chats:
            # Check if this is the chat with our contact
            # Adjust check based on chat structure (contactId or contact object)
            c_id = chat.get("contactId") or chat.get("contact", {}).get("id") or chat.get("contact", {}).get("_id")
            
            print(f"Checking chat for contact {c_id} (Target: {contact_id})")
            
            if c_id == contact_id:
                last_msg = chat.get("lastMessage")
                print(f"  > Last Msg: {last_msg}")
                if last_msg and last_msg.get("text") == "Hello, this is a test message":
                    found = True
                    break
        
        if found:
            print_pass("✅ Chat Flow Works: New message found in chat list.")
        else:
            print_fail("New message NOT found in chat list.")

    except Exception as e:
        print_fail(f"Fetch verification exception: {str(e)}")

if __name__ == "__main__":
    verify_chat_flow()
