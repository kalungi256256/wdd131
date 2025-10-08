// Global variables
let allProducts = [];
let currentRating = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing page');
    initializePage();
    setupEventListeners();
});

// Initialize page based on current URL
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);

    switch (currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'products.html':
            initializeProductsPage();
            break;
        case 'account.html':
            initializeAccountPage();
            break;
        case 'review.html':
            initializeReviewPage();
            break;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Explore Deals button - Redirect to products page
    const exploreButton = document.querySelector('.cta-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', function () {
            console.log('Explore button clicked - redirecting to products page');
            window.location.href = 'products.html';
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

    // Star rating for reviews
    const starRatings = document.querySelectorAll('.star-rating span');
    starRatings.forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            setStarRating(this.parentElement, rating);
        });

        star.addEventListener('mouseover', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(this.parentElement, rating);
        });

        star.addEventListener('mouseout', function () {
            setStarRating(this.parentElement, currentRating);
        });
    });

    // Product filters
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }

    if (sortBy) {
        sortBy.addEventListener('change', filterAndSortProducts);
    }

    // Form submissions
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
}

function initializeHomePage() {
    console.log('Initializing home page');
    loadFeaturedProducts();
    updateHeroImage();
}

function initializeProductsPage() {
    console.log('Initializing products page');
    generateProducts();
    displayAllProducts(); 
}

function initializeAccountPage() {
    console.log('Initializing account page');
    loadOrderHistory();
}

function initializeReviewPage() {
    console.log('Initializing review page');
    loadReviews();
}

function generateProducts() {
    console.log('Generating products...');

    // Fixed products array with consistent categories and unique IDs
    const products = [
        {
            id: 1,
            name: 'Smartphone X1',
            price: '299.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
            rating: '4.5',
            description: 'Latest smartphone with advanced features'
        },
        {
            id: 2,
            name: 'Laptop Pro',
            price: '899.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
            rating: '4.7',
            description: 'High-performance laptop for professionals'
        },
        {
            id: 3,
            name: 'Wireless Headphones',
            price: '149.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
            rating: '4.3',
            description: 'Premium sound quality wireless headphones'
        },
        {
            id: 4,
            name: 'Smart Watch',
            price: '199.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
            rating: '4.2',
            description: 'Feature-rich smartwatch with health tracking'
        },
        {
            id: 5,
            name: 'Digital Camera',
            price: '449.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
            rating: '4.6',
            description: 'Professional digital camera for photography'
        },
        {
            id: 6,
            name: 'Tablet Mini',
            price: '329.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
            rating: '4.4',
            description: 'Compact tablet for work and entertainment'
        },
        {
            id: 7,
            name: 'Gaming Console',
            price: '399.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
            rating: '4.8',
            description: 'Next-gen gaming console with immersive experience'
        },
        {
            id: 8,
            name: 'Fitness Tracker',
            price: '79.99',
            category: 'electronics',
            image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop',
            rating: '4.1',
            description: 'Advanced fitness tracking wearable device'
        },
        {
            id: 9,
            name: 'Classic T-Shirt',
            price: '29.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
            rating: '4.2',
            description: 'Premium quality designer t-shirt'
        },
        {
            id: 10,
            name: 'Summer Dress',
            price: '49.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
            rating: '4.5',
            description: 'Elegant summer dress for all occasions'
        },
        {
            id: 11,
            name: 'Running Shoes',
            price: '89.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
            rating: '4.4',
            description: 'Comfortable running shoes for athletes'
        },
        {
            id: 12,
            name: 'Leather Jacket',
            price: '129.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
            rating: '4.6',
            description: 'Warm leather jacket for cold weather'
        },
        {
            id: 13,
            name: 'Casual Jeans',
            price: '39.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
            rating: '4.3',
            description: 'Comfortable casual jeans for everyday wear'
        },
        {
            id: 14,
            name: 'Formal Shirt',
            price: '45.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop',
            rating: '4.2',
            description: 'Professional formal shirt for office wear'
        },
        {
            id: 15,
            name: 'Leather Bag',
            price: '79.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
            rating: '4.7',
            description: 'Genuine leather bag for daily use'
        },
        {
            id: 16,
            name: 'Sunglasses',
            price: '39.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
            rating: '4.3',
            description: 'Stylish sunglasses with UV protection'
        },
        {
            id: 17,
            name: 'Coffee Maker',
            price: '89.99',
            category: 'home',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            rating: '4.4',
            description: 'Automatic coffee maker for perfect brew'
        },
        {
            id: 18,
            name: 'Desk Lamp',
            price: '34.99',
            category: 'home',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
            rating: '4.1',
            description: 'Modern desk lamp for workspace'
        },
        {
            id: 19,
            name: 'Kitchen Set',
            price: '129.99',
            category: 'home',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
            rating: '4.7',
            description: 'Complete kitchen utensil set'
        },
        {
            id: 20,
            name: 'Yoga Mat',
            price: '29.99',
            category: 'home',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
            rating: '4.2',
            description: 'Non-slip yoga mat for exercise'
        },
        {
            id: 21,
            name: 'Skincare Set',
            price: '59.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
            rating: '4.5',
            description: 'Complete skincare routine set'
        },
        {
            id: 22,
            name: 'Perfume',
            price: '89.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
            rating: '4.3',
            description: 'Luxury fragrance perfume'
        },
        {
            id: 23,
            name: 'Makeup Kit',
            price: '69.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
            rating: '4.6',
            description: 'Complete makeup collection kit'
        },
        {
            id: 24,
            name: 'Body Lotion',
            price: '19.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop',
            rating: '4.1',
            description: 'Nourishing body lotion for soft skin'
        },
        {
            id: 25,
            name: 'Lipstick Set',
            price: '34.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop',
            rating: '4.5',
            description: 'Variety lipstick set with multiple shades'
        },
        {
            id: 26,
            name: 'Nail Polish Set',
            price: '22.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop',
            rating: '4.2',
            description: 'Colorful nail polish collection'
        }
    ];

    allProducts = products;
    console.log('Products generated:', allProducts.length);
}

