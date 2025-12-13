import requests
import sys
import time
import uuid
import random
from colorama import init, Fore, Style

# Initialize Colorama
init(autoreset=True)

# Configuration
BASE_URL = "http://localhost:8000/api"
EMAIL_SUFFIX = uuid.uuid4().hex[:6]
ADMIN_EMAIL = f"admin_{EMAIL_SUFFIX}@master-test.com"
ADMIN_PASSWORD = "securepassword123"
ADMIN_NAME = "Master QA Admin"

HEADERS = {}

def section_header(title):
    print(f"\n{Fore.CYAN}{Style.BRIGHT}{'='*10} {title} {'='*10}")

def log(step, status, message):
    if status:
        print(f"{Fore.GREEN}[PASS] {step}: {message}")
    else:
        print(f"{Fore.RED}[FAIL] {step}: {message}")
        print(f"{Fore.RED}❌ Aborting Protocol due to critical failure.")
        sys.exit(1)
    sys.stdout.flush()

def main():
    print(f"{Fore.YELLOW}{Style.BRIGHT}🛡️ STARTING MASTER SYSTEM VERIFICATION PROTOCOL 🛡️")
    print(f"Target: {BASE_URL}")
    print(f"Test Run ID: {EMAIL_SUFFIX}")

    # 1. HEALTH CHECK
    section_header("1. Health Check")
    try:
        r = requests.get(f"http://localhost:8000/") # Root is not /api
        if r.status_code == 200:
            log("API", True, "System is online")
        else:
            log("API", False, f"System down? Status: {r.status_code}")
    except Exception as e:
        log("API", False, f"Connection Failed: {e}")

    # 2. AUTH CYCLE
    section_header("2. Auth Cycle")
    try:
        # Register
        reg_payload = {"name": ADMIN_NAME, "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        r_reg = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
        if r_reg.status_code in [200, 201]:
            log("Auth", True, f"Admin Registered ({ADMIN_EMAIL})")
        else:
            log("Auth", False, f"Registration Failed: {r_reg.text}")

        # Login
        r_login = requests.post(f"{BASE_URL}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        if r_login.status_code == 200:
            data = r_login.json()
            # Handle possible key naming differences (access_token vs token)
            token = data.get("token") or data.get("access_token")
            
            if token:
                token = token.strip('"') # Strip quotes if present
                HEADERS["Authorization"] = f"Bearer {token}"
                log("Auth", True, "Login Successful & Token Acquired")
            else:
                log("Auth", False, f"Token Missing from Response: {data.keys()}")
        else:
            log("Auth", False, f"Login Failed: {r_login.status_code}")

    except Exception as e:
        log("Auth", False, f"Exception: {e}")

    # 3. CRM MODULE (CONTACTS)
    section_header("3. CRM Module (Contacts)")
    contact_ids = []
    try:
        for i in range(3):
            suffix = uuid.uuid4().hex[:4]
            payload = {
                "name": f"Test Contact {i+1} {suffix}", 
                "phone": f"+1555{suffix}", 
                "email": f"contact{i}_{suffix}@test.com", 
                "tags": ["master-qa"]
            }
            r = requests.post(f"{BASE_URL}/contacts/", json=payload, headers=HEADERS)
            if r.status_code == 200:
                data = r.json()
                cid = data.get("id") or data.get("_id")
                contact_ids.append(cid)
                print(f"   Created Contact: {cid}")
            else:
                log("CRM", False, f"Failed to create contact {i+1}: {r.text}")
        
        # Verify List
        r_list = requests.get(f"{BASE_URL}/contacts/", headers=HEADERS)
        contacts = r_list.json()
        if len(contacts) >= 3:
            log("CRM", True, f"Contact List Verified (Total: {len(contacts)})")
        else:
            log("CRM", False, "Contact list verify failed")

    except Exception as e:
        log("CRM", False, f"Exception: {e}")

    # 4. TEMPLATES MODULE
    section_header("4. Templates Module")
    try:
        t_payload = {"name": f"Master Template {EMAIL_SUFFIX}", "content": "Hello {{1}}, welcome to our platform!", "type": "text"}
        r_temp = requests.post(f"{BASE_URL}/templates/", json=t_payload, headers=HEADERS)
        if r_temp.status_code in [200, 201]:
            log("Templates", True, "Template Created")
        else:
            log("Templates", False, f"Creation Failed: {r_temp.text}")
    except Exception as e:
        log("Templates", False, f"Exception: {e}")

    # 5. CHAT & REAL-TIME MODULE
    section_header("5. Chat & Real-time Module")
    try:
        # Send Message
        target_chat_id = contact_ids[0]
        msg_payload = {"chat_id": target_chat_id, "text": "Hello User"}
        r_send = requests.post(f"{BASE_URL}/send", json=msg_payload, headers=HEADERS)
        
        if r_send.status_code == 200:
            log("Chat", True, "Outbound Message Sent")
        else:
            log("Chat", False, f"Send Failed: {r_send.text}")

        # Simulate Latency
        print("⏳ Waiting 4 seconds for auto-reply...")
        time.sleep(4)

        # Poll Messages
        r_msgs = requests.get(f"{BASE_URL}/chats/{target_chat_id}/messages", headers=HEADERS)
        msgs = r_msgs.json()
        
        # Check for reply (senderId == target_chat_id)
        reply_found = any((m.get('senderId') or m.get('sender_id')) == target_chat_id for m in msgs)
        
        if reply_found:
            log("Chat", True, "✅ Auto-reply verified in database")
        else:
            # Debug info
            print(f"Debug: Msgs found: {len(msgs)}")
            for m in msgs:
                print(f" - Sender: {m.get('senderId') or m.get('sender_id')} Text: {m.get('text')}")
            log("Chat", False, "❌ Auto-reply NOT found")

    except Exception as e:
        log("Chat", False, f"Exception: {e}")

    # 6. CAMPAIGNS MODULE (CRITICAL PATH)
    section_header("6. Campaigns Module")
    try:
        # Create Campaign
        c_payload = {
            "name": f"Master Release Campaign {EMAIL_SUFFIX}",
            "status": "draft",
            "audience_ids": contact_ids
        }
        r_camp = requests.post(f"{BASE_URL}/campaigns/", json=c_payload, headers=HEADERS)
        
        if r_camp.status_code == 200:
            camp_data = r_camp.json()
            camp_id = camp_data.get("id") or camp_data.get("_id")
            log("Campaigns", True, f"Campaign Created (ID: {camp_id})")

            # Trigger Send
            r_trigger = requests.post(f"{BASE_URL}/campaigns/{camp_id}/send", headers=HEADERS)
            if r_trigger.status_code == 200:
                sent_count = r_trigger.json().get("sent_count")
                if sent_count == 3:
                     log("Campaigns", True, f"Triggered Successfully (Sent: {sent_count})")
                else:
                     log("Campaigns", False, f"Sent count mismatch. Expected 3, got {sent_count}")
                
                # Verify DB Side Effect
                # Check messages for Contact #2 (just to pick one)
                time.sleep(1)
                r_check = requests.get(f"{BASE_URL}/chats/{contact_ids[1]}/messages", headers=HEADERS)
                c2_msgs = r_check.json()
                if any("Master Release Campaign" in m.get("text", "") for m in c2_msgs):
                    log("Campaigns", True, "✅ Verified campaign message in database")
                else:
                    log("Campaigns", False, "❌ Campaign message missing for contact")

            else:
                log("Campaigns", False, f"Trigger Failed: {r_trigger.text}")
        else:
            log("Campaigns", False, f"Creation Failed: {r_camp.text}")

    except Exception as e:
        log("Campaigns", False, f"Exception: {e}")

    # 7. INTEGRATIONS
    section_header("7. Integrations (Google Sheets)")
    try:
        # Invalid URL test (We can't rely on real internet access for "success" with valid URL if auth required)
        # But we know our code returns 400 for invalid structure/fetch fail.
        # We also know it returns 400 with "No module named" if dependencies missing.
        # We want to ensure it DOES NOT say "No module named".
        
        dummy_payload = {"sheet_url": "https://docs.google.com/spreadsheets/d/1BxiMvs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"}
        # This is a random example URL, might fail 400 due to permissions or 400 due to network.
        # Important: Should NOT return 500.
        
        r_int = requests.post(f"{BASE_URL}/integrations/google-sheets/connect", json=dummy_payload, headers=HEADERS)
        
        if r_int.status_code == 200:
             log("Integrations", True, "Connection Successful")
        elif r_int.status_code == 400:
             if "No module named" in r_int.text:
                 log("Integrations", False, "❌ Missing Dependencies (pandas)")
             else:
                 log("Integrations", True, "Handled connection attempt (400 is expected for private/invalid sheets)")
        else:
             log("Integrations", False, f"Unexpected Code: {r_int.status_code}")

    except Exception as e:
        log("Integrations", False, f"Exception: {e}")

    print(f"\n{Fore.GREEN}{Style.BRIGHT}✅ MASTER VERIFICATION PROTOCOL COMPLETE ✅{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
