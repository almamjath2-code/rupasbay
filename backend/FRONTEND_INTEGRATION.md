# Frontend Integration Guide - Rupa's Bay API

This guide explains how to connect your HTML frontend to the backend API.

## 🔌 API Base URL

```javascript
const API_URL = "http://127.0.0.1:8000";
// Change to your production URL in deployment
```

## 📋 PUBLIC ENDPOINTS (No Authentication Required)

### 1. Get Menu Items

**Endpoint:**
```
GET /api/menu?category=Sri%20Lankan&available_only=true
```

**JavaScript Example:**
```javascript
async function loadMenu() {
  try {
    const response = await fetch(`${API_URL}/api/menu`);
    const menuItems = await response.json();
    displayMenu(menuItems);
  } catch (error) {
    console.error('Failed to load menu:', error);
  }
}

function displayMenu(items) {
  items.forEach(item => {
    console.log(`${item.name} - Rs ${item.price_lkr}`);
  });
}
```

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Rupa's Rice & Curry",
    "description": "Three curries, sambol, papadum",
    "category": "Sri Lankan",
    "price_lkr": 950,
    "image_url": "/images/rice-curry.jpg",
    "is_available": true,
    "is_chef_pick": true,
    "created_at": "2026-07-20T10:30:00"
  }
]
```

### 2. Get Events

**Endpoint:**
```
GET /api/events?active_only=true
```

**JavaScript Example:**
```javascript
async function loadEvents() {
  const response = await fetch(`${API_URL}/api/events`);
  const events = await response.json();
  
  events.forEach(event => {
    console.log(`${event.title} - ${event.event_date} at ${event.event_time}`);
  });
}
```

### 3. Get Reviews

**Endpoint:**
```
GET /api/reviews?approved_only=true&limit=50
```

**JavaScript Example:**
```javascript
async function loadReviews() {
  const response = await fetch(`${API_URL}/api/reviews`);
  const reviews = await response.json();
  displayReviews(reviews);
}

function displayReviews(reviews) {
  reviews.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    console.log(`${stars} ${review.comment}`);
  });
}
```

### 4. Get Review Statistics

**Endpoint:**
```
GET /api/reviews/stats
```

**Response Example:**
```json
{
  "average_rating": 4.9,
  "total_reviews": 61,
  "rating_distribution": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 9,
    "5": 88
  }
}
```

**JavaScript Example:**
```javascript
async function loadReviewStats() {
  const response = await fetch(`${API_URL}/api/reviews/stats`);
  const stats = await response.json();
  
  document.getElementById('averageRating').textContent = stats.average_rating;
  document.getElementById('reviewCount').textContent = 
    `Based on ${stats.total_reviews} reviews`;
  
  // Update rating bars
  const total = stats.total_reviews;
  for (let i = 1; i <= 5; i++) {
    const percent = (stats.rating_distribution[i.toString()] / total) * 100;
    document.getElementById(`${getStarName(i)}Star`).style.width = percent + '%';
  }
}

