// Oner Express - Main JavaScript

// Main application object
const OnerExpress = {
    // Application data
    data: {
        products: [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                price: 79.99,
                category: "electronics",
                rating: 4.5,
                image: "images/headphones.jpg",
                description: "Premium wireless headphones with noise cancellation"
            },
            {
                id: 2,
                name: "Smart Fitness Watch",
                price: 199.99,
                category: "electronics",
                rating: 4.8,
                image: "images/smartwatch.jpg",
                description: "Track your fitness goals with this advanced smartwatch"
            },
            {
                id: 3,
                name: "Casual Cotton T-Shirt",
                price: 24.99,
                category: "fashion",
                rating: 4.3,
                image: "images/tshirt.jpg",
                description: "Comfortable cotton t-shirt for everyday wear"
            },
            {
                id: 4,
                name: "Yoga Mat Premium",
                price: 45.99,
                category: "sports",
                rating: 4.6,
                image: "images/yoga-mat.jpg",
                description: "Non-slip premium yoga mat for your workout routine"
            },
            {
                id: 5,
                name: "Coffee Maker Deluxe",
                price: 89.99,
                category: "home",
                rating: 4.4,
                image: "images/coffee-maker.jpg",
                description: "Brew perfect coffee every morning with this deluxe maker"
            },
            {
                id: 6,
                name: "Smartphone Case",
                price: 19.99,
                category: "electronics",
                rating: 4.2,
                image: "images/phone-case.jpg",
                description: "Protective case for your smartphone with style"
            },
            {
                id: 7,
                name: "Running Shoes",
                price: 129.99,
                category: "fashion",
                rating: 4.7,
                image: "images/running-shoes.jpg",
                description: "Comfortable running shoes for your daily jogs"
            },
            {
                id: 8,
                name: "Desk Lamp LED",
                price: 34.99,
                category: "home",
                rating: 4.1,
                image: "images/desk-lamp.jpg",
                description: "Adjustable LED desk lamp with multiple brightness levels"
            }
        ],
        cart: [],
        user: null
    },

    // Initialize the application
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.updateDynamicContent();
        this.updateCartDisplay();
        this.loadPopularProducts();
    },

    // Load data from localStorage
    loadFromStorage() {
        try {
            const cart = localStorage.getItem('onerexpress_cart');
            const user = localStorage.getItem('onerexpress_user');
            
            if (cart) {
                this.data.cart = JSON.parse(cart);
            }
            if (user) {
                this.data.user = JSON.parse(user);
            }
        } catch (error) {
            console.warn('Error loading from localStorage:', error);
        }
    },

    // Save data to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('onerexpress_cart', JSON.stringify(this.data.cart));
            if (this.data.user) {
                localStorage.setItem('onerexpress_user', JSON.stringify(this.data.user));
            }
        } catch (error) {
            console.warn('Error saving to localStorage:', error);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Mobile navigation toggle
        this.setupMobileNavigation();
        
        // Cart functionality
        this.setupCartFunctionality();
        
        // Newsletter form
        this.setupNewsletterForm();
    },

    // Setup mobile navigation
    setupMobileNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
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
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    },

    // Setup cart functionality
    setupCartFunctionality() {
        const cartIcon = document.getElementById('cart-icon');
        const cartSummary = document.getElementById('cart-summary');
        const closeCart = document.getElementById('close-cart');
        
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                this.showCartSummary();
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.hideCartSummary();
            });
        }
        
        // Close cart when clicking outside
        if (cartSummary) {
            cartSummary.addEventListener('click', (e) => {
                if (e.target === cartSummary) {
                    this.hideCartSummary();
                }
            });
        }
    },

    // Setup newsletter form
    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                
                if (this.isValidEmail(email)) {
                    this.showToast('Thank you for subscribing to our newsletter!', 'success');
                    e.target.reset();
                } else {
                    this.showToast('Please enter a valid email address.', 'error');
                }
            });
        }
    },

    // Update dynamic content
    updateDynamicContent() {
        // Update current year
        const yearElements = document.querySelectorAll('#current-year');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            if (el) el.textContent = currentYear;
        });
        
        // Update last modified date
        const lastModifiedElements = document.querySelectorAll('#last-modified');
        const lastModified = `Last Modified: ${document.lastModified}`;
        lastModifiedElements.forEach(el => {
            if (el) el.textContent = lastModified;
        });
    },

    // Load popular products on home page
    loadPopularProducts() {
        const container = document.getElementById('popular-products');
        if (!container) return;

        // Show first 4 products as popular
        const popularProducts = this.data.products.slice(0, 4);
        const productsHtml = popularProducts.map(product => this.createProductHTML(product)).join('');
        container.innerHTML = productsHtml;

        // Add event listeners to product cards
        this.attachProductEventListeners();
    },

    // Create HTML for a product
    createProductHTML(product) {
        const stars = this.generateStarRating(product.rating);
        
        return `
            <div class="product-card fade-in" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" width="280" height="200" loading="lazy">
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${product.rating} (${this.getRandomReviewCount()} reviews)</span>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    },

    // Generate star rating HTML
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '⭐';
        }
        if (hasHalfStar) {
            stars += '⭐';
        }
        
        return stars;
    },

    // Get random review count for display
    getRandomReviewCount() {
        return Math.floor(Math.random() * 500) + 50;
    },

    // Attach event listeners to product cards
    attachProductEventListeners() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                this.addToCart(productId);
            });
        });
    },

    // Add product to cart
    addToCart(productId, quantity = 1) {
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('Product not found!', 'error');
            return;
        }

        const existingItem = this.data.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.data.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveToStorage();
        this.updateCartDisplay();
        this.showToast(`${product.name} added to cart!`, 'success');
        
        // Animate the add to cart button
        const btn = document.querySelector(`[data-product-id="${productId}"]`);
        if (btn && btn.classList.contains('add-to-cart-btn')) {
            btn.classList.add('loading');
            setTimeout(() => btn.classList.remove('loading'), 1000);
        }
    },

    // Remove product from cart
    removeFromCart(productId) {
        const itemIndex = this.data.cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const item = this.data.cart[itemIndex];
            this.data.cart.splice(itemIndex, 1);
            this.saveToStorage();
            this.updateCartDisplay();
            this.showToast(`${item.name} removed from cart.`, 'success');
        }
    },

    // Update cart quantity
    updateCartQuantity(productId, quantity) {
        const item = this.data.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartDisplay();
            }
        }
    },

    // Update cart display
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const totalItems = this.data.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    // Show cart summary
    showCartSummary() {
        const cartSummary = document.getElementById('cart-summary');
        if (!cartSummary) return;

        this.populateCartSummary();
        cartSummary.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    // Hide cart summary
    hideCartSummary() {
        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    // Populate cart summary
    populateCartSummary() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        if (this.data.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #64748b;">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        const cartHtml = this.data.cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}" width="50" height="50">
                    <div>
                        <h5>${item.name}</h5>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item-btn" data-product-id="${item.id}" style="background: none; border: none; color: #ef4444; cursor: pointer; margin-left: 10px;">✕</button>
                </div>
            </div>
        `).join('');

        cartItems.innerHTML = cartHtml;

        // Calculate total
        const total = this.data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);

        // Add remove button event listeners
        cartItems.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                this.removeFromCart(productId);
            });
        });
    },

    // Get cart total
    getCartTotal() {
        return this.data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Get cart item count
    getCartItemCount() {
        return this.data.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Clear entire cart
    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.data.cart = [];
            this.saveToStorage();
            this.updateCartDisplay();
            this.hideCartSummary();
            this.showToast('Cart cleared successfully.', 'success');
        }
    },

    // User authentication functions
    signInUser(userData) {
        this.data.user = {
            id: Date.now(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone || '',
            signedInAt: new Date().toISOString()
        };
        
        this.saveToStorage();
        this.showToast(`Welcome, ${userData.firstName}!`, 'success');
        return true;
    },

    signOutUser() {
        this.data.user = null;
        localStorage.removeItem('onerexpress_user');
        this.showToast('You have been signed out.', 'success');
    },

    isUserSignedIn() {
        return this.data.user !== null;
    },

    getCurrentUser() {
        return this.data.user;
    },

    // Filter products
    filterProducts(category = 'all', priceRange = 'all', searchTerm = '') {
        let filtered = [...this.data.products];

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(product => product.category === category);
        }

        // Filter by price range
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
            filtered = filtered.filter(product => {
                if (max) {
                    return product.price >= parseFloat(min) && product.price <= parseFloat(max);
                } else {
                    return product.price >= parseFloat(min);
                }
            });
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term)
            );
        }

        return filtered;
    },

    // Sort products
    sortProducts(products, sortBy) {
        const sorted = [...products];

        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    },

    // Generate order number
    generateOrderNumber() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `OE-${timestamp}${random}`;
    },

    // Process order
    processOrder(orderData) {
        return new Promise((resolve, reject) => {
            // Simulate order processing delay
            setTimeout(() => {
                if (Math.random() > 0.05) { // 95% success rate
                    const order = {
                        orderNumber: this.generateOrderNumber(),
                        orderDate: new Date().toISOString(),
                        customer: orderData.customer,
                        items: [...this.data.cart],
                        shipping: orderData.shipping,
                        payment: orderData.payment,
                        totals: {
                            subtotal: this.getCartTotal(),
                            shipping: this.calculateShipping(orderData.shipping.method),
                            tax: this.calculateTax(this.getCartTotal()),
                            total: this.calculateOrderTotal(orderData.shipping.method)
                        }
                    };

                    // Save order to localStorage
                    this.saveOrder(order);
                    
                    // Clear cart after successful order
                    this.data.cart = [];
                    this.saveToStorage();
                    this.updateCartDisplay();

                    resolve(order);
                } else {
                    reject(new Error('Order processing failed. Please try again.'));
                }
            }, 2000);
        });
    },

    // Save order to localStorage
    saveOrder(order) {
        try {
            const orders = JSON.parse(localStorage.getItem('onerexpress_orders') || '[]');
            orders.push(order);
            localStorage.setItem('onerexpress_orders', JSON.stringify(orders));
        } catch (error) {
            console.warn('Error saving order:', error);
        }
    },

    // Calculate shipping cost
    calculateShipping(method) {
        const shippingCosts = {
            standard: 0,
            express: 9.99,
            overnight: 19.99
        };
        return shippingCosts[method] || 0;
    },

    // Calculate tax (8% tax rate)
    calculateTax(subtotal) {
        return subtotal * 0.08;
    },

    // Calculate order total
    calculateOrderTotal(shippingMethod) {
        const subtotal = this.getCartTotal();
        const shipping = this.calculateShipping(shippingMethod);
        const tax = this.calculateTax(subtotal);
        return subtotal + shipping + tax;
    },

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\(\)\-\+]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    isValidZip(zip) {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zip);
    },

    isValidCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        const cardRegex = /^\d{13,19}$/;
        return cardRegex.test(cleaned);
    },

    isValidExpiry(expiry) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(expiry)) return false;

        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        const expYear = parseInt(year);
        const expMonth = parseInt(month);

        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    },

    isValidCVV(cvv) {
        const cvvRegex = /^\d{3,4}$/;
        return cvvRegex.test(cvv);
    },

    // Format card number for display
    formatCardNumber(cardNumber) {
        return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    },

    // Format phone number for display
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    },

    // Show toast notification
    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

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
                    max-width: 400px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                }
                .toast-success { background: #10b981; }
                .toast-error { background: #ef4444; }
                .toast-warning { background: #f59e0b; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @media (max-width: 768px) {
                    .toast {
                        left: 20px;
                        right: 20px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toast);

        // Auto remove toast after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 4000);
    },

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

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get products by category
    getProductsByCategory(category) {
        return this.data.products.filter(product => product.category === category);
    },

    // Get product by ID
    getProductById(id) {
        return this.data.products.find(product => product.id === id);
    },

    // Add event listener helper that checks if element exists
    addEventListenerSafe(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    OnerExpress.init();
});

// Make OnerExpress globally available
window.OnerExpress = OnerExpress;