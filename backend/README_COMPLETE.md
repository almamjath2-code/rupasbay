# 🌊 Rupa's Bay Restaurant - Complete Backend Package

A production-ready FastAPI backend for the Rupa's Bay restaurant website with admin dashboard support.

**Version:** 2.0.0  
**Status:** Ready for Production  
**Last Updated:** July 2026

---

## 📦 What's Included

### Core Files
- **app.py** - Main FastAPI application with 30+ endpoints
- **models.py** - SQLAlchemy database models
- **schemas.py** - Pydantic validation models
- **database.py** - MySQL connection setup
- **admin_auth.py** - Admin authentication system
- **requirements.txt** - Python dependencies

### Database
- **database_schema.sql** - Complete MySQL schema with sample data
- Includes admin tables + restaurant tables
- Ready for import

### Configuration
- **.env.example** - Environment variables template
- **docker-compose.yml** - Docker setup for development
- **Dockerfile** - Container image configuration

### Documentation
- **SETUP_GUIDE_V2.md** - Complete installation guide ⭐ START HERE
- **FRONTEND_INTEGRATION.md** - How to connect your HTML frontend
- **README.md** - Original project overview (v1.0)

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Python 3.8+
- MySQL 5.7+
- pip

### Step 1: Setup Python Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE rupas_bay;"

# Import schema
mysql -u root -p rupas_bay < database_schema.sql
```

### Step 4: Configure Environment

```bash
cp .env.example .env
# Edit .env with your MySQL credentials
nano .env
```

### Step 5: Run Backend

```bash
python app.py
# Or: uvicorn app:app --reload
```

✅ **Backend running at:** http://localhost:8000  
📚 **API Docs:** http://localhost:8000/docs

---

## 🎯 System Overview

### Architecture

```
┌─────────────────────────────────────────────────┐
│            Rupa's Bay Restaurant                │
└─────────────────────────────────────────────────┘
         ↓                           ↓
    ┌─────────┐              ┌──────────────┐
    │Frontend │              │Admin         │
    │(HTML)   │              │Dashboard     │
    └────┬────┘              └──────┬───────┘
         │                          │
         │  No Auth Needed          │  Needs API Key
         │                          │
         └──────────────┬───────────┘
                        ↓
            ┌──────────────────────┐
            │   FastAPI Backend    │
            │    (this package)    │
            └──────────┬───────────┘
                       ↓
            ┌──────────────────────┐
            │   MySQL Database     │
            └──────────────────────┘
```

### Endpoints

**Public (Frontend):**
- ✅ `GET /api/menu` - Menu items
- ✅ `GET /api/events` - Events
- ✅ `GET /api/reviews` - Reviews
- ✅ `POST /api/reviews` - Submit review
- ✅ `POST /api/reservations` - Make reservation
- ✅ `POST /api/upload` - Upload images

**Admin (Dashboard):**
- 🔐 `POST /admin/menu` - Create menu item
- 🔐 `PUT /admin/menu/{id}` - Update menu
- 🔐 `DELETE /admin/menu/{id}` - Delete menu
- 🔐 `GET /admin/reservations` - All reservations
- 🔐 `PUT /admin/reservations/{id}` - Update reservation
- 🔐 `GET /admin/reviews` - All reviews
- 🔐 `PUT /admin/reviews/{id}` - Approve reviews
- 🔐 `GET /admin/stats` - Dashboard stats

---

## 📖 Documentation Guide

### For Frontend Developers
👉 Read **FRONTEND_INTEGRATION.md**
- How to connect HTML to backend
- JavaScript examples
- API endpoint reference
- Complete integration code

### For Full Setup & Admin Dashboard
👉 Read **SETUP_GUIDE_V2.md**
- Installation steps
- Database setup
- Admin configuration
- API key generation
- Deployment guide

### For Quick Reference
👉 This file (README_COMPLETE.md)
- Overview of all components
- Quick start guide
- File descriptions

---

## 📁 File Descriptions

### Python Files

**app.py** (17 KB)
- Main FastAPI application
- All 30+ API endpoints
- CORS configuration
- Request/response handling

**models.py** (4.7 KB)
- SQLAlchemy ORM models
- Database schema definition
- Relationships and constraints
- Admin + Restaurant tables

**schemas.py** (2.9 KB)
- Pydantic validation schemas
- Request body validators
- Response models
- Type definitions

**database.py** (1.4 KB)
- MySQL connection setup
- SessionLocal factory
- Database utilities
- Connection testing

**admin_auth.py** (3.2 KB)
- API key generation
- API key hashing
- Admin authentication
- Key verification logic

### SQL Files

**database_schema.sql** (5.6 KB)
- Complete database structure
- 8 tables (Admin + Restaurant)
- Indexes for performance
- Sample data included
- Default admin user

### Configuration

**.env.example**
- Template for environment variables
- Database credentials
- API settings
- Copy to `.env` and edit

**requirements.txt** (264 bytes)
- All Python dependencies
- Exact versions for compatibility
- Run: `pip install -r requirements.txt`

**docker-compose.yml** (1.2 KB)
- MySQL + API services
- Network configuration
- Volume mounts
- Run: `docker-compose up -d`

**Dockerfile** (432 bytes)
- Container image definition
- Python 3.9 base
- Dependency installation
- Default entrypoint

### Documentation

**SETUP_GUIDE_V2.md** (11 KB)
- Complete installation guide
- Step-by-step setup
- Admin configuration
- Deployment checklist
- Troubleshooting

**FRONTEND_INTEGRATION.md** (13 KB)
- Frontend connection guide
- JavaScript examples
- All public endpoints
- Response examples
- Complete integration code

**README.md** (8.4 KB)
- Project overview
- Original features list
- Usage examples

---

## 🔐 Admin Dashboard Setup

### Default Credentials

```
Username: admin
Password: admin123
Email: admin@rupasbay.lk
```

⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN!**

### Generate API Key

```python
# Option 1: Using Python
from admin_auth import create_admin_api_key
from database import SessionLocal
from models import Admin

