import requests
import sys

BASE_URL = "http://localhost:8000/api"

def main():
    print("Testing Auth Flow...")
    
    # 1. Login
    login_payload = {"email": "admin_aec413@master-test.com", "password": "securepassword123"}
    r = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    
    if r.status_code != 200:
        print(f"Login failed: {r.text}")
        sys.exit(1)
        
    data = r.json()
    token = data.get("token")
    print(f"Got Token: {token[:10]}...")
    
    # 2. Access Protected Route
    headers = {"Authorization": f"Bearer {token}"}
    r2 = requests.get(f"{BASE_URL}/templates/", headers=headers)
    
    if r2.status_code == 200:
        print("✅ SUCCESS: Protected route accessed.")
    else:
        print(f"❌ FAIL: Protected route rejected: {r2.status_code} {r2.text}")

if __name__ == "__main__":
    main()
