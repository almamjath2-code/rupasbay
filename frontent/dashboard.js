/**
 * Dashboard Main Logic
 * Handles page navigation, data loading, and user interactions
 */

// Global state
let currentPage = 'dashboard';
let charts = {};
let paginators = {};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    initializeUI();
    loadDashboard();
});

function initializeUI() {
    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        darkMode.toggle();
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.remove('show');
    });

    // Close sidebar when clicking on content
    document.querySelector('.main-content').addEventListener('click', () => {
        sidebar.classList.remove('show');
    });

    // Menu management
    document.getElementById('addMenuBtn').addEventListener('click', () => {
        document.getElementById('menuModalTitle').textContent = 'Add Menu Item';
        document.getElementById('menuForm').reset();
        FormUtil.setFormData('menuForm', { menuAvailable: true });
        openModal('menuModal');
    });

    document.getElementById('menuForm').addEventListener('submit', handleMenuFormSubmit);

    // Event management
    document.getElementById('addEventBtn').addEventListener('click', () => {
        document.getElementById('eventModalTitle').textContent = 'Create Event';
        document.getElementById('eventForm').reset();
        openModal('eventModal');
    });

    document.getElementById('eventForm').addEventListener('submit', handleEventFormSubmit);

    // Gallery upload
    const uploadArea = document.getElementById('uploadArea');
    const galleryFileInput = document.getElementById('galleryFileInput');

    uploadArea.addEventListener('click', () => {
        galleryFileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleGalleryUpload(e.dataTransfer.files);
    });

    galleryFileInput.addEventListener('change', (e) => {
        handleGalleryUpload(e.target.files);
    });

    // Filters
    document.getElementById('menuSearch').addEventListener('input', filterMenuItems);
    document.getElementById('categoryFilter').addEventListener('change', filterMenuItems);
    document.getElementById('reservationSearch').addEventListener('input', filterReservations);
    document.getElementById('statusFilter').addEventListener('change', filterReservations);
    document.getElementById('reviewSearch').addEventListener('input', filterReviews);

    // Settings form
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);
}

// ==================== PAGE NAVIGATION ====================

function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
        pageElement.style.display = 'block';
    }

    // Update nav item
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        menu: 'Menu Management',
        reservations: 'Reservations',
        reviews: 'Reviews',
        events: 'Events',
        gallery: 'Gallery',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    currentPage = page;

    // Load page data
    switch (page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'menu':
            loadMenuItems();
            break;
        case 'reservations':
            loadReservations();
            break;
        case 'reviews':
            loadReviews();
            break;
        case 'events':
            loadEvents();
            break;
        case 'gallery':
            loadGallery();
            break;
        case 'settings':
            loadSettings();
            break;
    }

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('show');
}

// ==================== DASHBOARD PAGE ====================

async function loadDashboard() {
    try {

        console.log("📊 Loading dashboard data...");

        // Load all dashboard data
        const [
            stats,
            reservations,
            reviews,
            menu
        ] = await Promise.all([
            api.getDashboardStats(),
            api.getReservations(),
            api.getReviews(),
            api.getMenu()
        ]);

        console.log("📊 Dashboard Stats:", stats);
        console.log("📅 Reservations:", reservations);
        console.log("⭐ Reviews:", reviews);
        console.log("🍽️ Menu:", menu);

        // Combine everything
        const dashboardData = {
            ...stats,
            reservations: reservations || [],
            reviews: reviews || [],
            menu: menu || []
        };

        renderDashboardStats(dashboardData);
        renderDashboardCharts(dashboardData);

    } catch (error) {

        console.error(
            "❌ Dashboard Error:",
            error
        );

        Toast.error(
            `Failed to load dashboard data: ${error.message}`
        );
    }
}
function renderDashboardStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';

    const statCards = [
        {
            value: stats.total_menu_items || 0,
            label: 'Menu Items',
            icon: 'utensils',
            class: 'primary'
        },
        {
            value: stats.total_reservations || 0,
            label: 'Reservations',
            icon: 'calendar',
            class: 'accent'
        },
        {
            value: stats.pending_reservations || 0,
            label: 'Pending',
            icon: 'clock',
            class: 'warning'
        },
        {
            value: stats.approved_reviews || 0,
            label: 'Reviews',
            icon: 'star',
            class: 'success'
        },
        {
            value: stats.upcoming_events || 0,
            label: 'Events',
            icon: 'calendar-alt',
            class: 'info'
        },
        {
            value: (stats.average_rating || 0).toFixed(1),
            label: 'Avg Rating',
            icon: 'star',
            class: 'accent'
        }
    ];

    statCards.forEach(card => {
        const statCard = document.createElement('div');
        statCard.className = `stat-card ${card.class}`;
        statCard.innerHTML = `
            <div class="icon">
                <i class="fas fa-${card.icon}"></i>
            </div>
            <div class="value">${Format.number(card.value)}</div>
            <div class="label">${card.label}</div>
        `;
        statsGrid.appendChild(statCard);
    });
}

