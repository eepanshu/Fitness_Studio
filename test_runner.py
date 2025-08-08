#!/usr/bin/env python3
"""
Test runner for the Fitness Studio Booking API
"""

import subprocess
import sys
import os

def run_tests():
    """Run the test suite"""
    print("🧪 Running Fitness Studio Booking API Tests...")
    print("=" * 50)
    
    try:
        # Run pytest with verbose output
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "test_api.py", 
            "-v", 
            "--tb=short"
        ], capture_output=True, text=True)
        
        print(result.stdout)
        
        if result.stderr:
            print("Errors/Warnings:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("\n✅ All tests passed!")
        else:
            print(f"\n❌ Tests failed with exit code: {result.returncode}")
            return False
            
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False
    
    return True

def main():
    """Main function"""
    print("Fitness Studio Booking API - Test Runner")
    print("Make sure the API is not running before running tests")
    print("-" * 50)
    
    success = run_tests()
    
    if success:
        print("\n🎉 Test suite completed successfully!")
        print("You can now run the API with: python run.py")
    else:
        print("\n💥 Test suite failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
