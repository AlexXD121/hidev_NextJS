
import requests
import json
import sys

# Try both common URL patterns
urls = [
    "http://localhost:8000/api/auth/login",
    "http://localhost:8000/auth/login"
]

payload = {
    "email": "test_responsive@example.com", 
    "password": "password123"
}

print("Running Login HTTP Test...")

for url in urls:
    print(f"\nTesting URL: {url}")
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {response.json()}")
        except:
            print(f"Response Text: {response.text}")
            
        if response.status_code == 200:
            print("✅ SUCCESS! This is the correct endpoint.")
            sys.exit(0)
    except Exception as e:
        print(f"Request failed: {e}")

print("\n❌ All attempts failed.")
sys.exit(1)