function renderDashboardCharts(stats) {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};

    // Reservations by status chart
    const statusCounts = {};
    (stats.reservations || []).forEach(res => {
        statusCounts[res.status] = (statusCounts[res.status] || 0) + 1;
    });

    charts.reservations = ChartUtil.createPieChart(
        'reservationsChart',
        Object.keys(statusCounts),
        Object.values(statusCounts)
    );

    // Review ratings chart
    const ratingCounts = {};
    (stats.reviews || []).forEach(review => {
        const rating = Math.floor(review.rating);
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });

    charts.ratings = ChartUtil.createBarChart(
        'ratingsChart',
        ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        [{
            label: 'Count',
            data: [1, 2, 3, 4, 5].map(i => ratingCounts[i] || 0),
            backgroundColor: '#2d5016',
            borderRadius: 4,
            borderSkipped: false
        }]
    );

    // Menu categories chart
    const categoryCounts = {};
    (stats.menu || []).forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    charts.categories = ChartUtil.createPieChart(
        'categoriesChart',
        Object.keys(categoryCounts),
        Object.values(categoryCounts)
    );

    // Recent activity
    renderRecentActivity(stats);
}

function renderRecentActivity(stats) {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';

    const activities = [];

    // Add recent menu items
    (stats.menu || []).slice(-3).forEach(item => {
        activities.push({
            type: 'menu',
            text: `New menu item: <strong>${item.name}</strong>`,
            time: item.created_at || new Date().toISOString()
        });
    });

    // Add recent reservations
    (stats.reservations || []).slice(-3).forEach(res => {
        activities.push({
            type: 'reservation',
            text: `Reservation from <strong>${res.customer_name}</strong>`,
            time: res.created_at || new Date().toISOString()
        });
    });

    // Add recent reviews
    (stats.reviews || []).slice(-3).forEach(review => {
        activities.push({
            type: 'review',
            text: `New review: <strong>${review.customer}</strong>`,
            time: review.created_at || new Date().toISOString()
        });
    });

    // Sort by time and get latest 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities.slice(0, 5).forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.type}`;
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.type === 'menu' ? 'utensils' : activity.type === 'review' ? 'star' : 'calendar'}"></i>
            </div>
            <div class="activity-text">
                <p>${activity.text}</p>
                <div class="activity-time">${Format.date(activity.time)}</div>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// ==================== MENU MANAGEMENT ====================

// ==================== MENU MANAGEMENT ====================

let menuFilter = null;
let menuPaginator = null;


async function loadMenuItems() {
    try {
        const menuItems = await api.getMenu();

        menuFilter = new SearchFilter(menuItems, ['name', 'category']);
        menuPaginator = new Paginator(menuItems, 10);

        renderMenuTable(menuPaginator.getCurrentPage());
        renderMenuPagination();
        updateCategoryFilter(menuItems);

    } catch (error) {
        console.error("LOAD MENU ERROR:", error);
        Toast.error("Failed to load menu items");
    }
}