function getStarName(num) {
  const names = ['', 'one', 'two', 'three', 'four', 'five'];
  return names[num];
}
```

### 5. Submit a Review

**Endpoint:**
```
POST /api/reviews
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rating": 5,
  "comment": "Amazing food and service!",
  "photo_url": "/uploads/photo123.jpg"
}
```

**JavaScript Example:**
```javascript
async function submitReview() {
  const reviewData = {
    name: document.getElementById('reviewName').value,
    email: document.getElementById('reviewEmail').value,
    rating: parseInt(document.getElementById('reviewRating').value),
    comment: document.getElementById('reviewComment').value,
    photo_url: document.getElementById('photoUrl')?.value || null
  };

  try {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    
    if (response.ok) {
      alert('Review submitted! Thank you.');
      document.getElementById('reviewForm').reset();
      loadReviews(); // Reload reviews
    }
  } catch (error) {
    console.error('Failed to submit review:', error);
  }
}
```

### 6. Create a Reservation

**Endpoint:**
```
POST /api/reservations
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+94701234567",
  "reservation_date": "2026-08-15",
  "reservation_time": "18:00",
  "num_guests": 4,
  "seating_preference": "Beachfront",
  "special_requests": "Window seat if possible"
}
```

**JavaScript Example:**
```javascript
async function submitReservation(e) {
  e.preventDefault();
  
  const formData = new FormData(document.getElementById('reserveForm'));
  const reservationData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    reservation_date: formData.get('date'),
    reservation_time: formData.get('time'),
    num_guests: parseInt(formData.get('guests')),
    seating_preference: document.querySelector('.seat-opt.selected')?.dataset.seat || 'Beachfront',
    special_requests: formData.get('special_requests')
  };

  try {
    const response = await fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(`Reservation confirmed! Confirmation ID: ${result.id}`);
      document.getElementById('confirmBox').classList.add('show');
    }
  } catch (error) {
    console.error('Reservation failed:', error);
    alert('Failed to create reservation. Please try again.');
  }
}

// Attach to form
document.getElementById('reserveForm').addEventListener('submit', submitReservation);
```

### 7. Upload Image

**Endpoint:**
```
POST /api/upload
Content-Type: multipart/form-data
```

**JavaScript Example:**
```javascript
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.url; // Use this URL in reviews/reservations
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// Usage
document.getElementById('reviewPhoto').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const photoUrl = await uploadImage(file);
  document.getElementById('photoUrl').value = photoUrl;
});
```

## 🔐 ADMIN ENDPOINTS (Require API Key)

Admin endpoints require the `X-Admin-Key` header.

**Header:**
```
X-Admin-Key: your_admin_api_key_here
```

### Admin Menu Management

**Create Menu Item:**
```
POST /admin/menu
```

**Update Menu Item:**
```
PUT /admin/menu/{item_id}
```

**Delete Menu Item:**
```
DELETE /admin/menu/{item_id}
```

### Admin Reservations

**Get All Reservations:**
```
GET /admin/reservations?status=Pending&date_from=2026-08-01
```

**Update Reservation Status:**
```
PUT /admin/reservations/{reservation_id}
Body: { "status": "Confirmed" }
```

**Delete Reservation:**
```
DELETE /admin/reservations/{reservation_id}
```

### Admin Events

**Create Event:**
```
POST /admin/events
```

**Update Event:**
```
PUT /admin/events/{event_id}
```

**Delete Event:**
```
DELETE /admin/events/{event_id}
```

### Admin Reviews

**Get All Reviews:**
```
GET /admin/reviews?approved_only=false
```

**Approve Review:**
```
PUT /admin/reviews/{review_id}
Body: { "is_approved": true }
```

**Delete Review:**
```
DELETE /admin/reviews/{review_id}
```

### Dashboard Statistics

**Get Stats:**
```
GET /admin/stats
```

**Response:**
```json
{
  "total_reservations": 50,
  "pending_reservations": 5,
  "total_reviews": 61,
  "approved_reviews": 60,
  "total_menu_items": 24,
  "upcoming_events": 3
}
```

## 📱 Complete Integration Example

Here's a complete integration of the frontend's JavaScript:

```javascript
// API Configuration
const API_URL = "http://127.0.0.1:8000";

// ============ LOAD PAGE DATA ============
async function initializePage() {
  await loadMenu();
  await loadEvents();
  await loadReviews();
  await loadReviewStats();
}

