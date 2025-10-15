// Global variables
let allProducts = [];
let currentRating = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing review page');
    initializeReviewPage();
    setupReviewEventListeners();
});

// Initialize review page
function initializeReviewPage() {
    console.log('Initializing review page');
    loadProductsForReview();
    loadReviews();
    updateReviewStats();
}

// Setup review-specific event listeners
function setupReviewEventListeners() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Star rating for reviews
    // ensure there is a hidden input to hold the numeric rating for form submission
    const formEl = document.getElementById('review-form');
    if (formEl && !document.getElementById('review-rating')) {
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.id = 'review-rating';
        hidden.name = 'rating';
        hidden.value = '0';
        formEl.appendChild(hidden);
    }

    const starRatings = document.querySelectorAll('.star-rating span');
    // Initialize ARIA roles and tabindex for star widgets
    const starContainers = document.querySelectorAll('.star-rating');
    starContainers.forEach(container => {
        container.setAttribute('role', 'radiogroup');
        const label = document.getElementById('review-rating-label');
        if (label && !container.getAttribute('aria-labelledby')) {
            container.setAttribute('aria-labelledby', 'review-rating-label');
        }
        const starsIn = container.querySelectorAll('span');
        starsIn.forEach(st => {
            st.setAttribute('role', 'radio');
            st.setAttribute('tabindex', '0');
            st.setAttribute('aria-checked', 'false');
        });
    });
    starRatings.forEach(star => {
        // click/tap selects rating
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            setStarRating(this.parentElement, rating);
            updateHiddenRating(rating);
        });

        // hover highlights (visual only)
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(this.parentElement, rating);
        });

        star.addEventListener('mouseout', function() {
            setStarRating(this.parentElement, currentRating);
        });

        // keyboard support: Enter/Space to select, arrows to move
        star.addEventListener('keydown', function(e) {
            const key = e.key;
            const parent = this.parentElement;
            const rating = parseInt(this.getAttribute('data-rating'));
            if (key === 'Enter' || key === ' ') {
                e.preventDefault();
                currentRating = rating;
                setStarRating(parent, rating);
                updateHiddenRating(rating);
                this.setAttribute('aria-checked', 'true');
            } else if (key === 'ArrowRight' || key === 'ArrowUp') {
                e.preventDefault();
                const nextRating = Math.min(5, rating + 1);
                const nextStar = parent.querySelector(`[data-rating="${nextRating}"]`);
                if (nextStar) { nextStar.focus(); }
            } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
                e.preventDefault();
                const prevRating = Math.max(1, rating - 1);
                const prevStar = parent.querySelector(`[data-rating="${prevRating}"]`);
                if (prevStar) { prevStar.focus(); }
            }
        });
    });

    // Review form submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
}

// Load products for the dropdown
function loadProductsForReview() {
    // Generate products if not already available
    if (allProducts.length === 0) {
        generateProducts();
    }

    const productSelect = document.getElementById('review-product');
    if (!productSelect) {
        console.log('Creating product dropdown...');
        createProductDropdown();
        return;
    }

    populateProductDropdown(productSelect);
}

// Create product dropdown and reviewer name field in the form
function createProductDropdown() {
    // Create reviewer name field
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    nameGroup.innerHTML = `
        <label for="reviewer-name">Your Name *</label>
        <input type="text" id="reviewer-name" placeholder="Enter your name" required>
    `;

    // Create product dropdown
    const productGroup = document.createElement('div');
    productGroup.className = 'form-group';
    productGroup.innerHTML = `
        <label for="review-product">Select Product *</label>
        <select id="review-product" required>
            <option value="">Choose a product to review...</option>
        </select>
    `;

    // Insert name field after rating
    const ratingGroup = document.querySelector('.form-group');
    ratingGroup.parentNode.insertBefore(nameGroup, ratingGroup.nextSibling);

    // Insert product dropdown after name field
    nameGroup.parentNode.insertBefore(productGroup, nameGroup.nextSibling);

    // Populate the dropdown
    const productSelect = document.getElementById('review-product');
    populateProductDropdown(productSelect);
}