function renderMenuTable(items) {

    const tbody = document.getElementById('menuTableBody');

    tbody.innerHTML = "";


    if (!items || items.length === 0) {

        tbody.innerHTML =
            `<tr>
            <td colspan="7" style="text-align:center;padding:2rem;">
                No menu items found
            </td>
        </tr>`;

        return;
    }

    items.forEach(item => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

        <td>
            ${item.image_url
                ? `<img src="http://rupas-bay-apicheck-env.eba-niam9pc4.ap-south-1.elasticbeanstalk.com${item.image_url}"
                    width="60"
                    height="60"
                    style="object-fit:cover;border-radius:8px;">`
                : "No Image"
            }
        </td>

        <td>${item.name}</td>

        <td>${item.category}</td>

        <td>${item.price ?? item.price_lkr ?? "N/A"}</td>

        <td>${item.is_chef_pick ? "Yes" : "No"}</td>

        <td>${item.is_available ? "Yes" : "No"}</td>

        <td>
            <button onclick="editMenuItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                Edit
            </button>

            <button onclick="deleteMenuItem(${item.id})">
                Delete
            </button>
        </td>

    `;

        tbody.appendChild(tr);

    });

}





function updateCategoryFilter(items) {

    const select =
        document.getElementById('categoryFilter');


    const categories =
        [...new Set(items.map(item => item.category))];


    const firstOption =
        select.firstElementChild;


    select.innerHTML = "";

    select.appendChild(firstOption);



    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;


        select.appendChild(option);

    });

}





function renderMenuPagination() {

    if (menuPaginator) {

        menuPaginator.renderButtons(
            'menuPagination',
            () => {

                renderMenuTable(
                    menuPaginator.getCurrentPage()
                );

            }
        );

    }

}





function filterMenuItems() {

    const search =
        document.getElementById('menuSearch').value;


    const category =
        document.getElementById('categoryFilter').value;



    let filtered =
        menuFilter.search(search);



    if (category) {

        filtered =
            filtered.filter(
                item => item.category === category
            );

    }



    menuPaginator.setItems(filtered);

    menuPaginator.goToPage(1);


    renderMenuTable(
        menuPaginator.getCurrentPage()
    );


}





function editMenuItem(item) {


    document.getElementById('menuModalTitle').textContent =
        "Edit Menu Item";



    FormUtil.setFormData(
        'menuForm',
        {

            menuName: item.name,

            menuDescription: item.description,

            menuPrice: item.price,

            menuCategory: item.category,


            menuChefPick:
                item.is_chef_pick,


            menuAvailable:
                item.is_available

        }
    );



    window.currentMenuItemId = item.id;


    openModal('menuModal');

}





// ================= SAVE MENU =================


async function handleMenuFormSubmit(e) {

    e.preventDefault();



    const formData = {


        name:
            document.getElementById('menuName').value,


        description:
            document.getElementById('menuDescription').value,


        price_lkr:
            Number(
                document.getElementById('menuPrice').value
            ),



        category:
            document.getElementById('menuCategory').value,



        is_chef_pick:
            document.getElementById('menuChefPick').checked,



        is_available:
            document.getElementById('menuAvailable').checked


    };



    console.log("Sending MENU DATA:", formData);



    // IMAGE UPLOAD

    const imageFile =
        document.getElementById('menuImage').files[0];



    if (imageFile) {

        try {

            const upload =
                await api.uploadImage(imageFile);


            formData.image_url =
                upload.file_path || upload.url;


        }

        catch (error) {

            console.error(
                "IMAGE ERROR:",
                error
            );


            Toast.error(
                "Image upload failed"
            );


            return;
        }

    }





    try {


        if (window.currentMenuItemId) {


            await api.updateMenuItem(
                window.currentMenuItemId,
                formData
            );


            Toast.success(
                "Menu updated successfully"
            );


            delete window.currentMenuItemId;


        }

        else {


            await api.createMenuItem(
                formData
            );


            Toast.success(
                "Menu added successfully"
            );


        }




        closeModal('menuModal');


        loadMenuItems();



    }


    catch (error) {


        console.error("MENU SAVE ERROR:", error);

        Toast.error(
            error.message || "Something went wrong"
        );



    }



}







function deleteMenuItem(id) {


    showConfirmation(

        "Delete Menu Item",

        "Are you sure?",


        async () => {


            try {


                await api.deleteMenuItem(id);



                Toast.success(
                    "Deleted successfully"
                );


                loadMenuItems();



            }

            catch (error) {


                console.error(error);


                Toast.error(
                    "Delete failed"
                );

            }


        }

    );

}
// ==================== RESERVATIONS ====================

let reservationFilter = null;
let currentReservationId = null;

async function loadReservations() {
    try {
        const reservations = await api.getReservations();
        console.log("RESERVATIONS DATA:", reservations);
        reservationFilter = new SearchFilter(reservations, ['name', 'email', 'phone']);
        renderReservations(reservations);
    } catch (error) {
        Toast.error('Failed to load reservations');
        console.error(error);
    }
}

function renderReservations(items) {
    const tbody = document.getElementById('reservationsTableBody');
    tbody.innerHTML = '';

    if (!items || items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No reservations found</td></tr>';
        return;
    }

    items.forEach(reservation => {
        const dateTime = Format.dateTime(
            reservation.reservation_date + 'T' + reservation.reservation_time
        );

        const tr = DOM.createTableRow(reservation,
            [
                { key: 'name' },
                { key: 'phone' },
                { key: 'email' },
                { key: 'num_guests' },
                {
                    key: 'reservation_date',
                    render: () => dateTime
                },
                { key: 'status', type: 'status' }
            ],
            [
                {
                    icon: 'fas fa-check',
                    class: 'approve',
                    title: 'Change Status',
                    onClick: () => showStatusModal(reservation)
                },
                {
                    icon: 'fas fa-trash',
                    class: 'delete',
                    title: 'Delete',
                    onClick: () => deleteReservation(reservation.id)
                }
            ]
        );
        tbody.appendChild(tr);
    });
}

function filterReservations() {
    const search = document.getElementById('reservationSearch').value;
    const status = document.getElementById('statusFilter').value;

    let filtered = reservationFilter.search(search);
    if (status) {
        filtered = filtered.filter(item => item.status === status);
    }

    renderReservations(filtered);
}

function showStatusModal(reservation) {
    currentReservationId = reservation.id;
    document.getElementById('newStatus').value = reservation.status;
    document.getElementById('updateStatusBtn').onclick = updateReservationStatus;
    openModal('statusModal');
}

async function updateReservationStatus() {
    const newStatus = document.getElementById('newStatus').value;

    try {
        await api.updateReservation(currentReservationId, { status: newStatus });
        Toast.success('Reservation status updated!');
        closeModal('statusModal');
        loadReservations();
    } catch (error) {
        Toast.error('Failed to update reservation');
        console.error(error);
    }
}

function deleteReservation(reservationId) {
    showConfirmation(
        'Delete Reservation',
        'Are you sure you want to delete this reservation?',
        async () => {
            try {
                await api.deleteReservation(reservationId);
                Toast.success('Reservation deleted successfully!');
                loadReservations();
            } catch (error) {
                Toast.error('Failed to delete reservation');
                console.error(error);
            }
        }
    );
}

// ==================== REVIEWS ====================

let reviewFilter = null;

async function loadReviews() {
    try {
        const reviews = await api.getReviews();
        reviewFilter = new SearchFilter(reviews, 'customer');
        renderReviews(reviews);
    } catch (error) {
        Toast.error('Failed to load reviews');
        console.error(error);
    }
}

function renderReviews(items) {
    const grid = document.getElementById('reviewsGrid');
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No reviews found</div>';
        return;
    }

    items.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div class="review-author">${review.customer}</div>
                <div class="review-rating">${Format.rating(review.rating)}</div>
            </div>
            <div class="review-text">${Format.truncate(review.comment, 150)}</div>
            ${review.photo_url ? `<img src="${review.photo_url}" alt="Review" class="review-image">` : ''}
            <div class="review-meta">${Format.date(review.date)}</div>
            <div class="review-actions">
                <button class="btn btn-sm btn-secondary" onclick="approveReview(${review.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterReviews() {
    const search = document.getElementById('reviewSearch').value;
    const filtered = reviewFilter.search(search);
    renderReviews(filtered);
}

async function approveReview(reviewId) {
    try {
        await api.updateReview(reviewId, { is_approved: true });
        Toast.success('Review approved!');
        loadReviews();
    } catch (error) {
        Toast.error('Failed to approve review');
        console.error(error);
    }
}

function deleteReview(reviewId) {
    showConfirmation(
        'Delete Review',
        'Are you sure you want to delete this review?',
        async () => {
            try {
                await api.deleteReview(reviewId);
                Toast.success('Review deleted successfully!');
                loadReviews();
            } catch (error) {
                Toast.error('Failed to delete review');
                console.error(error);
            }
        }
    );
}

// ==================== EVENTS ====================

async function loadEvents() {
    try {
        const events = await api.getEvents();
        renderEvents(events);
    } catch (error) {
        Toast.error('Failed to load events');
        console.error(error);
    }
}

function renderEvents(items) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No events found</div>';
        return;
    }

    items.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="event-image">` : '<div class="event-image" style="background: #f0ebe3;"></div>'}
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-date"><i class="fas fa-calendar"></i> ${Format.date(event.date)}</div>
                <p class="event-description">${Format.truncate(event.description, 100)}</p>
                <div class="event-actions">
                    <button class="btn btn-sm btn-secondary" onclick="editEvent(${event.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEvent(${event.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function handleEventFormSubmit(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value
    };

    const imageFile = document.getElementById('eventImage').files[0];
    if (imageFile) {
        try {
            const uploadResponse = await api.uploadImage(imageFile);
            formData.image_url = uploadResponse.file_path || uploadResponse.url;
        } catch (error) {
            Toast.error('Failed to upload image');
            return;
        }
    }

    try {
        if (window.currentEventId) {
            await api.updateEvent(window.currentEventId, formData);
            Toast.success('Event updated successfully!');
            delete window.currentEventId;
        } else {
            await api.createEvent(formData);
            Toast.success('Event created successfully!');
        }

        closeModal('eventModal');
        loadEvents();
    } catch (error) {
        Toast.error('Failed to save event');
        console.error(error);
    }
}

