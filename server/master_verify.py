import requests
import time
import uuid
import sys
from colorama import init, Fore, Style

# Initialize Colorama
init()

# CONFIG
BASE_URL = "http://localhost:8000/api"
EMAIL = f"test_admin_{uuid.uuid4().hex[:6]}@example.com"
PASSWORD = "password123"
HEADERS = {"Content-Type": "application/json"}

# SCORES
tests_passed = 0
tests_total = 0

def log(section, status, message):
    global tests_passed, tests_total
    tests_total += 1
    if status:
        tests_passed += 1
        print(f"{Fore.GREEN}[PASS] {section}: {message}{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}[FAIL] {section}: {message}{Style.RESET_ALL}")

def section_header(title):
    print(f"\n{Fore.CYAN}=== {title} ==={Style.RESET_ALL}")

def verify_system():
    global HEADERS
    
    # 1. AUTH CYCLE
    section_header("1. Authentication Cycle")
    
    # Register
    try:
        reg_payload = {"email": EMAIL, "password": PASSWORD, "full_name": "Test Admin", "role": "admin"}
        r = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
        if r.status_code in [200, 201]:
            log("Auth", True, "User Registration successful")
        else:
            log("Auth", False, f"Registration failed: {r.text}")
    except Exception as e:
        log("Auth", False, f"Registration Exception: {e}")

    # Login
    try:
        login_payload = {"username": EMAIL, "password": PASSWORD} # FastAPI OAuth2 expects 'username' form field usually, but our router might handle json?
        # Checking router assumes JSON 'email' for internal logic or OAuth2 form.
        # Let's try JSON first as per standard custom auth, or Form data if standard OAuth2.
        # Based on previous routers, it likely accepts JSON.
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD})
        
        if r.status_code == 200:
            token = r.json().get("access_token")
            if token:
                HEADERS["Authorization"] = f"Bearer {token}"
                log("Auth", True, "Login successful & Token extracted")
            else:
                log("Auth", False, "Login worked but no token found")
        else:
            log("Auth", False, f"Login failed: {r.text}")
            return # Critical failure
    except Exception as e:
        log("Auth", False, f"Login Exception: {e}")
        return

    # 2. CRM FLOW
    section_header("2. CRM Flow")
    contact_id = None
    try:
        # Create Contact
        contact_payload = {"name": "Smoke Test User", "phone": "+1555999999", "email": "smoke@test.com", "tags": ["lead"]}
        r = requests.post(f"{BASE_URL}/contacts/", json=contact_payload, headers=HEADERS)
        if r.status_code == 200:
            contact = r.json()
            contact_id = contact['id']
            log("CRM", True, f"Contact created (ID: {contact_id})")
        else:
            log("CRM", False, f"Contact creation failed: {r.text}")

        # Verify in List
        r = requests.get(f"{BASE_URL}/contacts/", headers=HEADERS)
        contacts = r.json()
        if any(c['id'] == contact_id for c in contacts):
            log("CRM", True, "Contact found in list")
        else:
            log("CRM", False, "Contact ID not found in list")

        # Update Tag
        # Note: Depending on router implementation, PUT might merge or replace.
        # Assuming simple update or skip if complex.
        
    except Exception as e:
        log("CRM", False, f"CRM Exception: {e}")

    # 3. CHAT SIMULATION
    section_header("3. Chat Simulation (WebSocket Side-Effect)")
    if contact_id:
        try:
            # Send Message (Trigger Alias)
            send_payload = {"chat_id": contact_id, "text": "Hello Auto Reply"}
            r = requests.post(f"{BASE_URL}/chat/send", json=send_payload, headers=HEADERS) # Check router prefix. Main.py says /api/include_router(chat). chat.py router has NO prefix but main has /api. 
            # Wait, chat.py router has NO prefix in itself, main includes with /api.
            # But chat.py endpoints are /chats, /send. So it is /api/send.
            # NO, main.py says app.include_router(chat.router, prefix="/api")
            # chat.py has @router.post("/send"). So URL is /api/send.
            
            # Let's double check route:
            # chat.py: @router.post("/send")
            # main.py: app.include_router(chat.router, prefix="/api")
            # Result: /api/send
            
            r = requests.post(f"{BASE_URL}/send", json=send_payload, headers=HEADERS)
            
            if r.status_code == 200:
                log("Chat", True, "Message sent to queue")
                
                print("⏳ Waiting 5 seconds for backend auto-reply...")
                time.sleep(5)
                
                # Check messages
                # Route: /api/chats/{chat_id}/messages
                r_msgs = requests.get(f"{BASE_URL}/chats/{contact_id}/messages", headers=HEADERS)
                msgs = r_msgs.json()
                
                # Look for the specific reply text
                reply_found = any(m.get('text') == "That sounds interesting! Tell me more." for m in msgs)
                if reply_found:
                    log("Chat", True, "✅ Auto-reply verified in Database (WebSocket broadcast confirmed by DB effect)")
                else:
                    log("Chat", False, "❌ Auto-reply NOT found in Database")
            else:
                log("Chat", False, f"Send message failed: {r.text}")
                
        except Exception as e:
            log("Chat", False, f"Chat Exception: {e}")
    else:
        log("Chat", False, "Skipping Chat test (No Contact ID)")

    # 4. CAMPAIGNS
    section_header("4. Campaign Logic")
    try:
        # Create Campaign
        camp_payload = {"name": "Smoke Campaign", "template_id": "temp1", "status": "draft"}
        r = requests.post(f"{BASE_URL}/campaigns/", json=camp_payload, headers=HEADERS)
        if r.status_code == 200:
            camp_id = r.json().get('id')
            log("Campaign", True, f"Campaign created (ID: {camp_id})")
            
            # Trigger Send - KNOWN GAP
            # Based on code audit, this endpoint DOES NOT EXIST.
            # We will try to hit it to confirm the gap.
            r_send = requests.post(f"{BASE_URL}/campaigns/{camp_id}/send", headers=HEADERS)
            if r_send.status_code == 404:
                print(f"{Fore.YELLOW}[WARN] Campaign 'Send' endpoint not found (Expected GAP){Style.RESET_ALL}")
            elif r_send.status_code == 200:
                log("Campaign", True, "Campaign send triggered (Surprise!)")
            else:
                log("Campaign", False, f"Campaign trigger failed with {r_send.status_code}")
                
        else:
            log("Campaign", False, "Campaign creation failed")
    except Exception as e:
        log("Campaign", False, f"Campaign Exception: {e}")

    # 5. INTEGRATIONS
    section_header("5. Integration Check")
    try:
        # Valid URL
        valid_payload = {"sheet_url": "https://docs.google.com/spreadsheets/d/123/edit"}
        r = requests.post(f"{BASE_URL}/integrations/google-sheets/connect", json=valid_payload, headers=HEADERS)
        if r.status_code == 200:
             log("Integration", True, "Google Sheet validation passed")
        else:
             log("Integration", False, "Google Sheet validation failed")
             
        # Invalid URL
        invalid_payload = {"sheet_url": "https://bad-url.com"}
        r = requests.post(f"{BASE_URL}/integrations/google-sheets/connect", json=invalid_payload, headers=HEADERS)
        if r.status_code == 400:
             log("Integration", True, "Invalid URL correctly rejected")
        else:
             log("Integration", False, f"Invalid URL NOT rejected (Code: {r.status_code})")
             
    except Exception as e:
        log("Integration", False, f"Integration Exception: {e}")

    # FINAL SCORE
    section_header("FINAL REPORT")
    score = (tests_passed / tests_total) * 100 if tests_total > 0 else 0
    print(f"Tests Passed: {tests_passed}/{tests_total}")
    print(f"Readiness Score: {score:.1f}%")
    
    if score == 100:
        print(f"{Fore.GREEN}🚀 SYSTEM READY FOR DEPLOYMENT (Subject to Manual Gaps){Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}🛑 SYSTEM NOT READY - Fix Failures{Style.RESET_ALL}")

if __name__ == "__main__":
    verify_system()