// Populate product dropdown with options
function populateProductDropdown(selectElement) {
    // Clear existing options except the first one
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }

    // Add products to dropdown
    allProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price}`;
        option.setAttribute('data-category', product.category);
        selectElement.appendChild(option);
    });

    console.log('Product dropdown populated with', allProducts.length, 'products');
}

// Generate products for reviews
function generateProducts() {
    console.log('Generating products for reviews...');

    const products = [{
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
            name: 'Summer Dress',
            price: '49.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
            rating: '4.5',
            description: 'Elegant summer dress for all occasions'
        },
        {
            id: 6,
            name: 'Running Shoes',
            price: '89.99',
            category: 'fashion',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
            rating: '4.4',
            description: 'Comfortable running shoes for athletes'
        },
        {
            id: 7,
            name: 'Coffee Maker',
            price: '89.99',
            category: 'home',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            rating: '4.4',
            description: 'Automatic coffee maker for perfect brew'
        },
        {
            id: 8,
            name: 'Skincare Set',
            price: '59.99',
            category: 'beauty',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
            rating: '4.5',
            description: 'Complete skincare routine set'
        }
    ];

    allProducts = products;
    console.log('Products generated for reviews:', allProducts.length);
}

// Handle review submission
function handleReviewSubmit(event) {
    event.preventDefault();

    const reviewerName = document.getElementById('reviewer-name').value;
    const productSelect = document.getElementById('review-product');
    const title = document.getElementById('review-title').value;
    const content = document.getElementById('review-content').value;

    // Validation
    if (!reviewerName) {
        showAppreciationMessage('error', 'Please enter your name.');
        return;
    }

    if (!productSelect || !productSelect.value) {
        showAppreciationMessage('error', 'Please select a product to review.');
        return;
    }

    if (!title) {
        showAppreciationMessage('error', 'Please enter a review title.');
        return;
    }

    if (!content) {
        showAppreciationMessage('error', 'Please write your review content.');
        return;
    }

    if (currentRating === 0) {
        showAppreciationMessage('error', 'Please select a rating by clicking on the stars.');
        return;
    }

    const selectedProductId = parseInt(productSelect.value);
    const selectedProduct = allProducts.find(p => p.id === selectedProductId);

    if (!selectedProduct) {
        showAppreciationMessage('error', 'Selected product not found.');
        return;
    }

    // Create new review object
    const newReview = {
        author: reviewerName,
        date: new Date().toISOString().split('T')[0],
        rating: currentRating,
        title: title,
        content: content,
        product: selectedProduct.name,
        verified: true,
        isNew: true
    };

    // Save review to localStorage
    saveReviewToStorage(newReview);

    // Show success message with appreciation
    showAppreciationMessage('success',
        `Thank you so much, ${reviewerName}! 🌟\n\n` +
        `We truly appreciate you taking the time to review "${selectedProduct.name}". ` +
        `Your detailed feedback is incredibly valuable to us and helps other customers make informed decisions.\n\n` +
        `We're grateful to have you as part of the Oner Express Ug family!`
    );

    // Reset form
    resetReviewForm();

    // Reload reviews to show the new one
    setTimeout(() => {
        loadReviews();
        updateReviewStats();
    }, 3000);
}

// Show appreciation message
function showAppreciationMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.appreciation-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `appreciation-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${type === 'success' ? '💫' : '⚠️'}</span>
            <div class="message-text">${message.replace(/\n/g, '<br>')}</div>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Insert before the form
    const reviewForm = document.getElementById('review-form');
    reviewForm.parentNode.insertBefore(messageDiv, reviewForm);

    // Auto-remove success messages after 8 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 8000);
    }
}

// Save review to localStorage
function saveReviewToStorage(review) {
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    reviews.unshift(review); // Add to beginning
    localStorage.setItem('userReviews', JSON.stringify(reviews));
}

// Load reviews from localStorage and sample data
function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    // Get user reviews from localStorage
    const userReviews = JSON.parse(localStorage.getItem('userReviews')) || [];

    // Sample reviews (fallback)
    const sampleReviews = [{
            author: 'Museven Yoweri.',
            date: '2024-01-20',
            rating: 5,
            title: 'Excellent Service!',
            content: 'The products are amazing and delivery was super fast. Will definitely shop again!',
            product: 'Smartphone X1',
            verified: true
        },
        {
            author: 'kal izo.',
            date: '2024-01-18',
            rating: 4,
            title: 'Great Quality',
            content: 'Good products at reasonable prices. Customer service was helpful.',
            product: 'Laptop Pro',
            verified: true
        },
        {
            author: 'donald Trump.',
            date: '2024-01-15',
            rating: 5,
            title: 'Love It!',
            content: 'Everything was perfect from ordering to delivery. Highly recommended!',
            product: 'Summer Dress',
            verified: false
        }
    ];

    // Combine user reviews with sample reviews
    const allReviews = [...userReviews, ...sampleReviews];

    reviewsContainer.innerHTML = '';

    if (allReviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    allReviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = `review-card ${review.isNew ? 'new-review' : ''}`;
        reviewCard.innerHTML = `
            <div class="review-header">
                <div class="review-author">
                    ${review.author}
                    ${review.verified ? '<span class="verified">✓ Verified Purchase</span>' : ''}
                    ${review.isNew ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-product">
                <strong>Product:</strong> ${review.product || 'General'}
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

// Update review statistics
function updateReviewStats() {
    const userReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const sampleReviews = [
        { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }
    ];
    const allReviews = [...userReviews, ...sampleReviews];

    if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / allReviews.length).toFixed(1);

        // Update overall rating display
        const averageRatingElement = document.querySelector('.rating-value');
        if (averageRatingElement) {
            averageRatingElement.textContent = `${averageRating}/5`;
        }

        // Update total reviews count
        const reviewCountElement = document.querySelector('.rating-overview p');
        if (reviewCountElement) {
            reviewCountElement.textContent = `Based on ${allReviews.length} reviews`;
        }
    }
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return `<span class="stars">${stars}</span>`;
}

