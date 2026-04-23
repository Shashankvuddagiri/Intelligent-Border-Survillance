import requests
import sys
import time

BASE_URL = "http://127.0.0.1:5000"

def check_endpoint(endpoint):
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print(f"[OK] {endpoint:15} | Status: {response.status_code} | SUCCESS")
            return response.json()
        else:
            print(f"[FAIL] {endpoint:15} | Status: {response.status_code} | FAILED")
    except Exception as e:
        print(f"[ERROR] {endpoint:15} | ERROR: {str(e)}")
    return None

def verify_all():
    print("\n" + "="*50)
    print("AEGIS SENTINEL BACKEND VERIFICATION SUITE")
    print("="*50 + "\n")
    
    # 1. Root Check
    print("Checking Connectivity...")
    health = check_endpoint("/")
    
    # 2. Diagnostics Check
    print("\nChecking Neural Engine Health...")
    diagnostics = check_endpoint("/diagnostics")
    if diagnostics:
        engine = diagnostics.get('neural_engine', {})
        print(f"    - Model: {engine.get('model')}")
        print(f"    - Framework: {engine.get('framework')}")
        print(f"    - Logic Status: {diagnostics.get('status')}")
    
    # 3. Models Rationale Check
    print("\nChecking Intelligence Rationale...")
    models = check_endpoint("/models")
    if models:
        print(f"    - Primary: {models.get('primary_engine')}")
        print(f"    - Reasoning: {models.get('rationale')}")

    print("\n" + "="*50)
    print("VERIFICATION COMPLETE")
    print("="*50 + "\n")

if __name__ == "__main__":
    verify_all()
