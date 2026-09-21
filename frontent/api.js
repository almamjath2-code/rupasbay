
/**
 * Rupa's Bay Restaurant
 * API Communication Layer
 *
 * Backend
 *
 * Authentication:
 * localStorage key = "apiKey"
 * Request header   = "SECRET_KEY"
 */

const API_BASE_URL =
    "http://rupas-bay-apicheck-env.eba-niam9pc4.ap-south-1.elasticbeanstalk.com";


class ApiClient {

    constructor() {

        this.apiKey = this.getApiKey();

        console.log("🔑 ApiClient initialized");

        console.log(
            "🔐 Authenticated:",
            this.isAuthenticated()
        );
    }


    // =========================================================
    // AUTHENTICATION
    // =========================================================

    getApiKey() {

        const key = localStorage.getItem("apiKey");

        console.log(
            "🔑 getApiKey():",
            key ? "FOUND" : "NOT FOUND"
        );

        return key;
    }


    setApiKey(key) {

        if (!key || !key.trim()) {

            console.error(
                "❌ Cannot save empty API key"
            );

            return false;
        }

        localStorage.setItem(
            "apiKey",
            key.trim()
        );

        this.apiKey = key.trim();

        console.log(
            "💾 API key saved successfully"
        );

        return true;
    }


    clearApiKey() {

        console.log(
            "🗑️ Clearing API key"
        );

        localStorage.removeItem("apiKey");

        this.apiKey = null;
    }


    isAuthenticated() {

        return !!(
            this.apiKey &&
            this.apiKey.trim().length > 0
        );
    }


    // =========================================================
    // COMMON API REQUEST
    // =========================================================

