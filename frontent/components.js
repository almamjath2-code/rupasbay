/**
 * Reusable UI Components
 * Toast notifications, modals, and utility functions
 */

// ==================== TOAST NOTIFICATIONS ====================

class Toast {
    static show(message, type = 'success', duration = 3000) {
        const toastContainer = document.getElementById('toast');
        const toastMessage = document.createElement('div');
        toastMessage.className = `toast-message ${type}`;
        toastMessage.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toastMessage);

        setTimeout(() => {
            toastMessage.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                toastMessage.remove();
            }, 300);
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'warning'
        };
        return icons[type] || 'info-circle';
    }

    static success(message) {
        this.show(message, 'success');
    }

    static error(message) {
        this.show(message, 'error');
    }

    static info(message) {
        this.show(message, 'info');
    }

    static warning(message) {
        this.show(message, 'warning');
    }
}

// ==================== MODAL FUNCTIONS ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Close modal when clicking on overlay
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// ==================== CONFIRMATION DIALOG ====================

function showConfirmation(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = () => {
        closeModal('confirmModal');
        onConfirm();
    };
    
    openModal('confirmModal');
}

// ==================== FORMATTING UTILITIES ====================

const Format = {
    /**
     * Format date to readable format
     */
    date(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format date and time
     */
    dateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Format currency
     */
    currency(amount) {
        if (!amount && amount !== 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    /**
     * Format number
     */
    number(num) {
        if (!num && num !== 0) return 'N/A';
        return new Intl.NumberFormat('en-US').format(num);
    },

    /**
     * Truncate text
     */
    truncate(text, length = 100) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    /**
     * Format rating with stars
     */
    rating(rating) {
        if (!rating) return 'N/A';
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        return `${stars} ${rating.toFixed(1)}`;
    }
};

// ==================== DOM UTILITIES ====================

const DOM = {
    /**
     * Clear table body
     */
    clearTable(tableBodyId) {
        const tbody = document.getElementById(tableBodyId);
        if (tbody) {
            tbody.innerHTML = '';
        }
    },

    /**
     * Create table row from data
     */
    createTableRow(data, columns, actionButtons = []) {
        const tr = document.createElement('tr');
        
        columns.forEach(col => {
            const td = document.createElement('td');
            const value = data[col.key];
            
            if (col.render) {
                td.innerHTML = col.render(value, data);
            } else if (col.type === 'image') {
                td.innerHTML = value ? `<img src="${value}" alt="">` : '<span>No image</span>';
            } else if (col.type === 'status') {
                const statusClass = value ? value.toLowerCase() : 'unknown';
                td.innerHTML = `<span class="status-badge ${statusClass}">${value || 'Unknown'}</span>`;
            } else if (col.type === 'currency') {
                td.textContent = Format.currency(value);
            } else if (col.type === 'date') {
                td.textContent = Format.date(value);
            } else if (col.type === 'boolean') {
                td.innerHTML = `<i class="fas fa-${value ? 'check-circle text-success' : 'times-circle text-danger'}"></i>`;
            } else {
                td.textContent = value || 'N/A';
            }
            
            tr.appendChild(td);
        });

        // Add action buttons
        if (actionButtons.length > 0) {
            const actionTd = document.createElement('td');
            actionTd.className = 'table-actions';
            
            actionButtons.forEach(btn => {
                const button = document.createElement('button');
                button.className = `action-btn ${btn.class || ''}`;
                button.title = btn.title || '';
                button.innerHTML = `<i class="${btn.icon}"></i>`;
                button.onclick = (e) => {
                    e.preventDefault();
                    btn.onClick();
                };
                actionTd.appendChild(button);
            });
            
            tr.appendChild(actionTd);
        }

        return tr;
    },

    /**
     * Clear element
     */
    clear(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    },

    /**
     * Show element
     */
    show(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'block';
        }
    },

    /**
     * Hide element
     */
    hide(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }
};

// ==================== CHART UTILITIES ====================

const ChartUtil = {
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#555555',
                    font: {
                        size: 12
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#888888' },
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y: {
                ticks: { color: '#888888' },
                grid: { color: 'rgba(0,0,0,0.05)' }
            }
        }
    },

    /**
     * Create pie/doughnut chart
     */
    createPieChart(canvasId, labels, data, title = '') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#2d5016',
                        '#c9a961',
                        '#27ae60',
                        '#e74c3c',
                        '#f39c12',
                        '#3498db'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: this.defaultOptions
        });
    },

    /**
     * Create bar chart
     */
    createBarChart(canvasId, labels, datasets, title = '') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'x'
            }
        });
    },

    /**
     * Create line chart
     */
    createLineChart(canvasId, labels, datasets, title = '') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                ...this.defaultOptions,
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
};