// Display ALL products on the page at once
function displayAllProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.log('Products container not found');
        return;
    }

    console.log('Displaying ALL products:', allProducts.length);

    productsContainer.innerHTML = '';

    allProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });

    // Hide the load more container
    const loadMoreContainer = document.querySelector('.load-more-container');
    if (loadMoreContainer) {
        loadMoreContainer.style.display = 'none';
    }
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${formatCategory(product.category)}</p>
            <div class="product-rating">
                ${generateStarRating(parseFloat(product.rating))}
                <span>${product.rating}</span>
            </div>
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
    return card;
}

// Format category name for display
function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '★';
        } else if (i === fullStars && halfStar) {
            stars += '½';
        } else {
            stars += '☆';
        }
    }

    return `<span class="stars">${stars}</span>`;
}

// Load featured products on home page
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) {
        console.log('Featured products container not found');
        return;
    }

    // Generate products if not already generated
    if (allProducts.length === 0) {
        generateProducts();
    }

    const featuredProducts = allProducts.slice(0, 6); // Show first 6 as featured

    console.log('Loading featured products:', featuredProducts.length);

    featuredContainer.innerHTML = '';

    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredContainer.appendChild(productCard);
    });
}

// Update hero image with random Unsplash image
function updateHeroImage() {
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        const images = [
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=600&h=400&fit=crop'
        ];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        heroImg.src = randomImage;
        heroImg.alt = "Oner Express Ug - Online Shopping in Uganda";
        console.log('Hero image updated');
    }
}

// Filter and sort products
function filterAndSortProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');

    if (!categoryFilter || !sortBy) return;

    const selectedCategory = categoryFilter.value;
    const sortOption = sortBy.value;

    let filteredProducts = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProducts = allProducts.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortOption) {
        case 'price-low':
            filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default: // featured
            filteredProducts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    // Display filtered and sorted products
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = '';
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.appendChild(productCard);
        });
    }
}

// Account tab switching
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

