# Rupa's Bay Backend Setup Guide v2.0

Complete setup guide for the restaurant backend with frontend integration and admin dashboard.

## 🎯 System Architecture

```
Frontend (Static HTML)          Admin Dashboard (React/Vue)
        ↓                               ↓
        └─────────────→ FastAPI Backend ←─────────────┘
                              ↓
                          MySQL Database
```

- **Frontend**: Uses public endpoints (NO authentication)
- **Admin Dashboard**: Uses admin endpoints (API key authentication)
- **Backend**: Handles all business logic and data persistence

## 📋 Prerequisites

- Python 3.8+
- MySQL 5.7+ or MariaDB
- Node.js (optional, for admin dashboard)
- pip or conda

## 🚀 Installation Steps

### 1. Clone & Setup Python Environment

```bash
mkdir rupa-bay-backend
cd rupa-bay-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup MySQL Database

```bash
# Start MySQL
mysql -u root -p

# Create database
mysql> CREATE DATABASE rupas_bay_new;
mysql> EXIT;

# Import schema
mysql -u root -p rupas_bay < database_schema_v2.sql

# Verify
mysql -u root -p rupas_bay
mysql> SHOW TABLES;
mysql> SELECT * FROM admins;
```

### 4. Configure Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit .env
nano .env
```

**Required Configuration:**

```env
# Database
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rupas_bay

# Frontend
FRONTEND_URL=http://localhost:3000

# API
API_PORT=8000
API_HOST=0.0.0.0
```

### 5. Run the Backend

```bash
# Using uvicorn directly
python app.py

# Or with uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Visit http://localhost:8000/docs for API documentation
```

## 📱 Frontend Integration

### Step 1: Update Frontend Configuration

In your HTML file, update the API configuration:

```javascript
const API_URL = "http://localhost:8000"; // Change to your backend URL
```

### Step 2: Add JavaScript Functions

Copy the code from `FRONTEND_INTEGRATION.md` to your HTML file's `<script>` section.

### Step 3: Test Endpoints

1. Open your HTML file in a browser
2. Check browser console for any errors
3. Verify data is loading from the backend

### Example: Menu Loading

```javascript
// This will automatically load menu from backend
async function loadMenu() {
  const response = await fetch('http://localhost:8000/api/menu');
  const items = await response.json();
  console.log('Menu items:', items);
}

loadMenu();
```

## 🔐 Admin Dashboard Setup

### Step 1: Default Admin Credentials

**Username:** admin  
**Password:** admin123  
**Email:** admin@rupasbay.lk

⚠️ **CHANGE THESE CREDENTIALS IMMEDIATELY AFTER FIRST LOGIN!**

### Step 2: Generate Admin API Key

#### Option A: Using cURL

```bash
# First, get the default key from database or login
# Then generate a new key

curl -X POST http://localhost:8000/admin/generate-key \
  -H "X-Admin-Key: your_current_admin_key"
```

#### Option B: Using Python

```python
from admin_auth import create_admin_api_key
from database import SessionLocal
from models import Admin

db = SessionLocal()
admin = db.query(Admin).filter(Admin.username == "admin").first()
new_key = create_admin_api_key(db, admin.id)
print(f"New Admin Key: {new_key}")
```

#### Option C: Manually in Database

```sql
-- Generate a key hash (use Python or an online tool)
-- For example: sha256("your_api_key_here")

INSERT INTO admin_api_keys (key_hash, admin_id, name, is_active) 
VALUES ('hash_of_your_key', 1, 'Dashboard Key', 1);
```

### Step 3: Create Admin Dashboard

Use the admin API key to build your admin dashboard. Example with JavaScript:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Rupa's Bay Admin Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>Admin Dashboard</h1>
    <div id="stats"></div>
    
    <script>
        const API_URL = 'http://localhost:8000';
        const ADMIN_KEY = 'your_admin_api_key_here';
        
        async function loadStats() {
            const response = await fetch(`${API_URL}/admin/stats`, {
                headers: {
                    'X-Admin-Key': ADMIN_KEY
                }
            });
            const stats = await response.json();
            
            document.getElementById('stats').innerHTML = `
                <p>Total Reservations: ${stats.total_reservations}</p>
                <p>Pending: ${stats.pending_reservations}</p>
                <p>Total Reviews: ${stats.total_reviews}</p>
                <p>Approved: ${stats.approved_reviews}</p>
            `;
        }
        
        loadStats();
    </script>
</body>
</html>
```

## 📊 API Endpoints Reference

### Public Endpoints (Frontend)

```
GET    /api/menu                      - Get menu items
GET    /api/menu/{id}                 - Get single menu item
GET    /api/events                    - Get events
GET    /api/events/{id}               - Get single event
GET    /api/reviews                   - Get approved reviews
GET    /api/reviews/stats             - Get review statistics
POST   /api/reviews                   - Submit review
POST   /api/reservations              - Create reservation
GET    /api/reservations/{id}         - Get reservation (with email verification)
POST   /api/upload                    - Upload image
```

### Admin Endpoints (Dashboard)

```
# Menu Management
POST   /admin/menu                    - Create menu item
PUT    /admin/menu/{id}               - Update menu item
DELETE /admin/menu/{id}               - Delete menu item

