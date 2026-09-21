
from fastapi import FastAPI, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, time
from datetime import datetime, date, time 
import time as time_module
from typing import List, Optional
import os
import shutil
from dotenv import load_dotenv
import aiofiles
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi import UploadFile, File, Form



# Import custom modules
from database import get_db, init_db, test_connection
from models import User, MenuItem, Reservation, Event, Review, Admin
from schemas import (
    ReservationCreate,
    ReservationResponse,
    ReservationStatusUpdate,
    HealthResponse
)
from admin_auth import get_admin_user, create_admin_api_key
import schemas

class LoginRequest(BaseModel):
    username: str
    password: str

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Rupa's Bay Restaurant API",
    description="Backend API for Rupa's Bay restaurant website",
    version="2.0.0"
)

# CORS configuration - Allow frontend without auth
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:5500",  # Live Server
    "https://rupasbay.com",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "*"  # Allow all origins for frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

# ==================== STARTUP ====================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)



@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    init_db()

# ==================== HEALTH CHECK ====================

@app.get("/health", response_model=schemas.HealthResponse)
async def health_check():
    """Health check endpoint"""
    db_status = "connected" if test_connection() else "disconnected"
    return schemas.HealthResponse(
        status="healthy",
        database=db_status,
        timestamp=datetime.utcnow()
    )

# ==================== PUBLIC ENDPOINTS (NO AUTH) ====================

