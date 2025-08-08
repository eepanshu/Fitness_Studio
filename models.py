from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime, timedelta
import pytz
from dateutil import parser

class ClassCreate(BaseModel):
    """Model for creating a new fitness class"""
    name: str
    instructor: str
    date_time: datetime
    total_slots: int
    duration_minutes: int = 60
    timezone: str = "Asia/Kolkata"
    
    @field_validator('total_slots')
    @classmethod
    def validate_total_slots(cls, v):
        if v <= 0:
            raise ValueError('Total slots must be greater than 0')
        return v
    
    @field_validator('date_time')
    @classmethod
    def validate_date_time(cls, v):
        # Make datetime timezone-aware for comparison
        if isinstance(v, datetime):
            if v.tzinfo is None:
                # If no timezone info, assume IST
                ist = pytz.timezone('Asia/Kolkata')
                v = ist.localize(v)
            
            # Compare with current time in IST
            ist = pytz.timezone('Asia/Kolkata')
            now_ist = datetime.now(ist)
            
            if v < now_ist:
                raise ValueError('Class date/time cannot be in the past')
        return v

class Class(BaseModel):
    """Model for a fitness class"""
    id: str
    name: str
    instructor: str
    date_time: datetime
    total_slots: int
    available_slots: int
    duration_minutes: int = 60
    timezone: str = "Asia/Kolkata"
    
    def to_dict(self):
        """Convert class to dictionary for storage"""
        return {
            'id': self.id,
            'name': self.name,
            'instructor': self.instructor,
            'date_time': self.date_time.isoformat(),
            'total_slots': self.total_slots,
            'available_slots': self.available_slots,
            'duration_minutes': self.duration_minutes,
            'timezone': self.timezone
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create class from dictionary, ensuring integer fields are correct"""
        return cls(
            id=data['id'],
            name=data['name'],
            instructor=data['instructor'],
            date_time=parser.parse(data['date_time']),
            total_slots=int(data['total_slots']),
            available_slots=int(data['available_slots']),
            duration_minutes=int(data.get('duration_minutes', 60)),
            timezone=data.get('timezone', 'Asia/Kolkata')
        )

class BookingCreate(BaseModel):
    """Model for creating a new booking"""
    class_id: str
    client_name: str
    client_email: EmailStr
    
    @field_validator('client_name')
    @classmethod
    def validate_client_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Client name cannot be empty')
        stripped = v.strip()
        if not stripped:
            raise ValueError('Client name cannot be empty')
        return stripped

class Booking(BaseModel):
    """Model for a booking"""
    id: str
    class_id: str
    client_name: str
    client_email: str
    booking_date: datetime
    
    def to_dict(self):
        """Convert booking to dictionary for storage"""
        return {
            'id': self.id,
            'class_id': self.class_id,
            'client_name': self.client_name,
            'client_email': self.client_email,
            'booking_date': self.booking_date.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create booking from dictionary"""
        return cls(
            id=data['id'],
            class_id=data['class_id'],
            client_name=data['client_name'],
            client_email=data['client_email'],
            booking_date=parser.parse(data['booking_date'])
        )