db = SessionLocal()
admin = db.query(Admin).filter_by(username="admin").first()
api_key = create_admin_api_key(db, admin.id)
print(api_key)
```

```sql
-- Option 2: Using MySQL
-- First generate SHA256 hash of your key
INSERT INTO admin_api_keys (key_hash, admin_id, name, is_active) 
VALUES ('hash_here', 1, 'Dashboard Key', 1);
```

### Use API Key in Dashboard

```javascript
const ADMIN_KEY = 'your_api_key_here';

fetch('http://localhost:8000/admin/stats', {
  headers: {
    'X-Admin-Key': ADMIN_KEY
  }
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## 🛠️ Development

### Local Development

```bash
# Activate environment
source venv/bin/activate

# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app:app --reload --port 8000
```

### Testing API Endpoints

**Using cURL:**
```bash
# Public endpoint (no auth)
curl http://localhost:8000/api/menu

# Admin endpoint (with key)
curl -H "X-Admin-Key: your_key" http://localhost:8000/admin/stats
```

**Using Python:**
```python
import requests

# Public
menu = requests.get('http://localhost:8000/api/menu').json()
print(menu)

# Admin
admin_key = 'your_api_key'
stats = requests.get(
    'http://localhost:8000/admin/stats',
    headers={'X-Admin-Key': admin_key}
).json()
print(stats)
```

### File Structure

```
project/
├── app.py                      # Main FastAPI app
├── models.py                   # Database models
├── schemas.py                  # Validation schemas
├── database.py                 # DB connection
├── admin_auth.py              # Admin authentication
├── requirements.txt           # Dependencies
├── database_schema.sql        # MySQL schema
├── docker-compose.yml         # Docker config
├── .env.example               # Environment template
├── Dockerfile                 # Container image
├── README_COMPLETE.md         # This file
├── SETUP_GUIDE_V2.md         # Setup guide
└── FRONTEND_INTEGRATION.md   # Frontend guide
```

---

## 🚀 Deployment

### Using Docker

```bash
# Build image
docker build -t rupas-bay-api:latest .

# Run container
docker run -p 8000:8000 \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  -e DB_HOST=mysql_host \
  rupas-bay-api:latest
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down
```

### Production Deployment

See **SETUP_GUIDE_V2.md** for:
- ✅ Production checklist
- ✅ Environment configuration
- ✅ SSL/HTTPS setup
- ✅ Database backups
- ✅ Monitoring setup

---

## 📊 Database Schema

### Tables

**admins**
- Admin user accounts
- username, email, password_hash
- is_active flag

**admin_api_keys**
- Admin API keys
- Linked to admins table
- key_hash (SHA256)
- is_active flag

**users**
- Customer/guest accounts
- name, email, phone
- Auto-created on first reservation

**menu_items**
- Restaurant menu
- name, description, category
- price_lkr, image_url
- is_chef_pick flag

**reservations**
- Table reservations
- user_id, date, time
- num_guests, seating_preference
- status (Pending, Confirmed, Completed)

**events**
- Special events
- title, event_type
- date, time
- is_active flag

**reviews**
- Guest reviews
- user_id, rating (1-5)
- comment, photo_url
- is_approved flag

---

## 🐛 Troubleshooting

### Problem: Connection Error

```
Error: Can't connect to MySQL server
```

**Solution:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in .env
# Test connection
mysql -u root -p -h localhost
```

### Problem: Port Already in Use

```
Address already in use
```

**Solution:**
```bash
# Change port
uvicorn app:app --port 8001

# Or kill process
sudo lsof -ti:8000 | xargs kill -9
```

### Problem: CORS Error

```
Access-Control-Allow-Origin header missing
```

**Solution:**
```env
# Update FRONTEND_URL in .env
FRONTEND_URL=http://your-frontend-domain.com
```

### Problem: Admin Key Not Working

```
Invalid admin API key
```

**Solution:**
```bash
# Regenerate key
# Check key is active in database
mysql -u root -p rupas_bay -e "SELECT * FROM admin_api_keys;"

# Check header format
# Must be: X-Admin-Key: your_key_here
```

---

## 📚 Resources

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Official Docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Pydantic**: https://docs.pydantic.dev/

### Guides in This Package
- SETUP_GUIDE_V2.md - Installation & configuration
- FRONTEND_INTEGRATION.md - Frontend connection guide
- README.md - Project overview

---

## 🎯 Next Steps

### After Installation
1. ✅ Run backend (`python app.py`)
2. ✅ Check API docs (`/docs`)
3. ✅ Test health endpoint (`/health`)
4. ⬜ Connect frontend (see FRONTEND_INTEGRATION.md)
5. ⬜ Create admin dashboard
6. ⬜ Deploy to production

### For Frontend Integration
1. Read **FRONTEND_INTEGRATION.md**
2. Add JavaScript functions to your HTML
3. Update API_URL in frontend config
4. Test menu, events, reviews loading
5. Test reservation form submission
6. Test review submission

### For Admin Dashboard
1. Read **SETUP_GUIDE_V2.md** (Admin section)
2. Generate admin API key
3. Build dashboard UI
4. Connect admin endpoints
5. Test data management
6. Deploy dashboard

---

## 📞 Support & Contact

- **Email**: hello@rupasbay.lk
- **Location**: Arugam Bay, Sri Lanka
- **API Docs**: Visit `/docs` when backend is running

---

## ✨ Features

### Frontend Endpoints
- ✅ Dynamic menu loading by category
- ✅ Event calendar integration
- ✅ Guest reviews display
- ✅ Rating statistics
- ✅ Table reservation system
- ✅ Image uploads for reviews
- ✅ Email verification for reservations

### Admin Dashboard
- ✅ API key authentication
- ✅ Menu item management (CRUD)
- ✅ Reservation management
- ✅ Review moderation
- ✅ Event management
- ✅ Dashboard statistics
- ✅ Pending reservations tracking

### Database
- ✅ MySQL 5.7+ compatible
- ✅ Optimized indexes
- ✅ Relationship constraints
- ✅ Sample data included
- ✅ Admin user pre-configured

---

## 📝 License

© 2026 Rupa's Bay Restaurant & Bar. All rights reserved.

---

## 🚀 Production Deployment

This backend is production-ready. Before deploying:

- [ ] Change admin password
- [ ] Generate new admin API keys
- [ ] Update CORS origins for production
- [ ] Configure HTTPS/SSL
- [ ] Setup database backups
- [ ] Enable logging
- [ ] Setup monitoring
- [ ] Test all endpoints
- [ ] Load test the database

See **SETUP_GUIDE_V2.md** for complete deployment checklist.

---

**Ready to launch your restaurant backend? Start with SETUP_GUIDE_V2.md! 🚀**
