// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing account page');
    initializeAccountPage();
    setupAccountEventListeners();
});

// Initialize account page
function initializeAccountPage() {
    console.log('Initializing account page');
    checkUserRegistration();
    loadUserProfile();
    loadOrderHistory();
    initializeSettings();
}

// Check if user is registered and show confirmation
function checkUserRegistration() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const isNewUser = !userProfile;
    
    if (isNewUser) {
        showRegistrationWelcome();
    } else {
        showWelcomeBackMessage(userProfile.name);
    }
}

// Setup account page event listeners
function setupAccountEventListeners() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Account tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Profile form submission (Registration/Sign Up)
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleUserRegistration);
    }

    // Settings toggles
    const settingToggles = document.querySelectorAll('.switch input');
    settingToggles.forEach(toggle => {
        toggle.addEventListener('change', handleSettingChange);
    });
}

// Handle user registration/sign up
function handleUserRegistration(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Validation
    if (!name || !email || !phone) {
        showMessage('error', 'Please fill in all fields to complete your registration.');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address.');
        return;
    }

    if (!isValidPhone(phone)) {
        showMessage('error', 'Please enter a valid phone number.');
        return;
    }

    // Create user profile
    const userProfile = {
        name: name,
        email: email,
        phone: phone,
        registrationDate: new Date().toISOString(),
        isVerified: false
    };

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Create empty orders array if it doesn't exist
    if (!localStorage.getItem('userOrders')) {
        localStorage.setItem('userOrders', JSON.stringify([]));
    }

    // Show registration success message
    showRegistrationSuccess(userProfile);
    
    console.log('User registered successfully:', userProfile);
}

// Show registration welcome for new users
function showRegistrationWelcome() {
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'registration-welcome';
        welcomeMessage.innerHTML = `
            <div class="welcome-content">
                <h2>👋 Welcome to Oner Express Ug!</h2>
                <p>Complete your registration to start shopping and manage your account.</p>
                <div class="welcome-features">
                    <div class="feature">
                        <span class="feature-icon">🛒</span>
                        <span>Shop amazing products</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🚚</span>
                        <span>Fast delivery</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">⭐</span>
                        <span>Exclusive deals</span>
                    </div>
                </div>
            </div>
        `;
        pageHeader.appendChild(welcomeMessage);
    }
}

// Show registration success message
function showRegistrationSuccess(userProfile) {
    showMessage('success', 
        `🎉 Welcome to the Oner Express Ug family, ${userProfile.name}!\n\n` +
        `Your account has been successfully created!\n\n` +
        `📧 <strong>Email:</strong> ${userProfile.email}\n` +
        `📞 <strong>Phone:</strong> ${userProfile.phone}\n\n` +
        `You can now:\n` +
        `• Shop our amazing products\n` +
        `• Track your orders\n` +
        `• Write reviews\n` +
        `• Get exclusive deals`
    );

    // Update UI to show user is registered
    updateUIForRegisteredUser(userProfile.name);
}

// Show welcome back message for returning users
function showWelcomeBackMessage(userName) {
    showMessage('info', 
        `👋 Welcome back, ${userName}!\n\n` +
        `Great to see you again. Ready to continue shopping?`
    );
}

// Update UI after successful registration
function updateUIForRegisteredUser(userName) {
    // Update page header
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.textContent = `Welcome, ${userName}!`;
    }

    // Update button text from "Sign Up" to "Update Profile"
    const submitButton = document.querySelector('.save-btn');
    if (submitButton) {
        submitButton.textContent = 'Update Profile';
        submitButton.removeEventListener('click', handleUserRegistration);
        submitButton.addEventListener('click', handleProfileUpdate);
    }

    // Remove welcome message if exists
    const welcomeMessage = document.querySelector('.registration-welcome');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
}

// Handle profile update for existing users
function handleProfileUpdate(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Validation
    if (!name || !email || !phone) {
        showMessage('error', 'Please fill in all fields.');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('error', 'Please enter a valid email address.');
        return;
    }

    if (!isValidPhone(phone)) {
        showMessage('error', 'Please enter a valid phone number.');
        return;
    }

    // Update user profile
    const userProfile = {
        name: name,
        email: email,
        phone: phone,
        registrationDate: JSON.parse(localStorage.getItem('userProfile')).registrationDate,
        isVerified: false,
        lastUpdated: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    showMessage('success', 
        `✅ Profile updated successfully!\n\n` +
        `Your account information has been saved.`
    );

    // Update UI
    updateUIForRegisteredUser(userProfile.name);
}

// Load user profile from localStorage
function loadUserProfile() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));

    if (userProfile) {
        // Populate form fields
        document.getElementById('name').value = userProfile.name || '';
        document.getElementById('email').value = userProfile.email || '';
        document.getElementById('phone').value = userProfile.phone || '';

        // Update UI for registered user
        updateUIForRegisteredUser(userProfile.name);
        
        console.log('User profile loaded:', userProfile);
    } else {
        // Set up for new registration
        const submitButton = document.querySelector('.save-btn');
        if (submitButton) {
            submitButton.textContent = 'Sign Up';
        }
    }
}

