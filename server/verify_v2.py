import requests
import time
import uuid
import sys
from colorama import init, Fore, Style

# Initialize Colorama
init()

# CONFIG
BASE_URL = "http://localhost:8000/api"
EMAIL = f"qa_test_{uuid.uuid4().hex[:6]}@example.com"
PASSWORD = "password123"
HEADERS = {"Content-Type": "application/json"}

# TEST STATS
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

def verify_v2():
    global HEADERS
    
    # 1. SETUP: Auth & Contacts
    section_header("1. Setup (Auth & Contacts)")
    
    # Register/Login
    try:
        # Register
        requests.post(f"{BASE_URL}/auth/register", json={"email": EMAIL, "password": PASSWORD, "name": "QA Tester", "role": "admin"})
        # Login
        r = requests.post(f"{BASE_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD})
        if r.status_code == 200:
            data = r.json()
            token = data.get("token") or data.get("access_token")
            if token:
                # Ensure no extra quotes if json parser left them (unlikely but safe)
                token = token.strip('"') 
                HEADERS["Authorization"] = f"Bearer {token}"
                log("Auth", True, "Logged in & Token acquired")
            else:
                 log("Auth", False, f"Login worked but no token in response: {data.keys()}")
                 return
        else:
            log("Auth", False, f"Login failed: {r.text}")
            return
            
        # Create 2 Dummy Contacts
        suffix = uuid.uuid4().hex[:4]
        c1_payload = {"name": f"Alice QA {suffix}", "phone": f"+1001{suffix}", "email": f"alice_{suffix}@qa.com", "tags": ["qa"]}
        c2_payload = {"name": f"Bob QA {suffix}", "phone": f"+1002{suffix}", "email": f"bob_{suffix}@qa.com", "tags": ["qa"]}
        
        r1 = requests.post(f"{BASE_URL}/contacts/", json=c1_payload, headers=HEADERS)
        r2 = requests.post(f"{BASE_URL}/contacts/", json=c2_payload, headers=HEADERS)
        
        c1 = r1.json() if r1.status_code == 200 else {}
        c2 = r2.json() if r2.status_code == 200 else {}
        
        c1_id = c1.get("id") or c1.get("_id")
        c2_id = c2.get("id") or c2.get("_id")
        
        if c1_id and c2_id:
             log("Data Setup", True, f"Created Contacts: {c1_id}, {c2_id}")
             c1['id'] = c1_id # normalize for later use
             c2['id'] = c2_id
        else:
             log("Data Setup", False, f"Failed to create contacts. \nR1: {r1.status_code} {r1.text} \nR2: {r2.status_code} {r2.text}")
             return
             
    except Exception as e:
        log("Setup", False, f"Exception: {e}")
        return

    # 2. TEST CAMPAIGN FLOW
    section_header("2. Campaign Flow")
    try:
        # Create Campaign
        # Valid ObjectId for template_id or omitted
        valid_oid = "693d79d5639ef5344223ad49" # Re-use a valid ID format (like contact ID) or generate one
        # Actually, let's just generate one or use none.
        valid_oid = c1['id'] # Hack: use a valid ID string
        
        camp_payload = {
            "name": "QA Smoke Campaign", 
            # "template_id": valid_oid, # Comment out to avoid strict validation if not needed, model says Optional
            "status": "draft",
            "audience_ids": [c1['id'], c2['id']] # Targeted Audience
        }
        r_camp = requests.post(f"{BASE_URL}/campaigns/", json=camp_payload, headers=HEADERS)
        camp_data = r_camp.json()
        camp_id = camp_data.get("id") or camp_data.get("_id")
        
        if camp_id:
            log("Campaign", True, f"Campaign Created (ID: {camp_id})")
            
            # TRIGGER SEND
            r_send = requests.post(f"{BASE_URL}/campaigns/{camp_id}/send", headers=HEADERS)
            if r_send.status_code == 200:
                log("Campaign", True, "Send Endpoint Triggered Successfully")
                count = r_send.json().get("sent_count")
                if count == 2:
                    log("Campaign", True, f"Count match: {count} messages sent")
                else:
                    log("Campaign", False, f"Count Mismatch: Expected 2, got {count}")
                
                # VERIFY MESSAGES IN DB
                time.sleep(2) # Wait for DB
                # Check messages for Contact 1
                r_msg1 = requests.get(f"{BASE_URL}/chats/{c1['id']}/messages", headers=HEADERS)
                msgs1 = r_msg1.json()
                if any("QA Smoke Campaign" in m.get("text", "") for m in msgs1):
                     log("Campaign", True, "Message verified for Contact 1")
                else:
                     log("Campaign", False, "Message missing for Contact 1")
                     
                # Check messages for Contact 2
                r_msg2 = requests.get(f"{BASE_URL}/chats/{c2['id']}/messages", headers=HEADERS)
                msgs2 = r_msg2.json()
                if any("QA Smoke Campaign" in m.get("text", "") for m in msgs2):
                     log("Campaign", True, "Message verified for Contact 2")
                else:
                     log("Campaign", False, "Message missing for Contact 2")
                     
            else:
                log("Campaign", False, f"Send Failed: {r_send.status_code} - {r_send.text}")
        else:
            log("Campaign", False, f"Campaign Creation Failed: {r_camp.status_code} {r_camp.text}")
            
    except Exception as e:
        log("Campaign", False, f"Exception: {e}")

    # 3. TEST SHEETS FLOW
    section_header("3. Sheets Flow")
    try:
        # Invalid Case
        invalid_payload = {"sheet_url": "https://example.com/not-a-sheet"}
        r_inv = requests.post(f"{BASE_URL}/integrations/google-sheets/connect", json=invalid_payload, headers=HEADERS)
        if r_inv.status_code == 400:
             if "No module named" in r_inv.text:
                 log("Sheets", False, f"Server missing dependencies! {r_inv.text}")
             else:
                 log("Sheets", True, "Invalid URL correctly rejected (400)")
        else:
             log("Sheets", False, f"Invalid URL NOT rejected code {r_inv.status_code} Body: {r_inv.text}")
             
    except Exception as e:
        log("Sheets", False, f"Exception: {e}")

    # 4. TEST CHAT FLOW (Wait increased)
    section_header("4. Chat Flow (Auto-Reply)")
    try:
        # Use Contact 1
        chat_id = c1['id']
        # Send Msg
        r_chat = requests.post(f"{BASE_URL}/send", json={"chat_id": chat_id, "text": "Hello Bot"}, headers=HEADERS)
        if r_chat.status_code == 200:
            log("Chat", True, "Message sent")
            
            print("⏳ Waiting 8 seconds for auto-reply...") # Increased
            time.sleep(8)
            
            # Check for reply
            r_msgs = requests.get(f"{BASE_URL}/chats/{chat_id}/messages", headers=HEADERS)
            msgs = r_msgs.json()
            print(f"DEBUG MSGS FOUND: {len(msgs)}")
            for m in msgs:
                sid = m.get('senderId') or m.get('sender_id')
                print(f" - {sid} : {m.get('text')}")
            
            reply_found = any((m.get('senderId') or m.get('sender_id')) == chat_id for m in msgs)
            if reply_found:
                log("Chat", True, "✅ Auto-Reply Received from Connection!")
            else:
                log("Chat", False, "❌ Auto-Reply Missing")
                
        else:
             log("Chat", False, f"Message send failed: {r_chat.status_code} {r_chat.text}")

    except Exception as e:
         log("Chat", False, f"Exception: {e}")

    # SUMMARY
    section_header("SUMMARY")
    score = (tests_passed/tests_total)*100 if tests_total > 0 else 0
    print(f"Tests Passed: {tests_passed}/{tests_total}")
    print(f"Score: {score:.1f}%")
    
if __name__ == "__main__":
    verify_v2()
