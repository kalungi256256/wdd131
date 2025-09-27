// scripts/main.js
// Product data array
const products = [
    {
        id: "fc-1888",
        name: "flux capacitor",
        averageRating: 4.5,
        category: "electronics",
        price: 299.99
    },
    {
        id: "fc-2050",
        name: "power laces",
        averageRating: 4.7,
        category: "wearables",
        price: 149.99
    },
    {
        id: "fs-1987",
        name: "time circuits",
        averageRating: 3.5,
        category: "electronics",
        price: 499.99
    },
    {
        id: "ac-2000",
        name: "low voltage reactor",
        averageRating: 3.9,
        category: "home",
        price: 199.99
    },
    {
        id: "jj-1969",
        name: "warp equalizer",
        averageRating: 5.0,
        category: "audio",
        price: 399.99
    }
];

// DOM manipulation and event handling
document.addEventListener('DOMContentLoaded', function() {
    // Update current year in footer
    updateCurrentYear();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Load and display featured reviews
    loadFeaturedReviews();
    
    // Initialize review counter
    initReviewCounter();
});

// Function to update current year in footer
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Function to initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Update aria-expanded attribute for accessibility
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Function to initialize newsletter form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const messageElement = document.getElementById('newsletter-message');
    
    if (newsletterForm && messageElement) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Simple email validation
            if (validateEmail(email)) {
                // Save to localStorage
                saveSubscriber(email);
                
                // Show success message
                showMessage('Thank you for subscribing to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
            } else {
                showMessage('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show message
function showMessage(text, type) {
    const messageElement = document.getElementById('newsletter-message');
    if (messageElement) {
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'message';
        }, 5000);
    }
}

// Function to save subscriber to localStorage
function saveSubscriber(email) {
    let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
    
    // Check if email already exists
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
}

// Function to load and display featured reviews
function loadFeaturedReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    
    if (reviewsGrid && products.length > 0) {
        // Clear existing content (except for the first placeholder if any)
        reviewsGrid.innerHTML = '';
        
        // Get featured products (first 3 for example)
        const featuredProducts = products.slice(0, 3);
        
        // Create review cards
        featuredProducts.forEach(product => {
            const reviewCard = createReviewCard(product);
            reviewsGrid.appendChild(reviewCard);
        });
    }
}

// Function to create a review card element
function createReviewCard(product) {
    const article = document.createElement('article');
    article.className = 'review-card';
    
    // Generate star rating HTML
    const stars = generateStarRating(product.averageRating);
    
    // Use template literal for building the HTML
    article.innerHTML = `
        <img src="images/${product.id}.jpg" alt="${product.name}" loading="lazy">
        <div class="review-content">
            <h3>${product.name.charAt(0).toUpperCase() + product.name.slice(1)}</h3>
            <div class="rating">${stars}</div>
            <p>${getProductDescription(product.category)}</p>
            <a href="reviews/${product.id}.html">Read Full Review</a>
        </div>
    `;
    
    return article;
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        stars += '½';
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// Function to get product description based on category
function getProductDescription(category) {
    const descriptions = {
        electronics: 'Advanced electronic device with cutting-edge technology.',
        wearables: 'Smart wearable technology for modern lifestyles.',
        home: 'Home automation device that simplifies daily tasks.',
        audio: 'High-quality audio equipment for immersive sound.'
    };
    
    return descriptions[category] || 'Innovative product with excellent features.';
}

// Function to initialize review counter
function initReviewCounter() {
    // Check if we're on the review submission page
    if (window.location.pathname.includes('submit-review.html')) {
        // This would be implemented on the review submission page
        console.log('Review submission page loaded');
    }
    
    // For demonstration, let's track page views
    trackPageView();
}

// Function to track page views using localStorage
function trackPageView() {
    let pageViews = parseInt(localStorage.getItem('pageViews')) || 0;
    pageViews++;
    localStorage.setItem('pageViews', pageViews);
    
    console.log(`Page views: ${pageViews}`);
}

// Additional utility functions
function filterProductsByCategory(category) {
    // Use array method (filter)
    return products.filter(product => product.category === category);
}

function sortProductsByRating(order = 'desc') {
    // Use array method (sort)
    return [...products].sort((a, b) => {
        if (order === 'desc') {
            return b.averageRating - a.averageRating;
        } else {
            return a.averageRating - b.averageRating;
        }
    });
}

// Example of conditional branching
function getPriceCategory(price) {
    if (price < 100) {
        return 'Budget';
    } else if (price >= 100 && price < 300) {
        return 'Mid-range';
    } else {
        return 'Premium';
    }
}

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        generateStarRating,
        filterProductsByCategory,
        sortProductsByRating,
        getPriceCategory
    };
}