# -------- MENU --------
@app.get("/api/menu", response_model=List[schemas.MenuItemResponse])
async def get_menu(
    category: Optional[str] = Query(None),
    available_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """Get menu items - PUBLIC"""
    query = db.query(MenuItem)
    
    if available_only:
        query = query.filter(MenuItem.is_available == True)
    
    if category:
        query = query.filter(MenuItem.category == category)
    
    return query.all()

@app.get("/api/menu/{item_id}", response_model=schemas.MenuItemResponse)
async def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Get specific menu item - PUBLIC"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item

# -------- EVENTS --------
@app.get("/api/events", response_model=List[schemas.EventResponse])
async def get_events(
    active_only: bool = Query(True),
    event_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get upcoming events - PUBLIC"""
    query = db.query(Event)
    
    if active_only:
        query = query.filter(Event.is_active == True)
    
    if event_type:
        query = query.filter(Event.event_type == event_type)
    
    query = query.order_by(Event.event_date, Event.event_time)
    return query.all()

@app.get("/api/events/{event_id}", response_model=schemas.EventResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get specific event - PUBLIC"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# -------- REVIEWS --------
@app.get("/api/reviews", response_model=List[schemas.ReviewResponse])
async def get_reviews(
    approved_only: bool = Query(True),
    limit: int = Query(50),
    db: Session = Depends(get_db)
):
    """Get reviews - PUBLIC (approved only by default)"""
    query = db.query(Review)
    
    if approved_only:
        query = query.filter(Review.is_approved == True)
    
    query = query.order_by(Review.created_at.desc()).limit(limit)
    return query.all()

@app.get("/api/reviews/stats", response_model=dict)
async def get_review_stats(db: Session = Depends(get_db)):
    """Get review statistics - PUBLIC"""
    reviews = db.query(Review).filter(Review.is_approved == True).all()
    
    if not reviews:
        return {
            "average_rating": 0.0,
            "total_reviews": 0,
            "rating_distribution": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        }
    
    total = len(reviews)
    avg_rating = sum(r.rating for r in reviews) / total
    distribution = {i: len([r for r in reviews if r.rating == i]) for i in range(1, 6)}
    
    return {
        "average_rating": round(avg_rating, 1),
        "total_reviews": total,
        "rating_distribution": distribution
    }
@app.post("/api/reviews", response_model=schemas.ReviewResponse)
async def create_review(
    review_data: schemas.ReviewCreate,
    db: Session = Depends(get_db)
):
    """Create review - PUBLIC"""

    # Check user exists
    user = db.query(User).filter(
        User.email == review_data.email
    ).first()

    # Create user if not exists
    if not user:
        user = User(
            name=review_data.name,
            email=review_data.email
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create review
    db_review = Review(
        user_id=user.id,
        name=review_data.name,
        email=review_data.email,
        rating=review_data.rating,
        comment=review_data.comment,
        photo_url=review_data.photo_url,
        is_approved=False
    )

    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    return db_review

# -------- RESERVATIONS --------
# main.py - FIXED create_reservation endpoint

@app.post("/api/reservations", response_model=ReservationResponse)
async def create_reservation(
    reservation_data: ReservationCreate,
    db: Session = Depends(get_db)
):
    """Create reservation - PUBLIC"""
    
    print("\n" + "="*80)
    print("📝 NEW RESERVATION REQUEST")
    print("="*80)
    print(f"Name: {reservation_data.name}")
    print(f"Email: {reservation_data.email}")
    print(f"Phone: {reservation_data.phone}")
    print(f"Date: {reservation_data.reservation_date}")
    print(f"Time: {reservation_data.reservation_time}")
    print(f"Guests: {reservation_data.num_guests}")
    print("="*80)
    
    try:
        # ✅ Step 1: Find or create user
        print("\n✅ Step 1: Finding or creating user...")
        
        user = db.query(User).filter(
            User.email == reservation_data.email
        ).first()

        if not user:
            print(f"   → Creating new user: {reservation_data.name}")
            user = User(
                name=reservation_data.name,
                email=reservation_data.email,
                phone=reservation_data.phone
            )
            db.add(user)
            db.flush()  # Get user ID
            print(f"   ✅ User created with ID: {user.id}")
        else:
            print(f"   ✅ User already exists with ID: {user.id}")

        # ✅ Step 2: Create reservation (WITHOUT name, email, phone!)
        print(f"\n✅ Step 2: Creating reservation...")
        
        db_reservation = Reservation(
            user_id=user.id,  # ✅ ONLY this goes to Reservation!
            reservation_date=reservation_data.reservation_date,
            reservation_time=reservation_data.reservation_time,
            num_guests=reservation_data.num_guests,
            seating_preference=reservation_data.seating_preference or "Beachfront",
            special_requests=reservation_data.special_requests or "",
            status="Pending"
        )

        db.add(db_reservation)

        # ✅ Step 3: Commit
        print(f"💾 Step 3: Saving to database...")
        db.commit()
        db.refresh(db_reservation)

        print(f"   ✅ Reservation ID: {db_reservation.id}")
        print(f"   ✅ User ID: {db_reservation.user_id}")
        print("="*80 + "\n")

        return {
    "id": db_reservation.id,
    "user_id": db_reservation.user_id,

    "name": user.name,
    "email": user.email,
    "phone": user.phone,

    "reservation_date": db_reservation.reservation_date,
    "reservation_time": db_reservation.reservation_time,
    "num_guests": db_reservation.num_guests,

    "seating_preference": db_reservation.seating_preference,
    "special_requests": db_reservation.special_requests,

    "status": db_reservation.status,
    "created_at": db_reservation.created_at,
    "updated_at": db_reservation.updated_at
}

    except Exception as e:
        db.rollback()
        
        print(f"❌ Error: {type(e).__name__}")
        print(f"Message: {str(e)}")
        import traceback
        traceback.print_exc()
        print("="*80 + "\n")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@app.get("/api/reservations/{reservation_id}", response_model=schemas.ReservationResponse)
async def get_reservation(
    reservation_id: int,
    email: str = Query(...),
    db: Session = Depends(get_db)
):
    """Get reservation by ID and email verification - PUBLIC"""
    reservation = db.query(Reservation).filter(
        Reservation.id == reservation_id
    ).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    # Verify email matches
    if reservation.user.email != email:
        raise HTTPException(status_code=403, detail="Email doesn't match reservation")
    
    return reservation

# -------- IMAGE UPLOAD --------
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload image - PUBLIC"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    filename = f"{int(time_module.time())}_{file.filename}"
    filepath = f"uploads/{filename}"
    
    try:
        async with aiofiles.open(filepath, 'wb') as f:
            contents = await file.read()
            await f.write(contents)
        
        return {
            "status": "success",
            "filename": filename,
            "url": f"/uploads/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ADMIN ENDPOINTS (REQUIRE API KEY) ====================

# -------- ADMIN MENU MANAGEMENT --------

@app.post("/admin/login")
async def admin_login(
    login: LoginRequest,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.username == login.username
    ).first()


    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )


    if login.password != admin.password_hash:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )


    api_key = create_admin_api_key(
        db,
        admin.id,
        "Login Key"
    )


    return {
        "status": "success",
        "api_key": api_key,
        "name": admin.full_name
    }


@app.post("/admin/menu", response_model=schemas.MenuItemResponse)
async def create_menu_item(
    menu: schemas.MenuItemCreate,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    db_item = MenuItem(
        name=menu.name,
        description=menu.description,
        category=menu.category,
        price_lkr=menu.price_lkr,
        image_url=menu.image_url,
        is_available=menu.is_available,
        is_chef_pick=menu.is_chef_pick
    )

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item

@app.put("/admin/menu/{item_id}", response_model=schemas.MenuItemResponse)
async def update_menu_item(
    item_id: int,
    data: schemas.MenuItemUpdate,
    admin=Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    if data.name is not None:
        item.name = data.name

    if data.description is not None:
        item.description = data.description

    if data.category is not None:
        item.category = data.category

    if data.price_lkr is not None:
        item.price_lkr = data.price_lkr

    if data.image_url is not None:
        item.image_url = data.image_url

    if data.is_available is not None:
        item.is_available = data.is_available

    if data.is_chef_pick is not None:
        item.is_chef_pick = data.is_chef_pick

    db.commit()
    db.refresh(item)

    return item

@app.delete("/admin/menu/{item_id}")
async def delete_menu_item(
    item_id: int,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete menu item - ADMIN ONLY"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Menu item deleted"}

# -------- ADMIN RESERVATIONS --------
# -------- ADMIN RESERVATIONS --------

# main.py - FIXED Admin Reservations Endpoint
@app.get("/admin/reservations")
async def get_all_reservations(
    db: Session = Depends(get_db)
):

    reservations = db.query(Reservation).all()

    result = []

    for r in reservations:
        result.append({
            "id": r.id,
            "user_id": r.user_id,

            "name": r.user.name,
            "email": r.user.email,
            "phone": r.user.phone,

            "reservation_date": r.reservation_date,
            "reservation_time": r.reservation_time,
            "num_guests": r.num_guests,

            "seating_preference": r.seating_preference,
            "special_requests": r.special_requests,

            "status": r.status,
            "created_at": r.created_at,
            "updated_at": r.updated_at
        })

    return result

@app.get("/admin/reservations/new-count")
def get_new_reservation_count(db: Session = Depends(get_db)):

    count = db.query(Reservation).filter(
        Reservation.status == "pending"
    ).count()

    return {
        "count": count
    }


@app.put(
    "/admin/reservations/{reservation_id}",
    response_model=schemas.ReservationResponse
)
async def update_reservation_status(
    reservation_id: int,
    data: schemas.ReservationStatusUpdate,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    reservation = db.query(Reservation).filter(
        Reservation.id == reservation_id
    ).first()


    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found"
        )


    reservation.status = data.status

    db.commit()
    db.refresh(reservation)


    return {
        "id": reservation.id,
        "user_id": reservation.user_id,

        "name": reservation.user.name if reservation.user else "",
        "email": reservation.user.email if reservation.user else "",
        "phone": reservation.user.phone if reservation.user else "",

        "reservation_date": reservation.reservation_date,
        "reservation_time": reservation.reservation_time,

        "num_guests": reservation.num_guests,

        "seating_preference": reservation.seating_preference,
        "special_requests": reservation.special_requests,

        "status": reservation.status,
        "created_at": reservation.created_at
    }

@app.delete("/admin/reservations/{reservation_id}")
async def delete_reservation(
    reservation_id: int,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete reservation - ADMIN ONLY"""
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    
    db.delete(reservation)
    db.commit()
    return {"status": "success", "message": "Reservation deleted"}

# -------- ADMIN EVENTS --------
@app.post("/admin/events", response_model=schemas.EventResponse)
async def create_event(
    title: str,
    description: Optional[str] = None,
    event_date: date = None,
    event_time: time = None,
    event_type: str = None,
    max_capacity: Optional[int] = None,
    is_active: bool = True,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create event - ADMIN ONLY"""
    db_event = Event(
        title=title,
        description=description,
        event_date=event_date,
        event_time=event_time,
        event_type=event_type,
        max_capacity=max_capacity,
        is_active=is_active
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.put("/admin/events/{event_id}", response_model=schemas.EventResponse)
async def update_event(
    event_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    event_date: Optional[date] = None,
    event_time: Optional[time] = None,
    is_active: Optional[bool] = None,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update event - ADMIN ONLY"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if title:
        event.title = title
    if description:
        event.description = description
    if event_date:
        event.event_date = event_date
    if event_time:
        event.event_time = event_time
    if is_active is not None:
        event.is_active = is_active
    
    db.commit()
    db.refresh(event)
    return event

@app.delete("/admin/events/{event_id}")
async def delete_event(
    event_id: int,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete event - ADMIN ONLY"""
    _ = admin  # Admin user verification passed
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return {"status": "success", "message": "Event deleted"}

# -------- ADMIN REVIEWS --------
@app.get("/admin/reviews", response_model=List[schemas.ReviewResponse])
async def get_all_reviews(
    approved_only: Optional[bool] = Query(None),
    admin=Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all reviews - ADMIN ONLY"""
    _ = admin  # Admin user verification passed
    query = db.query(Review)
    
    if approved_only is not None:
        query = query.filter(Review.is_approved == approved_only)
    
    return query.order_by(Review.created_at.desc()).all()

@app.put("/admin/reviews/{review_id}")
async def approve_review(
    review_id: int,
    is_approved: bool,
    admin=Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Approve/reject review - ADMIN ONLY"""
    _ = admin  # Admin user verification passed
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.is_approved = is_approved
    db.commit()
    db.refresh(review)
    return review

@app.delete("/admin/reviews/{review_id}")
async def delete_review(
    review_id: int,
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete review - ADMIN ONLY"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    db.commit()
    return {"status": "success", "message": "Review deleted"}

# -------- ADMIN DASHBOARD STATS --------
@app.get("/admin/stats", response_model=dict)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin = Depends(get_admin_user)
) -> dict:
    """Get dashboard statistics - ADMIN ONLY"""
    _ = admin  # Admin user verification passed
    total_reservations = db.query(Reservation).count()
    pending_reservations = db.query(Reservation).filter(Reservation.status == "Pending").count()
    total_reviews = db.query(Review).count()
    approved_reviews = db.query(Review).filter(Review.is_approved == True).count()
    total_menu_items = db.query(MenuItem).count()
    upcoming_events = db.query(Event).filter(
        Event.event_date >= date.today(),
        Event.is_active == True
    ).count()
    
    return {
        "total_reservations": total_reservations,
        "pending_reservations": pending_reservations,
        "total_reviews": total_reviews,
        "approved_reviews": approved_reviews,
        "total_menu_items": total_menu_items,
        "upcoming_events": upcoming_events
    }

# -------- ADMIN AUTH --------
@app.post("/admin/generate-key")
async def generate_admin_key(
    admin = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate new admin API key - ADMIN ONLY"""
    try:
        new_key = create_admin_api_key(db, admin.id)
        return {
            "status": "success",
            "api_key": new_key,
            "message": "Save this key securely - it won't be shown again"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ROOT ====================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Rupa's Bay Restaurant API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
        "note": "Frontend endpoints are public, admin endpoints require X-Admin-Key header"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