// ============ MENU ============
async function loadMenu() {
  const categories = ['srilankan', 'seafood', 'bbq', 'vegan', 'drinks', 'breakfast'];
  
  for (const category of categories) {
    const response = await fetch(`${API_URL}/api/menu?category=${getCategoryName(category)}`);
    const items = await response.json();
    
    const panel = document.querySelector(`[data-panel="${category}"]`);
    const menuList = panel.querySelector('.menu-list');
    menuList.innerHTML = '';
    
    items.forEach(item => {
      const itemHTML = `
        <div class="menu-item">
          <img src="${item.image_url || 'placeholder.jpg'}" alt="${item.name}" class="menu-image">
          <div class="menu-content">
            <h4>${item.name}</h4>
            <p>${item.description || ''}</p>
            ${item.is_chef_pick ? '<span class="tag">Chef\'s Pick</span>' : ''}
          </div>
          <span class="price">Rs ${item.price_lkr}</span>
        </div>
      `;
      menuList.innerHTML += itemHTML;
    });
  }
}

function getCategoryName(key) {
  const map = {
    'srilankan': 'Sri Lankan',
    'seafood': 'Seafood',
    'bbq': 'BBQ',
    'vegan': 'Vegan & Healthy',
    'drinks': 'Drinks & Cocktails',
    'breakfast': 'Breakfast'
  };
  return map[key];
}

// ============ EVENTS ============
async function loadEvents() {
  const response = await fetch(`${API_URL}/api/events`);
  const events = await response.json();
  
  const eventList = document.querySelector('.ev-list');
  eventList.innerHTML = '';
  
  events.forEach(event => {
    const eventHTML = `
      <div class="ev-row">
        <div class="ev-day">${formatEventDate(event.event_date)}</div>
        <div class="ev-name">${event.title}</div>
        <div class="ev-desc">${event.description || ''}</div>
        <a href="#reserve" class="btn btn-ghost">Reserve</a>
      </div>
    `;
    eventList.innerHTML += eventHTML;
  });
}

function formatEventDate(dateString) {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

// ============ REVIEWS ============
async function loadReviewStats() {
  const response = await fetch(`${API_URL}/api/reviews/stats`);
  const stats = await response.json();
  
  document.getElementById('averageRating').textContent = stats.average_rating.toFixed(1);
  document.getElementById('reviewCount').textContent = `Based on ${stats.total_reviews} reviews`;
  
  // Update bars
  const total = stats.total_reviews;
  const bars = { 5: 'fiveStar', 4: 'fourStar', 3: 'threeStar', 2: 'twoStar', 1: 'oneStar' };
  
  Object.entries(bars).forEach(([rating, barId]) => {
    const percent = (stats.rating_distribution[rating] / total) * 100;
    document.getElementById(barId).style.width = percent + '%';
    document.getElementById(rating + 'Percent').textContent = Math.round(percent) + '%';
  });
}

async function loadReviews() {
  const response = await fetch(`${API_URL}/api/reviews?approved_only=true&limit=6`);
  const reviews = await response.json();
  
  const container = document.getElementById('reviewContainer');
  container.innerHTML = '';
  
  reviews.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const reviewHTML = `
      <div class="rev-card">
        <div class="stars">${stars}</div>
        <p>${review.comment || 'Great experience!'}</p>
        <p class="rev-name">— ${review.name}</p>
      </div>
    `;
    container.innerHTML += reviewHTML;
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePage);

// Existing code from your HTML can stay as-is
// The above functions will automatically populate the data from the backend
```

## 🚀 Deployment Checklist

- [ ] Change `API_URL` to production domain
- [ ] Enable HTTPS in production
- [ ] Update CORS origins in backend `.env`
- [ ] Set up proper error handling
- [ ] Test all endpoints before going live
- [ ] Set up image CDN for uploaded photos
- [ ] Configure admin API keys securely

## 🐛 Troubleshooting

**CORS Error:**
- Make sure backend has your frontend URL in CORS origins
- Check `Access-Control-Allow-Origin` header in response

**API Key Error (Admin):**
- Include `X-Admin-Key` header in requests
- Use correct API key format
- Check if key is active in database

**Upload Fails:**
- Ensure `uploads/` directory exists
- Check file size limits
- Verify file is valid image format

---

**Support:** hello@rupasbay.lk
