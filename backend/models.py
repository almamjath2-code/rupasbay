from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, Time, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# ==================== ADMIN ==================== 
   # ==================== RESTAURANT USER ====================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20))

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reservations = relationship(
        "Reservation",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    reviews = relationship(
        "Review",
        back_populates="user",
        cascade="all, delete-orphan"
    )

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    api_keys = relationship("AdminAPIKey", back_populates="admin", cascade="all, delete-orphan")


class AdminAPIKey(Base):
    __tablename__ = "admin_api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(255), unique=True, nullable=False, index=True)
    admin_id = Column(Integer, ForeignKey("admins.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime)

    # Relationships
    admin = relationship("Admin", back_populates="api_keys")



class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    event_date = Column(Date, nullable=False, index=True)
    event_time = Column(Time, nullable=False)
    event_type = Column(String(50), nullable=False)
    max_capacity = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    photo_url = Column(String(500))
    is_approved = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reviews")

    # ==================== RESERVATION ====================

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    reservation_date = Column(Date, nullable=False)
    reservation_time = Column(Time, nullable=False)

    num_guests = Column(Integer, nullable=False)

    seating_preference = Column(
        String(50),
        default="Beachfront"
    )

    special_requests = Column(Text)

    status = Column(
        String(50),
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="reservations"
    )

    # ==================== MENU ITEM ====================

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)

    category = Column(String(50), nullable=False)
    price_lkr = Column(Integer, nullable=False)

    image_url = Column(String(500))

    is_available = Column(Boolean, default=True)
    is_chef_pick = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

 