    async request(endpoint, options = {}) {

        const url =
            `${API_BASE_URL}${endpoint}`;

        const headers = {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };


        // -----------------------------------------------------
        // ADD ADMIN API KEY
        // Backend expects:
        //
        // SECRET_KEY: <api-key>
        // -----------------------------------------------------
        if (this.apiKey) {

            headers["SECRET_KEY"] = this.apiKey;

            console.log(
                `🔑 SECRET_KEY added → ${options.method || "GET"} ${endpoint}`
            );
        }


        try {

            const response = await fetch(
                url,
                {
                    ...options,
                    headers: headers
                }
            );


            console.log(
                `📥 ${options.method || "GET"} ${endpoint} → ${response.status}`
            );


            // -------------------------------------------------
            // UNAUTHORIZED
            // -------------------------------------------------

            if (response.status === 401 || response.status === 403) {

                console.error("❌ AUTHENTICATION FAILED");
                console.error("Endpoint:", endpoint);
                console.error("Status:", response.status);
                console.error("API key exists:", !!this.apiKey);
                console.error("API key length:", this.apiKey ? this.apiKey.length : 0);

                let errorMessage = "Authentication failed";

                try {
                    const errorData = await response.json();

                    console.error("Backend error:", errorData);

                    if (errorData.detail) {
                        errorMessage =
                            typeof errorData.detail === "string"
                                ? errorData.detail
                                : JSON.stringify(errorData.detail);
                    }

                } catch (e) {
                    console.error("Could not read authentication error");
                }

                throw new Error(
                    `Authentication failed (${response.status}): ${errorMessage}`
                );
            }


            // -------------------------------------------------
            // OTHER HTTP ERRORS
            // -------------------------------------------------

            if (!response.ok) {

                let errorMessage =
                    `HTTP ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    if (errorData.detail) {

                        if (
                            typeof errorData.detail ===
                            "string"
                        ) {

                            errorMessage =
                                errorData.detail;

                        } else {

                            errorMessage =
                                JSON.stringify(
                                    errorData.detail
                                );
                        }
                    }

                } catch (e) {

                    console.warn(
                        "⚠️ Could not read error response"
                    );
                }

                throw new Error(errorMessage);
            }


            // -------------------------------------------------
            // NO CONTENT
            // -------------------------------------------------

            if (response.status === 204) {

                return null;
            }


            // -------------------------------------------------
            // JSON RESPONSE
            // -------------------------------------------------

            return await response.json();

        } catch (error) {

            console.error(
                `❌ API Error [${options.method || "GET"} ${endpoint}]`,
                error
            );

            throw error;
        }
    }


    // =========================================================
    // GET
    // =========================================================

    get(endpoint) {

        return this.request(
            endpoint,
            {
                method: "GET"
            }
        );
    }


    // =========================================================
    // POST
    // =========================================================

    post(endpoint, data) {

        return this.request(
            endpoint,
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );
    }


    // =========================================================
    // PUT
    // =========================================================

    put(endpoint, data) {

        return this.request(
            endpoint,
            {
                method: "PUT",
                body: JSON.stringify(data)
            }
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    delete(endpoint) {

        return this.request(
            endpoint,
            {
                method: "DELETE"
            }
        );
    }


    // =========================================================
    // FILE UPLOAD
    // =========================================================

    async uploadFile(endpoint, file) {

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );


        const url =
            `${API_BASE_URL}${endpoint}`;


        const headers = {};


        // SECRET_KEY is required for admin upload
        if (this.apiKey) {

            headers["SECRET_KEY"] =
                this.apiKey;

            console.log(
                "🔑 SECRET_KEY added to upload"
            );
        }


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: "POST",
                        headers: headers,
                        body: formData
                    }
                );


            console.log(
                `📥 Upload response → ${response.status}`
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                this.clearApiKey();

                window.location.href =
                    "login.html";

                return null;
            }


            if (!response.ok) {

                let message =
                    `Upload failed: HTTP ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    if (errorData.detail) {

                        message =
                            typeof errorData.detail ===
                                "string"
                                ? errorData.detail
                                : JSON.stringify(
                                    errorData.detail
                                );
                    }

                } catch (e) { }

                throw new Error(message);
            }


            return await response.json();

        } catch (error) {

            console.error(
                "❌ File upload error:",
                error
            );

            throw error;
        }
    }


    // =========================================================
    // DASHBOARD
    // =========================================================

    getDashboardStats() {

        return this.get(
            "/admin/stats"
        );
    }


    // =========================================================
    // MENU
    // =========================================================

    getMenu() {

        return this.get(
            "/api/menu"
        );
    }


    createMenuItem(data) {

        return this.post(
            "/admin/menu",
            data
        );
    }


    updateMenuItem(itemId, data) {

        return this.put(
            `/admin/menu/${itemId}`,
            data
        );
    }


    deleteMenuItem(itemId) {

        return this.delete(
            `/admin/menu/${itemId}`
        );
    }


    // =========================================================
    // RESERVATIONS
    // =========================================================

    getReservations() {

        return this.get(
            "/admin/reservations"
        );
    }


    getNewReservationCount() {

        return this.get(
            "/admin/reservations/new-count"
        );
    }


    updateReservation(
        reservationId,
        data
    ) {

        return this.put(
            `/admin/reservations/${reservationId}`,
            data
        );
    }


    deleteReservation(
        reservationId
    ) {

        return this.delete(
            `/admin/reservations/${reservationId}`
        );
    }


    // =========================================================
    // REVIEWS
    // =========================================================

    getReviews() {

        return this.get(
            "/admin/reviews"
        );
    }


    updateReview(id, data) {

        const isApproved =
            typeof data === 'object'
                ? data.is_approved
                : data;

        return this.put(
            `/admin/reviews/${id}?is_approved=${isApproved}`
        );
    }

    deleteReview(reviewId) {

        return this.delete(
            `/admin/reviews/${reviewId}`
        );
    }


    // =========================================================
    // EVENTS
    // =========================================================

    getEvents() {

        return this.get(
            "/api/events"
        );
    }


    createEvent(data) {

        return this.post(
            "/admin/events",
            data
        );
    }


    updateEvent(
        eventId,
        data
    ) {

        return this.put(
            `/admin/events/${eventId}`,
            data
        );
    }


    deleteEvent(eventId) {

        return this.delete(
            `/admin/events/${eventId}`
        );
    }


    // =========================================================
    // IMAGE UPLOAD
    // =========================================================

    uploadImage(file) {

        return this.uploadFile(
            "/api/upload/",
            file
        );
    }


    // =========================================================
    // ADMIN API KEY
    // =========================================================

    generateAdminKey() {

        return this.post(
            "/admin/generate-key",
            {}
        );
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    logout() {

        this.clearApiKey();

        console.log(
            "👋 Logged out successfully"
        );

        window.location.href =
            "login.html";
    }
}


// =============================================================
// GLOBAL API CLIENT
// =============================================================

const api =
    new ApiClient();

console.log(
    "✅ Global api object created"
);