// Set star rating
function setStarRating(container, rating) {
    const stars = container.querySelectorAll('span');
    stars.forEach((star) => {
        const r = parseInt(star.getAttribute('data-rating'));
        if (r <= rating) {
            star.classList.add('active');
            star.setAttribute('aria-checked', 'true');
            // selected element should be focusable
            star.setAttribute('tabindex', '0');
        } else {
            star.classList.remove('active');
            star.setAttribute('aria-checked', 'false');
            // non-selected radios should be focusable too but prefer -1 so screen readers move predictably
            star.setAttribute('tabindex', '-1');
        }
    });
}

// Highlight stars on hover
function highlightStars(container, rating) {
    const stars = container.querySelectorAll('span');
    stars.forEach((star) => {
        const r = parseInt(star.getAttribute('data-rating'));
        if (r <= rating) {
            star.classList.add('highlight');
        } else {
            star.classList.remove('highlight');
        }
    });
}

// Reset review form
function resetReviewForm() {
    document.getElementById('review-form').reset();
    currentRating = 0;
    const starContainer = document.querySelector('.star-rating');
    if (starContainer) setStarRating(starContainer, 0);
    // Reset hidden input
    const hidden = document.getElementById('review-rating');
    if (hidden) hidden.value = '0';
    // Reset visual classes
    const stars = document.querySelectorAll('.star-rating span');
    stars.forEach(star => {
        star.classList.remove('highlight');
        star.classList.remove('active');
        star.setAttribute('aria-checked', 'false');
        star.setAttribute('tabindex', '0');
    });
}

function updateHiddenRating(value) {
    const hidden = document.getElementById('review-rating');
    if (hidden) hidden.value = String(value);
}

// Add CSS for appreciation messages and new features
function addReviewStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .appreciation-message {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            animation: slideIn 0.3s ease-out;
        }
        
        .appreciation-message.success {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .appreciation-message.error {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .message-content {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        
        .message-icon {
            font-size: 1.5rem;
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
        
        .review-card.new-review {
            border: 2px #4CAF50;
            margin: 1.2rem;
            justify-content: center;
            
        }
        
        .new-badge {
            background: #4CAF50;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            margin-left: 0.5rem;
        }
        
        .review-product {
            color: #666;
            font-size: 0.9rem;
            margin: 0.5rem 0;
            padding: 0.25rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .no-reviews {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-style: italic;
        }
        
        .star-rating span {
            cursor: pointer;
            font-size: 1.5rem;
            color: #E0E0E0;
            transition: color 0.2s ease;
        }
        
        .star-rating span.active,
        .star-rating span.highlight,
        .star-rating span:hover {
            color: #FFD700;
        }

        .star-rating span:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(255,215,0,0.12);
            border-radius: 4px;
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
        
        select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            background: white;
        }
        
        select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.1);
        }
        
        input[type="text"] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        input[type="text"]:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.1);
        }
            footer{
            background-color:palegrey}

            header{
            background-color:white}
    `;
    document.head.appendChild(style);
}

// Initialize styles when page loads
window.addEventListener('load', function() {
    console.log('Window loaded - adding review styles');
    addReviewStyles();
});

// Make functions globally available
window.setStarRating = setStarRating;
window.highlightStars = highlightStars;