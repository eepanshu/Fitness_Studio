from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
import logging
from models import ClassCreate, Class, BookingCreate, Booking
from database import Database
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Fitness Studio Booking API",
    description="A comprehensive API for managing fitness studio classes and bookings",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = Database()

# Create templates directory if it doesn't exist
os.makedirs("templates", exist_ok=True)

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data on startup"""
    logger.info("Initializing database with sample data...")
    db.initialize_sample_data()

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Serve the main HTML page"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Fitness Studio Booking API is running"}

@app.get("/classes")
async def get_classes():
    """Get all available classes"""
    classes = db.get_all_classes()
    logger.info(f"Retrieved {len(classes)} classes")
    return classes

@app.post("/classes")
async def create_class(class_data: ClassCreate):
    """Create a new class"""
    try:
        import uuid
        # Create a new class with the provided data
        new_class = Class(
            id=str(uuid.uuid4()),
            name=class_data.name,
            instructor=class_data.instructor,
            date_time=class_data.date_time,
            total_slots=int(class_data.total_slots),
            available_slots=int(class_data.total_slots),
            duration_minutes=int(class_data.duration_minutes),
            timezone=class_data.timezone
        )
        
        # Add to database
        db.classes.append(new_class)
        db._save_data()
        
        logger.info(f"Created new class: {new_class.id}")
        return new_class
    except Exception as e:
        logger.error(f"Error creating class: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/classes/{class_id}")
async def update_class(class_id: str, class_data: dict):
    """Update an existing class"""
    try:
        class_item = db.get_class_by_id(class_id)
        if not class_item:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Update class properties
        if "name" in class_data:
            class_item.name = class_data["name"]
        if "instructor" in class_data:
            class_item.instructor = class_data["instructor"]
        if "available_slots" in class_data:
            class_item.available_slots = class_data["available_slots"]
        
        db._save_data()
        logger.info(f"Updated class: {class_id}")
        return class_item
    except Exception as e:
        logger.error(f"Error updating class: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/classes/{class_id}")
async def delete_class(class_id: str):
    """Delete a class"""
    try:
        class_item = db.get_class_by_id(class_id)
        if not class_item:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Remove class from database
        db.classes = [c for c in db.classes if c.id != class_id]
        db._save_data()
        
        logger.info(f"Deleted class: {class_id}")
        return {"message": "Class deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting class: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/book")
async def book_class(booking_data: BookingCreate):
    """Book a class"""
    # Validate class exists
    class_item = db.get_class_by_id(booking_data.class_id)
    if not class_item:
        raise HTTPException(status_code=404, detail="Class not found")

    # Check if class is in the past
    from datetime import datetime
    import pytz

    ist = pytz.timezone('Asia/Kolkata')
    now = datetime.now(ist)
    class_time = class_item.date_time.astimezone(ist)

    if class_time < now:
        raise HTTPException(status_code=400, detail="Cannot book classes in the past")

    # Check if slots are available
    available_slots = int(class_item.available_slots)
    if available_slots <= 0:
        logger.error(f"Class data corrupted: available_slots is not an integer for class {class_item.id}")
        raise HTTPException(status_code=400, detail="Class data corrupted: available_slots is not an integer")

    # Check for duplicate booking
    existing_booking = db.get_booking_by_email_and_class(booking_data.client_email, booking_data.class_id)
    if existing_booking:
        raise HTTPException(status_code=400, detail="You have already booked this class")

    # Create booking
    import uuid
    from datetime import datetime

    booking = Booking(
        id=str(uuid.uuid4()),
        class_id=booking_data.class_id,
        client_name=booking_data.client_name,
        client_email=booking_data.client_email,
        booking_date=datetime.now()
    )

    # Add booking to database
    db.bookings.append(booking)

    # Update available slots
    class_item.available_slots = int(class_item.available_slots) - 1

    # Save changes
    db._save_data()
    logger.info(f"Booking created: {booking.id} for class {booking.class_id}")
    return booking

@app.get("/bookings")
async def get_bookings(email: str = None):
    """Get bookings by email"""
    if not email:
        raise HTTPException(status_code=400, detail="Email parameter is required")
    
    try:
        bookings = db.get_bookings_by_email(email)
        
        # Enrich bookings with class information
        enriched_bookings = []
        for booking in bookings:
            class_item = db.get_class_by_id(booking.class_id)
            enriched_booking = {
                "id": booking.id,
                "class_id": booking.class_id,
                "client_name": booking.client_name,
                "client_email": booking.client_email,
                "booking_date": booking.booking_date.isoformat(),
                "class_name": class_item.name if class_item else "Unknown Class",
                "instructor": class_item.instructor if class_item else "Unknown Instructor",
                "class_date_time": class_item.date_time.isoformat() if class_item else None
            }
            enriched_bookings.append(enriched_booking)
        
        logger.info(f"Retrieved {len(enriched_bookings)} bookings for email: {email}")
        return enriched_bookings
    except Exception as e:
        logger.error(f"Error retrieving bookings: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str):
    """Delete a booking"""
    try:
        booking = None
        for b in db.bookings:
            if b.id == booking_id:
                booking = b
                break
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Remove booking from database
        db.bookings = [b for b in db.bookings if b.id != booking_id]
        
        # Increase available slots for the class
        class_item = db.get_class_by_id(booking.class_id)
        if class_item:
            class_item.available_slots += 1
        
        db._save_data()
        
        logger.info(f"Deleted booking: {booking_id}")
        return {"message": "Booking deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting booking: {e}")
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
