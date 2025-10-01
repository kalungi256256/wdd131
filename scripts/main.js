// WDD 131 Final Project - Main JavaScript

// Global application state
const EcoTracker = {
    // Application data
    data: {
        activities: [],
        savedCalculations: [],
        userProgress: {
            completedTips: 0,
            savedTips: 0,
            currentStreak: 0,
            estimatedSavings: 0
        }
    },

    
            

    // Initialize application
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateDynamicContent();
        this.animateStatistics();
        this.displayRecentActivity();
    },
    
    // Load data from localStorage
    loadFromStorage() {
        try {
            const activities = localStorage.getItem('ecoTracker_activities');
            const calculations = localStorage.getItem('ecoTracker_calculations');
            const progress = localStorage.getItem('ecoTracker_progress');
            
            if (activities) {
                this.data.activities = JSON.parse(activities);
            }
            if (calculations) {
                this.data.savedCalculations = JSON.parse(calculations);
            }
            if (progress) {
                this.data.userProgress = JSON.parse(progress);
            }
        } catch (error) {
            console.warn('Error loading from localStorage:', error);
        }
    },
    
    // Save data to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('ecoTracker_activities', JSON.stringify(this.data.activities));
            localStorage.setItem('ecoTracker_calculations', JSON.stringify(this.data.savedCalculations));
            localStorage.setItem('ecoTracker_progress', JSON.stringify(this.data.userProgress));
        } catch (error) {
            console.warn('Error saving to localStorage:', error);
        }
    },
    
    // Add activity to user's history
    addActivity(activity) {
        const activityData = {
            id: Date.now(),
            type: activity.type,
            description: activity.description,
            impact: activity.impact || 0,
            timestamp: new Date().toISOString(),
            category: activity.category || 'general'
        };
        
        this.data.activities.unshift(activityData);
        
        // Keep only last 20 activities
        if (this.data.activities.length > 20) {
            this.data.activities = this.data.activities.slice(0, 20);
        }
        
        this.saveToStorage();
        this.displayRecentActivity();
    },
    
    // Clear all activities
    clearActivities() {
        if (confirm('Are you sure you want to clear all activity? This action cannot be undone.')) {
            this.data.activities = [];
            this.saveToStorage();
            this.displayRecentActivity();
        }
    },
    
    // Display recent activities
    displayRecentActivity() {
        const container = document.getElementById('activity-container');
        if (!container) return;
        
        if (this.data.activities.length === 0) {
            container.innerHTML = `<p class="no-activity">Start using EcoTracker to see your activity here!</p>`;
            return;
        }
        
        const activitiesHtml = this.data.activities.map(activity => `
            <div class="activity-item slide-up">
                <div class="activity-icon">${this.getActivityIcon(activity.category)}</div>
                <div class="activity-content">
                    <h4>${activity.description}</h4>
                    <p class="activity-meta">
                        ${activity.impact > 0 ? `<span class="impact">-${activity.impact} kg CO₂</span>` : ''}
                        <span class="timestamp">${this.formatDate(activity.timestamp)}</span>
                    </p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = activitiesHtml;
    },
    
    // Get icon for activity category
    getActivityIcon(category) {
        const icons = {
            transport: '🚗',
            energy: '⚡',
            food: '🍎',
            waste: '♻️',
            calculator: '🧮',
            tips: '💡',
            general: '🌱'
        };
        return icons[category] || icons.general;
    },
    
    // Format date for display
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Mobile navigation toggle
        this.setupMobileNavigation();
        
        // Clear activity button
        const clearActivityBtn = document.getElementById('clear-activity');
        if (clearActivityBtn) {
            clearActivityBtn.addEventListener('click', () => this.clearActivities());
        }
        
        // Form submissions and other interactions will be handled by page-specific scripts
    },
    
    // Setup mobile navigation
    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    },
    
    // Update dynamic content (dates, etc.)
    updateDynamicContent() {
        // Update current year
        const yearElements = document.querySelectorAll('#current-year');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => el.textContent = currentYear);
        
        // Update last modified date
        const lastModifiedElements = document.querySelectorAll('#last-modified');
        const lastModified = `Last Modified: ${document.lastModified}`;
        lastModifiedElements.forEach(el => el.textContent = lastModified);
    },
    
    // Animate statistics counters
    animateStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOutCubic * target);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            requestAnimationFrame(updateCounter);
        };
        
        // Use Intersection Observer to trigger animation when in view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.textContent === '0') {
                        animateCounter(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(stat => observer.observe(stat));
        } else {
            // Fallback for browsers without Intersection Observer
            statNumbers.forEach(animateCounter);
        }
    },
    
    // Utility functions
    utils: {
        // Debounce function for search inputs
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Format numbers for display
        formatNumber(num, decimals = 1) {
            if (num < 1000) return num.toFixed(decimals);
            if (num < 1000000) return (num / 1000).toFixed(decimals) + 'K';
            return (num / 1000000).toFixed(decimals) + 'M';
        },
        
        // Validate email format
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        // Show toast notification
        showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            
            // Add toast styles if not already present
            if (!document.querySelector('.toast-styles')) {
                const styles = document.createElement('style');
                styles.className = 'toast-styles';
                styles.textContent = `
                    .toast {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 1rem 1.5rem;
                        border-radius: 8px;
                        color: white;
                        font-weight: 500;
                        z-index: 10000;
                        animation: slideInRight 0.3s ease;
                    }
                    .toast-success { background: #10b981; }
                    .toast-error { background: #ef4444; }
                    .toast-warning { background: #f59e0b; }
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    EcoTracker.init();
});

// Make EcoTracker globally available
window.EcoTracker = EcoTracker;

// Event listeners for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav .nav-link');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav')});
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        // Change hamburger icon to X when open
        if (mainNav.classList.contains('show')) {
            this.innerHTML = '✕';
        } else {
            this.innerHTML = '☰';
        }
    });
    
    // Close mobile menu when a nav link is clicked
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            links.forEach(lnk => lnk.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu on small screens
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('show');
                mobileMenuBtn.innerHTML = '☰';
            }
            
            // Filter temples based on link clicked
            let filteredTemples;
            switch(this.id) {
                case 'old':
                    filteredTemples = filterOld();
                    break;
                case 'new':
                    filteredTemples = filterNew();
                    break;
                case 'large':
                    filteredTemples = filterLarge();
                    break;
                case 'small':
                    filteredTemples = filterSmall();
                    break;
                default:
                    filteredTemples = temples;
            }
            
            renderTemples(filteredTemples);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !mainNav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            mainNav.classList.contains('show')) {
            mainNav.classList.remove('show');
            mobileMenuBtn.innerHTML = '☰';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('show');
            mobileMenuBtn.innerHTML = '☰';
        }
    });