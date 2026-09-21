# Rupa's Bay Restaurant - Admin Dashboard

A modern, professional, and responsive admin dashboard for managing restaurant operations built with vanilla HTML, CSS, and JavaScript.

## Features

### 🎯 Core Features
- **Secure Login** - API Key-based authentication with local storage
- **Dashboard** - Real-time statistics and activity monitoring
- **Menu Management** - Add, edit, delete menu items with images
- **Reservations** - View and manage customer reservations
- **Reviews** - Approve and manage customer reviews
- **Events** - Create and manage restaurant events
- **Gallery** - Upload and manage restaurant images
- **Settings** - Configure restaurant information and social media links

### 🎨 Design Features
- **Luxury Restaurant Theme** - Soft beige, dark green, and gold colors
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Dark Mode** - Toggle-able dark mode with persistent settings
- **Smooth Animations** - Professional transitions and hover effects
- **Glassmorphism** - Modern UI with frosted glass effects
- **Loading Skeletons** - Better UX with loading states

### 📊 Data Visualization
- **Interactive Charts** - Chart.js integration for data visualization
- **Dashboard Charts**:
  - Reservations by status
  - Review ratings distribution
  - Menu categories breakdown
  - Recent activity timeline

### 🔧 Technical Features
- **No Dependencies** - Pure vanilla JavaScript (except Chart.js)
- **RESTful API Integration** - Fetch API for backend communication
- **Local Storage** - Secure API key storage
- **Responsive Layout** - Mobile-first design approach
- **Search & Filter** - Advanced filtering capabilities
- **Pagination** - Efficient data pagination
- **Toast Notifications** - Beautiful notification system
- **Confirmation Dialogs** - Safe deletion confirmations

## File Structure

```
admin/
├── login.html              # Login page
├── dashboard.html          # Main dashboard
├── css/
│   └── style.css          # All styling (responsive & dark mode)
├── js/
│   ├── api.js             # API communication layer
│   ├── components.js      # Reusable UI components
│   ├── login.js           # Login functionality
│   └── dashboard.js       # Main dashboard logic
└── README.md              # This file
```

## Setup Instructions

### 1. Prerequisites
- FastAPI backend running at `http://127.0.0.1:8000`
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Valid admin API key from your backend

### 2. File Organization
1. Create a folder structure:
   ```
   your-project/
   └── admin/
       ├── login.html
       ├── dashboard.html
       ├── css/
       │   └── style.css
       └── js/
           ├── api.js
           ├── components.js
           ├── login.js
           └── dashboard.js
   ```

2. Copy all provided files to their respective locations

### 3. Running the Dashboard
1. Open `login.html` in your web browser
2. Enter your admin API key
3. Click "Login" to access the dashboard

### 4. Accessing Different Sections
Once logged in, use the sidebar navigation to access:
- **Dashboard** - View statistics and charts
- **Menu Management** - Manage menu items
- **Reservations** - Handle reservations
- **Reviews** - Manage customer reviews
- **Events** - Create and manage events
- **Gallery** - Upload and manage images
- **Settings** - Configure restaurant info

## API Integration

The dashboard connects to your FastAPI backend using these endpoints:

### Authentication
- `POST /admin/generate-key` - Generate admin API key

