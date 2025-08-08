import json
import uuid
from datetime import datetime, timedelta
from typing import List, Optional
import pytz
from dateutil import parser
from models import Class, Booking, ClassCreate, BookingCreate
import logging

logger = logging.getLogger(__name__)

class Database:
    """In-memory database for storing classes and bookings"""
    
    def __init__(self):
        self.classes: List[Class] = []
        self.bookings: List[Booking] = []
        self._load_data()
    
    def _load_data(self):
        """Load data from JSON files if they exist"""
        try:
            with open('classes.json', 'r') as f:
                classes_data = json.load(f)
                self.classes = [Class.from_dict(c) for c in classes_data]
        except FileNotFoundError:
            logger.info("No existing classes data found")
        
        try:
            with open('bookings.json', 'r') as f:
                bookings_data = json.load(f)
                self.bookings = [Booking.from_dict(b) for b in bookings_data]
        except FileNotFoundError:
            logger.info("No existing bookings data found")
    
    def _save_data(self):
        """Save data to JSON files"""
        try:
            with open('classes.json', 'w') as f:
                json.dump([c.to_dict() for c in self.classes], f, indent=2)
            
            with open('bookings.json', 'w') as f:
                json.dump([b.to_dict() for b in self.bookings], f, indent=2)
        except Exception as e:
            logger.error(f"Error saving data: {str(e)}")
    
    def initialize_sample_data(self):
        """Initialize the database with sample fitness classes"""
        if self.classes:  # Don't reinitialize if data already exists
            return
        
        ist_tz = pytz.timezone('Asia/Kolkata')
        now = datetime.now(ist_tz)
        
        # Create sample classes for the next 7 days
        sample_classes = [
            {
                'name': 'Yoga Basics',
                'instructor': 'Sarah Johnson',
                'date_time': now + timedelta(days=1, hours=9),  # Tomorrow 9 AM
                'total_slots': 15,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'Zumba Dance',
                'instructor': 'Maria Rodriguez',
                'date_time': now + timedelta(days=1, hours=18),  # Tomorrow 6 PM
                'total_slots': 20,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'HIIT Training',
                'instructor': 'Mike Chen',
                'date_time': now + timedelta(days=2, hours=7),  # Day after tomorrow 7 AM
                'total_slots': 12,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'Pilates',
                'instructor': 'Emma Wilson',
                'date_time': now + timedelta(days=2, hours=17),  # Day after tomorrow 5 PM
                'total_slots': 10,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'Strength Training',
                'instructor': 'David Brown',
                'date_time': now + timedelta(days=3, hours=8),  # 3 days from now 8 AM
                'total_slots': 8,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'Cardio Kickboxing',
                'instructor': 'Lisa Park',
                'date_time': now + timedelta(days=3, hours=19),  # 3 days from now 7 PM
                'total_slots': 16,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'Yoga Advanced',
                'instructor': 'Sarah Johnson',
                'date_time': now + timedelta(days=4, hours=10),  # 4 days from now 10 AM
                'total_slots': 12,
                'timezone': 'Asia/Kolkata'
            },
            {
                'name': 'Dance Fitness',
                'instructor': 'Maria Rodriguez',
                'date_time': now + timedelta(days=5, hours=16),  # 5 days from now 4 PM
                'total_slots': 18,
                'timezone': 'Asia/Kolkata'
            }
        ]
        
        for class_data in sample_classes:
            class_id = str(uuid.uuid4())
            total_slots = int(class_data['total_slots'])
            fitness_class = Class(
                id=class_id,
                name=class_data['name'],
                instructor=class_data['instructor'],
                date_time=class_data['date_time'],
                total_slots=total_slots,
                available_slots=total_slots,
                timezone=class_data['timezone']
            )
            self.classes.append(fitness_class)
        
        self._save_data()
        logger.info(f"Initialized {len(self.classes)} sample classes")
    
    def get_all_classes(self) -> List[Class]:
        """Get all classes, sorted by date/time"""
        return sorted(self.classes, key=lambda x: x.date_time)
    
    def get_class_by_id(self, class_id: str) -> Optional[Class]:
        """Get a class by its ID"""
        for fitness_class in self.classes:
            if fitness_class.id == class_id:
                return fitness_class
        return None
    
    def update_class_slots(self, class_id: str, slot_change: int):
        """Update available slots for a class"""
        for fitness_class in self.classes:
            if fitness_class.id == class_id:
                fitness_class.available_slots += slot_change
                if fitness_class.available_slots < 0:
                    fitness_class.available_slots = 0
                elif fitness_class.available_slots > fitness_class.total_slots:
                    fitness_class.available_slots = fitness_class.total_slots
                self._save_data()
                break
    
    def create_booking(self, class_id: str, client_name: str, client_email: str) -> Booking:
        """Create a new booking"""
        booking_id = str(uuid.uuid4())
        ist_tz = pytz.timezone('Asia/Kolkata')
        booking_date = datetime.now(ist_tz)
        
        booking = Booking(
            id=booking_id,
            class_id=class_id,
            client_name=client_name,
            client_email=client_email,
            booking_date=booking_date
        )
        
        self.bookings.append(booking)
        self._save_data()
        return booking
    
    def get_bookings_by_email(self, email: str) -> List[Booking]:
        """Get all bookings for a specific email"""
        return [booking for booking in self.bookings if booking.client_email.lower() == email.lower()]
    
    def get_booking_by_email_and_class(self, email: str, class_id: str) -> Optional[Booking]:
        """Check if a user has already booked a specific class"""
        for booking in self.bookings:
            if (booking.client_email.lower() == email.lower() and 
                booking.class_id == class_id):
                return booking
        return None
    
    def update_timezone(self, new_timezone: str):
        """Update all class times to a new timezone"""
        try:
            new_tz = pytz.timezone(new_timezone)
            old_tz = pytz.timezone('Asia/Kolkata')
            
            for fitness_class in self.classes:
                # Convert from IST to new timezone
                ist_time = old_tz.localize(fitness_class.date_time.replace(tzinfo=None))
                new_time = ist_time.astimezone(new_tz)
                fitness_class.date_time = new_time
                fitness_class.timezone = new_timezone
            
            self._save_data()
            logger.info(f"Updated all class times to {new_timezone}")
        except Exception as e:
            logger.error(f"Error updating timezone: {str(e)}")
            raise
    
    def get_classes_by_instructor(self, instructor: str) -> List[Class]:
        """Get all classes by a specific instructor"""
        return [fitness_class for fitness_class in self.classes 
                if fitness_class.instructor.lower() == instructor.lower()]
    
    def get_upcoming_classes(self, days: int = 7) -> List[Class]:
        """Get classes in the next N days"""
        ist_tz = pytz.timezone('Asia/Kolkata')
        now = datetime.now(ist_tz)
        end_date = now + timedelta(days=days)
        
        return [fitness_class for fitness_class in self.classes 
                if now <= fitness_class.date_time <= end_date]
