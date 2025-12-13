import requests
import sys

BASE_URL = "http://localhost:8000/api"

# 1. Login to get token
def login():
    print("Logging in...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@whatsapp-dashboard.com",
            "password": "admin"
        })
        if response.status_code == 200:
            return response.json()["token"]
        elif response.status_code == 401:
            print("Login failed, attempting to register default admin...")
            reg_response = requests.post(f"{BASE_URL}/auth/register", json={
                "name": "Admin User",
                "email": "admin@whatsapp-dashboard.com",
                "password": "admin"
            })
            if reg_response.status_code == 200:
                print("Registration successful, logging in...")
                return login() # Retry login
            else:
                print(f"Registration failed: {reg_response.text}")
                return None
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def verify_contacts():
    token = login()
    if not token:
        sys.exit(1)
    
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Contact
    print("\nCreating contact...")
    new_contact = {
        "name": "Test Contact",
        "phone": "+1234567890",
        "tags": ["test", "api_verify"]
    }
    res_create = requests.post(f"{BASE_URL}/contacts/", json=new_contact, headers=headers)
    
    if res_create.status_code == 200:
        contact_data = res_create.json()
        # Handle _id vs id
        c_id = contact_data.get("id") or contact_data.get("_id")
        print(f"✅ Contact created: {c_id}")
        
        # 3. Get Contacts and verify
        print("\nFetching contacts...")
        res_get = requests.get(f"{BASE_URL}/contacts/", headers=headers)
        if res_get.status_code == 200:
            contacts = res_get.json()
            found = any((c.get('id') == c_id or c.get('_id') == c_id) for c in contacts)
            if found:
                print(f"✅ Contact found in list. Total contacts: {len(contacts)}")
            else:
                print("❌ Contact NOT found in list!")
        else:
            print(f"❌ Failed to fetch contacts: {res_get.text}")

        # 4. Delete Contact
        print("\nDeleting contact...")
        res_del = requests.delete(f"{BASE_URL}/contacts/{c_id}", headers=headers)
        if res_del.status_code == 200:
             print("✅ Contact deleted.")
             
             # Verify deletion
             res_get_after = requests.get(f"{BASE_URL}/contacts/", headers=headers)
             contacts_after = res_get_after.json()
             found_after = any((c.get('id') == c_id or c.get('_id') == c_id) for c in contacts_after)
             if not found_after:
                 print("✅ Contact successfully removed from list.")
             else:
                 print("❌ Contact still present after deletion!")

        else:
            print(f"❌ Failed to delete contact: {res_del.text}")

    else:
        print(f"❌ Failed to create contact: {res_create.text}")

if __name__ == "__main__":
    verify_contacts()