// ==================== PAGINATION ====================

class Paginator {
    constructor(items, itemsPerPage = 10) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }

    /**
     * Get current page items
     */
    getCurrentPage() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.items.slice(start, end);
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        const pageNum = Math.max(1, Math.min(page, this.totalPages));
        this.currentPage = pageNum;
        return this.getCurrentPage();
    }

    /**
     * Next page
     */
    next() {
        return this.goToPage(this.currentPage + 1);
    }

    /**
     * Previous page
     */
    previous() {
        return this.goToPage(this.currentPage - 1);
    }

    /**
     * Update items and reset pagination
     */
    setItems(items) {
        this.items = items;
        this.totalPages = Math.ceil(items.length / this.itemsPerPage);
        this.currentPage = 1;
    }

    /**
     * Render pagination buttons
     */
    renderButtons(containerId, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (this.totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => {
            this.previous();
            onPageChange();
        };
        container.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= this.totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                this.goToPage(i);
                onPageChange();
            };
            container.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.onclick = () => {
            this.next();
            onPageChange();
        };
        container.appendChild(nextBtn);
    }
}

// ==================== FORM UTILITIES ====================

const FormUtil = {
    /**
     * Get form data
     */
    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            if (data[key]) {
                if (!Array.isArray(data[key])) {
                    data[key] = [data[key]];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });
        
        return data;
    },

    /**
     * Set form data
     */
    setFormData(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        Object.keys(data).forEach(key => {
            const input = form.elements[key];
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = !!data[key];
                } else if (input.type === 'radio') {
                    const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = data[key] || '';
                }
            }
        });
    },

    /**
     * Reset form
     */
    resetForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    /**
     * Validate form
     */
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;
        
        return form.checkValidity();
    }
};

// ==================== SEARCH & FILTER ====================

class SearchFilter {
    constructor(items, searchKey = 'name') {
        this.originalItems = [...items];
        this.items = [...items];
        this.searchKey = searchKey;
    }

    /**
     * Search items
     */
    search(query) {
        if (!query) {
            this.items = [...this.originalItems];
            return this.items;
        }

        const lowerQuery = query.toLowerCase();
        this.items = this.originalItems.filter(item => {
            if (typeof this.searchKey === 'string') {
                return String(item[this.searchKey]).toLowerCase().includes(lowerQuery);
            } else if (Array.isArray(this.searchKey)) {
                return this.searchKey.some(key => 
                    String(item[key]).toLowerCase().includes(lowerQuery)
                );
            }
            return false;
        });

        return this.items;
    }

    /**
     * Filter items by key-value
     */
    filter(key, value) {
        if (!value) {
            this.items = [...this.originalItems];
        } else {
            this.items = this.originalItems.filter(item => 
                item[key] === value
            );
        }
        return this.items;
    }

    /**
     * Get current items
     */
    getItems() {
        return this.items;
    }

    /**
     * Update original items
     */
    setItems(items) {
        this.originalItems = [...items];
        this.items = [...items];
    }
}

// ==================== DARK MODE ====================

class DarkMode {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.apply();
    }

    toggle() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.apply();
    }

    apply() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}

const darkMode = new DarkMode();