function editEvent(eventId) {
    // Load event and populate form
    Toast.info('Loading event...');
    // In a real scenario, fetch the specific event
}

function deleteEvent(eventId) {
    showConfirmation(
        'Delete Event',
        'Are you sure you want to delete this event?',
        async () => {
            try {
                await api.deleteEvent(eventId);
                Toast.success('Event deleted successfully!');
                loadEvents();
            } catch (error) {
                Toast.error('Failed to delete event');
                console.error(error);
            }
        }
    );
}

// ==================== GALLERY ====================

async function loadGallery() {
    // In a real scenario, load existing gallery images
    renderGallery([]);
}

function renderGallery(items) {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #888;">No images yet</div>';
        return;
    }

    items.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.url}" alt="Gallery" class="gallery-image">
            <div class="gallery-overlay">
                <button class="gallery-delete" onclick="deleteGalleryImage('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(galleryItem);
    });
}

async function handleGalleryUpload(files) {
    const uploadPromises = [];

    for (let file of files) {
        if (!file.type.startsWith('image/')) {
            Toast.warning(`${file.name} is not an image`);
            continue;
        }

        uploadPromises.push(
            api.uploadImage(file)
                .then(() => {
                    Toast.success(`${file.name} uploaded!`);
                })
                .catch(error => {
                    Toast.error(`Failed to upload ${file.name}`);
                })
        );
    }

    await Promise.all(uploadPromises);
}

