# Quick Start Guide - Rupa's Bay Admin Dashboard

## ⚡ 5-Minute Setup

### Step 1: Create Folder Structure
Create this folder structure on your computer:

```
your-project-folder/
└── admin/
    ├── login.html
    ├── dashboard.html
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── api.js
    │   ├── components.js
    │   ├── login.js
    │   └── dashboard.js
    └── README.md
```

### Step 2: Add Files
Copy all provided files to their corresponding locations:
- `login.html` → `admin/`
- `dashboard.html` → `admin/`
- `style.css` → `admin/css/`
- `api.js` → `admin/js/`
- `components.js` → `admin/js/`
- `login.js` → `admin/js/`
- `dashboard.js` → `admin/js/`

### Step 3: Verify Backend
Make sure your FastAPI backend is running:
```bash
# Terminal/Command Prompt
python main.py
# or
uvicorn main:app --reload
```

Backend should be running at: `http://127.0.0.1:8000`

### Step 4: Start Admin Dashboard
Open your web browser and go to:
```
file:///path/to/your-project-folder/admin/login.html
```

Or use a local server (recommended):
```bash
# Python 3.x
python -m http.server 8080

# Then open: http://localhost:8080/admin/login.html
```

### Step 5: Login
1. You need an admin API key from your backend
2. To generate one (if your backend supports it):
   - Make a POST request to `/admin/generate-key`
3. Enter the API key in the login form
4. Click "Login"

## 🔑 Getting an Admin API Key

If you don't have an API key yet, generate one from your backend:

```python
# In your FastAPI backend
from fastapi import FastAPI

app = FastAPI()

@app.post("/admin/generate-key")
async def generate_admin_key():
    # Generate and return a new admin API key
    import secrets
    api_key = secrets.token_urlsafe(32)
    # Store it securely in your database
    return {"api_key": api_key}
```

Or add this to your backend if it doesn't exist:

```python
# Simple version (not recommended for production)
ADMIN_API_KEY = "your-secret-admin-key-here"

@app.get("/admin/stats")
async def get_admin_stats(x_api_key: str = Header(None)):
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    # Return stats
```

## 📋 Expected API Responses

Your backend should return data in these formats:

### /admin/stats
```json
{
    "total_menu_items": 25,
    "total_reservations": 150,
    "pending_reservations": 5,
    "approved_reviews": 42,
    "upcoming_events": 3,
    "average_rating": 4.5,
    "menu": [
        {
            "id": 1,
            "name": "Grilled Fish",
            "category": "Main",
            "price": 25.99,
            "chef_pick": true,
            "available": true,
            "image_url": "https://..."
        }
    ],
    "reservations": [
        {
            "id": 1,
            "customer_name": "John Doe",
            "phone": "123-456-7890",
            "email": "john@example.com",
            "guests": 4,
            "date": "2024-02-15",
            "time": "19:00",
            "status": "pending",
            "special_requests": "Window seat"
        }
    ],
    "reviews": [
        {
            "id": 1,
            "customer": "Jane Smith",
            "rating": 5,
            "comment": "Excellent food and service!",
            "photo_url": "https://...",
            "date": "2024-02-10"
        }
    ]
}
```

### /api/menu
```json
[
    {
        "id": 1,
        "name": "Grilled Fish",
        "description": "Fresh grilled fish with herbs",
        "category": "Main",
        "price": 25.99,
        "chef_pick": true,
        "available": true,
        "image_url": "https://...",
        "created_at": "2024-01-01T00:00:00"
    }
]
```

### /api/events
```json
[
    {
        "id": 1,
        "title": "Wine Tasting Night",
        "description": "Join us for an evening of wine and cheese",
        "date": "2024-03-15",
        "image_url": "https://...",
        "created_at": "2024-01-01T00:00:00"
    }
]
```

## 🚀 Common Tasks

