#!/usr/bin/env python3
"""
Sample API requests for the Fitness Studio Booking API
This script demonstrates how to interact with the API endpoints
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

def print_response(response, title):
    """Print formatted API response"""
    print(f"\n{'='*50}")
    print(f"{title}")
    print(f"{'='*50}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))
    print(f"{'='*50}\n")

def test_get_classes():
    """Test GET /classes endpoint"""
    print("Testing GET /classes...")
    response = requests.get(f"{BASE_URL}/classes")
    print_response(response, "GET /classes - All Available Classes")
    return response.json()

def test_book_class(class_id, client_name, client_email):
    """Test POST /book endpoint"""
    print(f"Testing POST /book for class {class_id}...")
    
    booking_data = {
        "class_id": class_id,
        "client_name": client_name,
        "client_email": client_email
    }
    
    response = requests.post(f"{BASE_URL}/book", json=booking_data)
    print_response(response, f"POST /book - Booking for {client_name}")
    return response.json()

def test_get_bookings(email):
    """Test GET /bookings endpoint"""
    print(f"Testing GET /bookings for email {email}...")
    response = requests.get(f"{BASE_URL}/bookings?email={email}")
    print_response(response, f"GET /bookings - Bookings for {email}")
    return response.json()

def test_error_cases():
    """Test various error scenarios"""
    print("Testing error cases...")
    
    # Test 1: Invalid class ID
    print("\n1. Testing invalid class ID...")
    response = requests.post(f"{BASE_URL}/book", json={
        "class_id": "invalid-id",
        "client_name": "Test User",
        "client_email": "test@example.com"
    })
    print_response(response, "Error: Invalid Class ID")
    
    # Test 2: Invalid email format
    print("\n2. Testing invalid email format...")
    response = requests.post(f"{BASE_URL}/book", json={
        "class_id": "some-valid-id",
        "client_name": "Test User",
        "client_email": "invalid-email"
    })
    print_response(response, "Error: Invalid Email Format")
    
    # Test 3: Missing email parameter
    print("\n3. Testing missing email parameter...")
    response = requests.get(f"{BASE_URL}/bookings")
    print_response(response, "Error: Missing Email Parameter")

def test_health_endpoint():
    """Test health check endpoint"""
    print("Testing GET /health...")
    response = requests.get(f"{BASE_URL}/health")
    print_response(response, "GET /health - Health Check")

def main():
    """Main function to run all sample requests"""
    print("Fitness Studio Booking API - Sample Requests")
    print("Make sure the API is running on http://localhost:8000")
    
    try:
        # Test health endpoint
        test_health_endpoint()
        
        # Test getting all classes
        classes = test_get_classes()
        
        if classes:
            # Get the first class ID for booking
            first_class = classes[0]
            class_id = first_class["id"]
            class_name = first_class["name"]
            
            print(f"Using class '{class_name}' (ID: {class_id}) for booking tests")
            
            # Test booking a class
            test_book_class(
                class_id=class_id,
                client_name="John Doe",
                client_email="john.doe@example.com"
            )
            
            # Test getting bookings for the email
            test_get_bookings("john.doe@example.com")
            
            # Test booking the same class again (should fail)
            print("Testing duplicate booking...")
            response = requests.post(f"{BASE_URL}/book", json={
                "class_id": class_id,
                "client_name": "John Doe",
                "client_email": "john.doe@example.com"
            })
            print_response(response, "Error: Duplicate Booking")
            
            # Test booking with different email
            test_book_class(
                class_id=class_id,
                client_name="Jane Smith",
                client_email="jane.smith@example.com"
            )
            
            # Test getting bookings for both emails
            test_get_bookings("john.doe@example.com")
            test_get_bookings("jane.smith@example.com")
            
            # Test getting bookings for non-existent email
            test_get_bookings("nonexistent@example.com")
        
        # Test error cases
        test_error_cases()
        
        print("\n✅ All sample requests completed!")
        print("\nYou can also:")
        print("- Visit http://localhost:8000/docs for interactive API documentation")
        print("- Use the cURL commands from the README.md file")
        print("- Import the Postman collection from the README.md file")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API.")
        print("Make sure the API is running on http://localhost:8000")
        print("Run: python main.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
