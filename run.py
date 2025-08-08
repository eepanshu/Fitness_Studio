#!/usr/bin/env python3
"""
Fitness Studio Booking API Runner
Starts the FastAPI server with uvicorn
"""

import uvicorn
import sys
import os

def main():
    """Start the FastAPI server"""
    print("🏋️  Starting Fitness Studio Booking API...")
    print("📍 API will be available at: http://localhost:8000")
    print("🌐 Web UI will be available at: http://localhost:8000")
    print("📚 Interactive docs at: http://localhost:8000/docs")
    print("🔍 Alternative docs at: http://localhost:8000/redoc")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("main.py"):
        print("❌ Error: main.py not found. Please run this script from the project root directory.")
        sys.exit(1)
    
    # Start the server
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