// Load order history
function loadOrderHistory() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    // Get orders from localStorage or use sample data
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [
        { 
            id: 'ORD-001', 
            date: '2024-01-15', 
            total: '$149.99', 
            status: 'Delivered',
            items: ['Smartphone X1', 'Wireless Headphones']
        },
        { 
            id: 'ORD-002', 
            date: '2024-01-10', 
            total: '$89.50', 
            status: 'Delivered',
            items: ['Summer Dress']
        },
        { 
            id: 'ORD-003', 
            date: '2024-01-05', 
            total: '$234.75', 
            status: 'Processing',
            items: ['Laptop Pro', 'Smart Watch']
        },
        { 
            id: 'ORD-004', 
            date: '2023-12-28', 
            total: '$67.25', 
            status: 'Delivered',
            items: ['Skincare Set']
        }
    ];

    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <div class="no-orders-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your order history here!</p>
                <a href="products.html" class="shop-now-btn">Explore Our more exciting deals😍</a>
            </div>
        `;
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <span class="order-total">${order.total}</span>
            </div>
            <div class="order-items">
                <strong>Items:</strong> ${order.items.join(', ')}
            </div>
            <div class="order-footer">
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                <button class="order-details-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
            </div>
        `;
        ordersList.appendChild(orderElement);
    });
}

// Initialize settings
function initializeSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {
        notifications: true,
        newsletter: true
    };

    // Set toggle states
    const notificationToggle = document.querySelector('input[type="checkbox"]:nth-child(1)');
    const newsletterToggle = document.querySelector('input[type="checkbox"]:nth-child(2)');

    if (notificationToggle) notificationToggle.checked = settings.notifications;
    if (newsletterToggle) newsletterToggle.checked = settings.newsletter;
}

// Handle setting changes
function handleSettingChange(event) {
    const settingName = event.target.parentElement.previousElementSibling.textContent.toLowerCase();
    const isEnabled = event.target.checked;

    const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
    settings[settingName] = isEnabled;
    
    localStorage.setItem('userSettings', JSON.stringify(settings));

    showMessage('success', 
        `${settingName.charAt(0).toUpperCase() + settingName.slice(1)} ${isEnabled ? 'enabled' : 'disabled'} successfully!`
    );
}

// Tab switching function
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// View order details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        alert(`Order Details:\n\nID: ${order.id}\nDate: ${order.date}\nTotal: ${order.total}\nStatus: ${order.status}\nItems: ${order.items.join(', ')}`);
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.account-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `account-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${getMessageIcon(type)}</span>
            <div class="message-text">${message.replace(/\n/g, '<br>')}</div>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Insert before the account section
    const accountSection = document.querySelector('.account-section');
    accountSection.parentNode.insertBefore(messageDiv, accountSection);

    // Auto-remove success messages after 6 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 6000);
    }
}

function getMessageIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    return icons[type] || '💡';
}

// Add CSS for account page
function addAccountStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .account-message {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            animation: slideIn 0.3s ease-out;
        }
        
        .account-message.success {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .account-message.error {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .account-message.info {
            background: linear-gradient(135deg, #d1ecf1, #bee5eb);
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        
        .message-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        
        .message-icon {
            font-size: 1.25rem;
            flex-shrink: 0;
        }
        
        .message-text {
            flex: 1;
            line-height: 1.5;
        }
        
        .message-close {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .registration-welcome {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin: 1rem 0;
            text-align: center;
        }
        
        .welcome-features {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }
        
        .feature {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .feature-icon {
            font-size: 1.5rem;
        }
        header{
            color:solid white}
            
        .no-orders {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        
        .no-orders-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        
        .shop-now-btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .shop-now-btn:hover {
            background: #1a7fd9;
            transform: translateY(-2px);
        }
        
        .order-item {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }
        
        .order-item:hover {
            border-color: var(--primary);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .order-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .order-id {
            font-weight: bold;
            color: #333;
        }
        
        .order-date {
            color: #666;
            font-size: 0.9rem;
        }
        
        .order-total {
            font-weight: bold;
            color: var(--primary);
            font-size: 1.1rem;
        }
        
        .order-items {
            color: #666;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .order-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .order-status.delivered {
            background: #d4edda;
            color: #155724;
        }
        
        .order-status.processing {
            background: #fff3cd;
            color: #856404;
        }
        
        .order-details-btn {
            background: transparent;
            border: 1px solid var(--primary);
            color: var(--primary);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .order-details-btn:hover {
            background: var(--primary);
            color: white;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles when page loads
window.addEventListener('load', function () {
    console.log('Window loaded - adding account styles');
    addAccountStyles();
});

// Make functions globally available
window.switchTab = switchTab;
window.viewOrderDetails = viewOrderDetails;