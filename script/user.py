import requests
import json

API_URL = "http://localhost:8080/api/register"
HEADERS = {"Content-Type": "application/json"}

users = [
    {"name": "test1", "email": "test1@gmail.com", "password": "Test@1111"},
    {"name": "test2", "email": "test2@gmail.com", "password": "Test@2222"},
    {"name": "test3", "email": "test3@gmail.com", "password": "Test@3333"}
]

def add_users():
    for user in users:
        try:
            res = requests.post(API_URL, json=user, headers=HEADERS, timeout=10)
            if res.status_code == 201:
                print(f"✅ User created: {user['name']} ({user['email']})")
            else:
                print(f"❌ Error for {user['name']}: {res.status_code} - {res.text}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Connection error for {user['name']}: {e}")

if __name__ == "__main__":
    add_users()