// Load order history
function loadOrderHistory() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    const orders = [
        { id: 'ORD-001', date: '2024-01-15', total: '$149.99', status: 'Delivered' },
        { id: 'ORD-002', date: '2024-01-10', total: '$89.50', status: 'Delivered' },
        { id: 'ORD-003', date: '2024-01-05', total: '$234.75', status: 'Processing' },
        { id: 'ORD-004', date: '2023-12-28', total: '$67.25', status: 'Delivered' }
    ];

    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-date">${order.date}</span>
            </div>
            <div class="order-details">
                <span class="order-total">${order.total}</span>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
        `;
        ordersList.appendChild(orderElement);
    });
}

// Handle profile update
function handleProfileUpdate(event) {
    event.preventDefault();
    alert('Profile updated successfully!');
}

// Set star rating
function setStarRating(container, rating) {
    const stars = container.querySelectorAll('span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Highlight stars on hover
function highlightStars(container, rating) {
    const stars = container.querySelectorAll('span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#FFD700';
        } else {
            star.style.color = '#E0E0E0';
        }
    });
}

// Load reviews
function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    const reviews = [
        {
            author: 'Sarah M.',
            date: '2024-01-20',
            rating: 5,
            title: 'Excellent Service!',
            content: 'The products are amazing and delivery was super fast. Will definitely shop again!',
            verified: true
        },
        {
            author: 'John D.',
            date: '2024-01-18',
            rating: 4,
            title: 'Great Quality',
            content: 'Good products at reasonable prices. Customer service was helpful.',
            verified: true
        },
        {
            author: 'Grace K.',
            date: '2024-01-15',
            rating: 5,
            title: 'Love It!',
            content: 'Everything was perfect from ordering to delivery. Highly recommended!',
            verified: false
        },
        {
            author: 'Mike T.',
            date: '2024-01-12',
            rating: 4,
            title: 'Satisfied Customer',
            content: 'Good experience overall. Products met my expectations.',
            verified: true
        }
    ];

    reviewsContainer.innerHTML = '';

    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-author">
                    ${review.author}
                    ${review.verified ? '<span class="verified">✓ Verified</span>' : ''}
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-rating">
                ${generateStarRating(review.rating)}
            </div>
            <h3 class="review-title">${review.title}</h3>
            <p class="review-content">${review.content}</p>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

// Handle review submission
function handleReviewSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('review-title').value;
    const content = document.getElementById('review-content').value;

    if (!title || !content || currentRating === 0) {
        alert('Please fill in all fields and select a rating.');
        return;
    }

    alert('Thank you for your review!');

    // Reset form
    document.getElementById('review-form').reset();
    currentRating = 0;
    setStarRating(document.querySelector('.star-rating'), 0);
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        alert(`Added ${product.name} to cart!`);
    }
}

// Set footer content
document.getElementById('copyright-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Make functions globally available
window.addToCart = addToCart;
window.filterAndSortProducts = filterAndSortProducts;
window.switchTab = switchTab;
window.setStarRating = setStarRating;
window.highlightStars = highlightStars;

// Initialize when page loads
window.addEventListener('load', function () {
    console.log('Window loaded - adding dynamic styles');
    // Add some CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .product-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
        }
        
        .product-rating .stars {
            color: var(--secondary);
        }
        
        .product-category {
            color: #666;
            font-size: 0.9rem;
            text-transform: capitalize;
        }
        
        .add-to-cart-btn {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .add-to-cart-btn:hover {
            background-color: #1a7fd9;
            transform: translateY(-2px);
        }
        
        .order-item {
            border-bottom: 1px solid var(--light-gray);
            padding: 1rem 0;
        }
        
        .order-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .order-details {
            display: flex;
            justify-content: space-between;
        }
        
        .order-status.delivered {
            color: green;
        }
        
        .order-status.processing {
            color: orange;
        }
        
        .verified {
            color: green;
            font-size: 0.8rem;
            margin-left: 0.5rem;
        }
        
        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding: 1rem;
            background-color: var(--background);
            border-radius: 5px;
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: var(--primary);
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        
        /* CTA Button Styles */
        .cta-button {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(30, 144, 255, 0.3);
        }
        
        .cta-button:hover {
            background-color: #1a7fd9;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(30, 144, 255, 0.4);
        }
        
        .cta-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 10px rgba(30, 144, 255, 0.3);
        }
        
        /* Hide load more container */
        .load-more-container {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
});