function deleteGalleryImage(imageId) {
    showConfirmation(
        'Delete Image',
        'Are you sure you want to delete this image?',
        () => {
            Toast.success('Image deleted!');
            loadGallery();
        }
    );
}

// ==================== SETTINGS ====================

async function loadSettings() {
    const settings = localStorage.getItem('restaurantSettings');
    if (settings) {
        FormUtil.setFormData('settingsForm', JSON.parse(settings));
    }
}

async function handleSettingsSubmit(e) {
    e.preventDefault();

    const settings = {
        restaurantName: document.getElementById('restaurantName').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        openingHours: document.getElementById('openingHours').value,
        instagram: document.getElementById('instagram').value,
        facebook: document.getElementById('facebook').value,
        tripadvisor: document.getElementById('tripadvisor').value,
        googlemaps: document.getElementById('googlemaps').value
    };

    localStorage.setItem('restaurantSettings', JSON.stringify(settings));
    Toast.success('Settings saved successfully!');
}

// ==================== LOGOUT ====================

function logout() {
    showConfirmation(
        'Logout',
        'Are you sure you want to logout?',
        () => {
            api.clearApiKey();
            window.location.href = 'login.html';
        }
    );
}

/* ==================== RESERVATION NOTIFICATION ==================== */

/* ==================== RESERVATION NOTIFICATION ==================== */

// First time load = no sound
let oldReservationCount = null;

// Check new reservations
async function checkReservations() {

    try {

        const response = await fetch(
            "http://rupas-bay-apicheck-env.eba-niam9pc4.ap-south-1.elasticbeanstalk.com/admin/reservations/new-count",
            {
                headers: {
                    "SECRET_KEY": localStorage.getItem("apiKey")
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch reservation count");
        }

        const data = await response.json();

        // Update notification count
        const countElement = document.getElementById("reservation-count");
        if (countElement) {
            countElement.innerText = data.count;
        }

        // First page load
        if (oldReservationCount === null) {
            oldReservationCount = data.count;
            return;
        }

        // New reservation detected
        if (data.count > oldReservationCount) {

            // Play notification sound
            const sound = document.getElementById("reservationSound");

            if (sound) {
                sound.currentTime = 0;

                sound.play().catch(error => {
                    console.log("Sound blocked by browser:", error);
                });
            }

            // Show toast notification
            const toast = document.getElementById("toastNotification");

            if (toast) {

                toast.style.display = "block";

                setTimeout(() => {
                    toast.style.display = "none";
                }, 5000);

            }

        }

        // Save current count
        oldReservationCount = data.count;

    } catch (error) {

        console.error("Notification Error:", error);

    }

}

// Check immediately
checkReservations();

// Check every 5 seconds
setInterval(checkReservations, 5000);