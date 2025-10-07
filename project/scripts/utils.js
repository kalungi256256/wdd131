// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('a[data-page]');
    const pageContent = document.getElementById('page-content');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links ul');
    
    // Load home page by default
    loadPage('home');
    
    // Handle page navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            loadPage(targetPage);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        });
    });
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }
    });
    
    // Function to load pages
    function loadPage(pageName) {
        fetch(`pages/${pageName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(html => {
                pageContent.innerHTML = html;
                
                // Initialize page-specific functionality
                initializePage(pageName);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                pageContent.innerHTML = '<div class="error-message"><h2>Page Not Found</h2><p>The requested page could not be loaded.</p></div>';
            });
    }
    
    // Function to initialize page-specific functionality
    function initializePage(pageName) {
        switch(pageName) {
            case 'home':
                displayProducts(products.slice(0, 8), 'featured-products');
                break;
            case 'products':
                displayProducts(products, 'all-products');
                break;
            case 'categories':
                const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
                displayProducts(shuffledProducts.slice(0, 12), 'category-products');
                break;
            case 'account':
                initializeAccountPage();
                break;
            case 'review':
                initializeReviewPage();
                break;
            case 'help':
                initializeHelpPage();
                break;
        }
        
        // Add to cart functionality for all product pages
        initializeAddToCart();
    }
    
    // Initialize account page functionality
    function initializeAccountPage() {
        const accountTabs = document.querySelectorAll('.account-sidebar li');
        const accountSections = document.querySelectorAll('.account-section');
        
        if (accountTabs.length > 0) {
            accountTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const targetTab = this.getAttribute('data-tab');
                    
                    // Remove active class from all tabs and sections
                    accountTabs.forEach(t => t.classList.remove('active'));
                    accountSections.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding section
                    this.classList.add('active');
                    document.getElementById(`${targetTab}-section`).classList.add('active');
                });
            });
        }
    }
    
    // Initialize review page functionality
    function initializeReviewPage() {
        const stars = document.querySelectorAll('.star-rating i');
        let currentRating = 0;
        
        if (stars.length > 0) {
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    currentRating = rating;
                    
                    stars.forEach((s, index) => {
                        if (index < rating) {
                            s.classList.remove('far');
                            s.classList.add('fas', 'active');
                        } else {
                            s.classList.remove('fas', 'active');
                            s.classList.add('far');
                        }
                    });
                });
                
                star.addEventListener('mouseover', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    
                    stars.forEach((s, index) => {
                        if (index < rating) {
                            s.classList.remove('far');
                            s.classList.add('fas');
                        } else {
                            s.classList.remove('fas');
                            s.classList.add('far');
                        }
                    });
                });
                
                star.addEventListener('mouseout', function() {
                    stars.forEach((s, index) => {
                        if (index < currentRating) {
                            s.classList.remove('far');
                            s.classList.add('fas', 'active');
                        } else {
                            s.classList.remove('fas', 'active');
                            s.classList.add('far');
                        }
                    });
                });
            });
            
            // Submit review functionality
            const submitReviewBtn = document.getElementById('submit-review');
            if (submitReviewBtn) {
                submitReviewBtn.addEventListener('click', function() {
                    const title = document.getElementById('review-title').value;
                    const text = document.getElementById('review-text').value;
                    
                    if (!title || !text || currentRating === 0) {
                        alert('Please fill in all fields and select a rating');
                        return;
                    }
                    
                    alert('Thank you for your review!');
                    document.getElementById('review-title').value = '';
                    document.getElementById('review-text').value = '';
                    
                    // Reset stars
                    stars.forEach(star => {
                        star.classList.remove('fas', 'active');
                        star.classList.add('far');
                    });
                    currentRating = 0;
                });
            }
        }
    }
    
    // Add to cart functionality
    function initializeAddToCart() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-title').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                
                // Simple cart functionality - in a real app, this would be more complex
                alert(`Added ${productName} to cart!`);
                
                // Here you would typically update a cart counter and store the item
                updateCartCounter();
            });
        });
    }
    
    // Update cart counter (placeholder function)
    function updateCartCounter() {
        // This would update a cart counter in the header
        console.log('Cart updated');
    }
});