### Dashboard
- `GET /admin/stats` - Get dashboard statistics

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /admin/menu` - Create menu item
- `PUT /admin/menu/{item_id}` - Update menu item
- `DELETE /admin/menu/{item_id}` - Delete menu item

### Reservations
- `GET /admin/reservations` - Get all reservations
- `PUT /admin/reservations/{reservation_id}` - Update reservation
- `DELETE /admin/reservations/{reservation_id}` - Delete reservation

### Reviews
- `GET /admin/reviews` - Get all reviews
- `PUT /admin/reviews/{review_id}` - Update review
- `DELETE /admin/reviews/{review_id}` - Delete review

### Events
- `GET /api/events` - Get all events
- `POST /admin/events` - Create event
- `PUT /admin/events/{event_id}` - Update event
- `DELETE /admin/events/{event_id}` - Delete event

### File Upload
- `POST /api/upload` - Upload image file

## Features in Detail

### Login Page
- Clean, modern design with animated background
- API key input field
- Secure local storage of API key
- Automatic redirect to dashboard if already logged in

### Dashboard
- 6 stat cards showing:
  - Total menu items
  - Total reservations
  - Pending reservations
  - Approved reviews
  - Upcoming events
  - Average rating
- 4 interactive charts:
  - Reservations by status (pie chart)
  - Review ratings distribution (bar chart)
  - Menu categories (pie chart)
  - Recent activity timeline

### Menu Management
- Paginated table of menu items
- Search by name or category
- Filter by category
- Add new menu items with image upload
- Edit existing menu items
- Delete menu items with confirmation
- Display: name, category, price, chef pick status, availability

### Reservation Management
- View all reservations with details:
  - Customer name and contact info
  - Date and time
  - Number of guests
  - Special requests
  - Current status
- Search by name or email
- Filter by status (pending, approved, cancelled)
- Change reservation status
- Delete reservations

### Review Management
- Display all customer reviews with:
  - Customer name and rating
  - Review comment
  - Photo if available
  - Date submitted
- Search reviews
- Approve reviews
- Delete reviews

### Events Management
- View all upcoming events
- Display event details:
  - Title and description
  - Date
  - Featured image
- Create new events with image
- Edit existing events
- Delete events

### Gallery
- Drag & drop or click to upload images
- Multiple file upload support
- Image preview
- Delete images with confirmation
- Responsive grid layout

### Settings
- Restaurant information:
  - Name
  - Address
  - Phone and email
  - Opening hours
- Social media links:
  - Instagram
  - Facebook
  - TripAdvisor
  - Google Maps
- Persistent storage in local storage

## Customization

### Changing Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2d5016;      /* Dark Green */
    --secondary-color: #f5f1e8;    /* Soft Beige */
    --accent-color: #c9a961;       /* Gold */
    /* ... */
}
```

### Changing API Base URL
Edit `js/api.js`:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000'; // Change this
```

### Adding More Pages
1. Add HTML in `dashboard.html`:
   ```html
   <div class="page" id="new-page">
       <!-- Content -->
   </div>
   ```

2. Add navigation item in sidebar:
   ```html
   <a href="#" class="nav-item" data-page="new-page">
       <i class="fas fa-icon"></i>
       <span>New Page</span>
   </a>
   ```

3. Add handler in `js/dashboard.js`:
   ```javascript
   case 'new-page':
       loadNewPage();
       break;
   ```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Lazy loading of charts
- Efficient data pagination
- Minimal DOM manipulation
- CSS animations use transforms for smooth performance
- Chart destruction and recreation to prevent memory leaks

## Security Notes

- API keys are stored in browser's localStorage
- All requests include API key in headers
- Authentication is verified on each page load
- Unauthorized users are redirected to login
- CORS should be configured on backend

## Troubleshooting

### Login Issues
- Verify the API key is correct
- Check that backend is running on `http://127.0.0.1:8000`
- Clear browser cache and local storage
- Check browser console for errors

### Data Not Loading
- Verify backend is running
- Check browser console for API errors
- Ensure API endpoints are accessible
- Verify API key has correct permissions

### Chart Not Displaying
- Check browser console for Chart.js errors
- Verify canvas element exists in DOM
- Check that data is being returned from API

### Styling Issues
- Clear browser cache
- Check that CSS file is loading correctly
- Verify dark mode toggle isn't interfering
- Check browser DevTools for CSS errors

## Future Enhancements

- Export data to CSV/PDF
- Bulk actions on items
- User role management
- Advanced analytics
- Email notifications
- Order management
- Inventory tracking
- Customer loyalty program
- Table management
- Staff scheduling

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in correct locations
3. Ensure backend API is running properly
4. Check API responses in Network tab
5. Review the README documentation

## License

Created for Rupa's Bay Restaurant & Bar - All Rights Reserved