### Creating a Menu Item
1. Go to Dashboard → Menu Management
2. Click "Add Menu Item"
3. Fill in the form:
   - Name (required)
   - Description
   - Price (required)
   - Category (required)
   - Check "Chef Pick" if it's a special item
   - Check "Available" if it's available
   - Upload an image
4. Click "Save Item"

### Managing Reservations
1. Go to Dashboard → Reservations
2. View all reservations in the table
3. Search by customer name or email
4. Filter by status (Pending, Approved, Cancelled)
5. Click the checkmark button to change status
6. Click the trash button to delete

### Creating an Event
1. Go to Dashboard → Events
2. Click "Create Event"
3. Fill in:
   - Title (required)
   - Description
   - Date (required)
   - Upload an image
4. Click "Create Event"

### Upload Gallery Images
1. Go to Dashboard → Gallery
2. Either:
   - Drag and drop images onto the upload area
   - Click the upload area to select files
3. Supported formats: JPG, PNG, GIF
4. Hover over images and click trash to delete

## 🎯 Features Overview

| Feature | Location | What It Does |
|---------|----------|--------------|
| Dashboard | Home | Shows stats and charts |
| Menu Items | Menu Management | Add/edit/delete menu items |
| Reservations | Reservations | Manage customer bookings |
| Reviews | Reviews | Approve/delete customer reviews |
| Events | Events | Create and manage events |
| Images | Gallery | Upload restaurant photos |
| Settings | Settings | Configure restaurant info |
| Dark Mode | Header | Toggle dark theme |
| Logout | Sidebar | Sign out of dashboard |

## 🔧 Configuration

### Change API URL
If your backend is on a different URL, edit `js/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:8000';
```

### Change Theme Colors
Edit `css/style.css` and modify these variables:
```css
:root {
    --primary-color: #2d5016;      /* Dark Green */
    --secondary-color: #f5f1e8;    /* Soft Beige */
    --accent-color: #c9a961;       /* Gold */
    --danger-color: #e74c3c;       /* Red */
}
```

### Items Per Page
In `js/dashboard.js`, find `new Paginator` and change the second parameter:
```javascript
menuPaginator = new Paginator(menuItems, 10); // Change 10 to your preference
```

## 🐛 Debugging

### Enable Debug Logs
Open browser DevTools (F12) and check the Console tab for any errors.

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Try an action (load menu, add item, etc.)
4. Look for failed requests (red)
5. Click the request to see the error details

### Common Issues

**"API connection refused"**
- Make sure backend is running
- Check backend is on `http://127.0.0.1:8000`
- Check CORS is enabled in backend

**"Invalid API key"**
- Verify the API key is correct
- Regenerate the API key in your backend
- Clear local storage: DevTools → Application → Local Storage

**"No data showing"**
- Check browser console for errors
- Verify API endpoints exist
- Check Network tab for API responses

## 📱 Mobile Access

The dashboard works on mobile devices! To access from mobile:

1. On your computer, start a local server:
   ```bash
   python -m http.server 8080
   ```

2. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig | find "IPv4"
   
   # Mac/Linux
   ifconfig | grep "inet "
   ```

3. On mobile, visit: `http://[YOUR-IP]:8080/admin/login.html`

## ✅ Checklist

- [ ] Folder structure created
- [ ] All files copied to correct locations
- [ ] Backend is running on port 8000
- [ ] API key generated from backend
- [ ] Can access login.html in browser
- [ ] Can login with API key
- [ ] Dashboard loads without errors
- [ ] Can load menu items
- [ ] Can create new menu item
- [ ] Dark mode toggle works
- [ ] Responsive design works on mobile

## 🎉 You're Ready!

Your admin dashboard is now ready to use! Start by:
1. Logging in with your API key
2. Exploring the Dashboard
3. Adding your first menu items
4. Creating events
5. Managing reservations

For more detailed information, see README.md

## 📞 Support Tips

- Check browser console (F12) for error messages
- Verify all URLs and API keys
- Test API endpoints directly with tools like Postman
- Make sure headers include the API key
- Clear cache if things look wrong

Good luck! 🚀