# Reservations
GET    /admin/reservations            - Get all reservations
PUT    /admin/reservations/{id}       - Update reservation status
DELETE /admin/reservations/{id}       - Delete reservation

# Events
POST   /admin/events                  - Create event
PUT    /admin/events/{id}             - Update event
DELETE /admin/events/{id}             - Delete event

# Reviews
GET    /admin/reviews                 - Get all reviews (pending + approved)
PUT    /admin/reviews/{id}            - Approve/reject review
DELETE /admin/reviews/{id}            - Delete review

# Statistics
GET    /admin/stats                   - Get dashboard statistics

# Authentication
POST   /admin/generate-key            - Generate new API key
```

**All admin endpoints require header:**
```
X-Admin-Key: your_admin_api_key_here
```

## 🗂️ Project Structure

```
rupa-bay-backend/
├── app.py                      # Main FastAPI application
├── models.py                   # SQLAlchemy database models
├── schemas.py                  # Pydantic validation schemas
├── database.py                 # Database connection setup
├── admin_auth.py              # Admin authentication system
├── requirements.txt           # Python dependencies
├── database_schema_v2.sql     # MySQL schema
├── .env.example               # Environment template
├── FRONTEND_INTEGRATION.md    # Frontend guide
└── SETUP_GUIDE_V2.md         # This file
```

## 🔧 Development Workflow

### 1. Make Changes to Backend

```python
# Example: Add new field to menu item
# Edit models.py, then create migration or recreate database
```

### 2. Test with Frontend

```bash
# Keep backend running
python app.py

# Open frontend in browser
# Check console for any API errors
```

### 3. Test with Admin Dashboard

```bash
# Use the admin API endpoints to manage data
# Example: Create menu item

curl -X POST http://localhost:8000/admin/menu \
  -H "X-Admin-Key: your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Dish",
    "category": "Seafood",
    "price_lkr": 1200
  }'
```

## 🚀 Deployment

### Production Checklist

- [ ] Change admin password
- [ ] Generate new admin API keys
- [ ] Update `FRONTEND_URL` in `.env`
- [ ] Set up proper logging
- [ ] Configure HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure CORS for production domain
- [ ] Test all endpoints in production
- [ ] Set up monitoring
- [ ] Create automated backups

### Docker Deployment

```bash
# Build image
docker build -t rupas-bay-api .

# Run container
docker run -p 8000:8000 \
  -e DB_USER=root \
  -e DB_PASSWORD=password \
  -e DB_HOST=db \
  rupas-bay-api
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## 📊 Database Management

### Backup

```bash
# Full backup
mysqldump -u root -p rupas_bay > backup.sql

# Backup with timestamp
mysqldump -u root -p rupas_bay > rupas_bay_$(date +%Y%m%d_%H%M%S).sql
```

### Restore

```bash
mysql -u root -p rupas_bay < backup.sql
```

### View Data

```bash
# View menu items
mysql -u root -p rupas_bay -e "SELECT id, name, price_lkr FROM menu_items;"

# View reservations
mysql -u root -p rupas_bay -e "SELECT * FROM reservations WHERE status='Pending';"

# View admin keys
mysql -u root -p rupas_bay -e "SELECT id, name, is_active FROM admin_api_keys;"
```

## 🐛 Common Issues & Solutions

### Issue: CORS Error

**Solution:**
```env
# Update FRONTEND_URL in .env
FRONTEND_URL=http://your-frontend-domain.com
```

### Issue: Database Connection Fails

**Solution:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: Admin Key Not Working

**Solution:**
```bash
# Regenerate key
python -c "from admin_auth import create_admin_api_key; from database import SessionLocal; from models import Admin; db = SessionLocal(); admin = db.query(Admin).filter_by(username='admin').first(); print(create_admin_api_key(db, admin.id))"

# Verify key is active
mysql -u root -p rupas_bay -e "SELECT * FROM admin_api_keys WHERE is_active=1;"
```

### Issue: Uploads Not Working

**Solution:**
```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Verify permissions
ls -la uploads
```

## 📚 Additional Resources

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Frontend Guide**: See FRONTEND_INTEGRATION.md

## 🆘 Support & Help

- **Email**: hello@rupasbay.lk
- **API Docs**: Visit `/docs` when backend is running
- **Check Logs**: Backend logs appear in terminal

## 📝 Next Steps

1. ✅ Setup backend
2. ✅ Configure database
3. ✅ Integrate frontend
4. ⬜ Create admin dashboard
5. ⬜ Deploy to production

---

**Version**: 2.0.0  
**Last Updated**: July 2026  
**Status**: Ready for Production
