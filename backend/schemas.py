from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date, time

# ==================== USER SCHEMAS ====================

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== MENU ITEM SCHEMAS ====================

class MenuItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: str
    price_lkr: int = Field(..., gt=0)
    image_url: Optional[str] = None
    is_available: bool = True
    is_chef_pick: bool = False

class MenuItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: str
    price_lkr: int
    image_url: Optional[str]
    is_available: bool
    is_chef_pick: bool
    created_at: datetime

    class Config:
        from_attributes = True

class MenuItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    price_lkr: Optional[int] = Field(None, gt=0)
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_chef_pick: Optional[bool] = None

    class Config:
        from_attributes = True

# ==================== RESERVATION SCHEMAS ====================


class ReservationCreate(BaseModel):
    """Schema for creating a reservation - FORM INPUT"""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    reservation_date: date
    reservation_time: time
    num_guests: int = Field(..., gt=0, le=20)
    seating_preference: Optional[str] = None
    special_requests: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ReservationResponse(BaseModel):
    """Schema for reservation response"""

    id: int
    user_id: int

    name: str
    email: EmailStr
    phone: str

    reservation_date: date
    reservation_time: time
    num_guests: int

    seating_preference: Optional[str] = None
    special_requests: Optional[str] = None

    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ReservationStatusUpdate(BaseModel):
    """Schema for updating reservation status"""
    status: str = Field(..., min_length=1)

    model_config = ConfigDict(from_attributes=True)

# ==================== EVENT SCHEMAS ====================

class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    event_date: date
    event_time: time
    event_type: str
    max_capacity: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== REVIEW SCHEMAS ====================

class ReviewCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    photo_url: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    email: str
    rating: int
    comment: Optional[str]
    photo_url: Optional[str]
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== API RESPONSE SCHEMAS ====================

class APIResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None

class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: datetime
