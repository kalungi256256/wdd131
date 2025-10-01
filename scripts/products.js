// Products Page JavaScript

const ProductsManager = {
    // State management
    state: {
        filteredProducts: [],
        currentFilter: {
            category: 'all',
            priceRange: 'all',
            searchTerm: '',
            sortBy: 'name'
        },
        productsPerPage: 9,
        currentPage: 1,
        totalPages: 0
    },

    // Initialize products page
    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
        this.updateProductsCount();
    },

    // Load and filter products
    loadProducts() {
        this.state.filteredProducts = OnerExpress.filterProducts(
            this.state.currentFilter.category,
            this.state.currentFilter.priceRange,
            this.state.currentFilter.searchTerm
        );

        this.state.filteredProducts = OnerExpress.sortProducts(
            this.state.filteredProducts,
            this.state.currentFilter.sortBy
        );

        this.calculatePagination();
    },

    // Calculate pagination
    calculatePagination() {
        this.state.totalPages = Math.ceil(this.state.filteredProducts.length / this.state.productsPerPage);
        
        // Reset to page 1 if current page exceeds total pages
        if (this.state.currentPage > this.state.totalPages) {
            this.state.currentPage = 1;
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Filter controls
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const searchInput = document.getElementById('search-products');
        const sortSelect = document.getElementById('sort-products');
        const loadMoreBtn = document.getElementById('load-more-btn');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.handleFilterChange('category', e.target.value);
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.handleFilterChange('priceRange', e.target.value);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', 
                OnerExpress.debounce((e) => {
                    this.handleFilterChange('searchTerm', e.target.value);
                }, 300)
            );
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleFilterChange('sortBy', e.target.value);
            });
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }

        // Search button
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = document.getElementById('search-products').value;
                this.handleFilterChange('searchTerm', searchTerm);
            });
        }
    },

    // Handle filter changes
    handleFilterChange(filterType, value) {
        this.state.currentFilter[filterType] = value;
        this.state.currentPage = 1; // Reset to first page
        this.loadProducts();
        this.displayProducts();
        this.updateProductsCount();
    },

    // Display products
    displayProducts() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        const startIndex = (this.state.currentPage - 1) * this.state.productsPerPage;
        const endIndex = startIndex + this.state.productsPerPage;
        const productsToShow = this.state.filteredProducts.slice(0, endIndex);

        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                    <button class="btn btn-outline" onclick="ProductsManager.clearFilters()">Clear All Filters</button>
                </div>
            `;
            this.hideLoadMoreButton();
            return;
        }

        const productsHtml = productsToShow.map(product => 
            this.createProductHTML(product)
        ).join('');

        container.innerHTML = productsHtml;

        // Add event listeners to product cards
        this.attachProductEventListeners();

        // Update load more button
        this.updateLoadMoreButton();
    },

    // Create HTML for a product
    createProductHTML(product) {
        const stars = this.generateStarRating(product.rating);
        const reviewCount = Math.floor(Math.random() * 500) + 50;
        
        return `
            <div class="product-card fade-in" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" width="280" height="200" loading="lazy">
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description" style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                        ${product.description}
                    </p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${product.rating} (${reviewCount} reviews)</span>
                    </div>
                    <div class="product-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" style="flex: 1;">
                            Add to Cart
                        </button>
                        <button class="btn btn-outline quick-view-btn" data-product-id="${product.id}" style="padding: 0.75rem;">
                            👁️
                        </button>
                    </div>
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
        
        // Fill remaining with empty stars (up to 5)
        const totalStars = hasHalfStar ? fullStars + 1 : fullStars;
        for (let i = totalStars; i < 5; i++) {
            stars += '☆';
        }
        
        return stars;
    },

    // Attach event listeners to product cards
    attachProductEventListeners() {
        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                this.handleAddToCart(productId, btn);
            });
        });

        // Quick view buttons
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                this.showProductQuickView(productId);
            });
        });
    },

    // Handle add to cart with visual feedback
    handleAddToCart(productId, button) {
        const originalText = button.innerHTML;
        button.innerHTML = 'Adding...';
        button.disabled = true;
        button.style.opacity = '0.7';

        // Add to cart
        OnerExpress.addToCart(productId);

        // Visual feedback
        setTimeout(() => {
            button.innerHTML = '✓ Added';
            button.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.opacity = '1';
                button.style.background = '';
            }, 1500);
        }, 500);
    },

    // Show product quick view
    showProductQuickView(productId) {
        const product = OnerExpress.getProductById(productId);
        if (!product) return;

        const quickViewHtml = `
            <div class="quick-view-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center;">
                <div class="quick-view-content" style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <div class="quick-view-header" style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
                        <h2 style="margin: 0; flex: 1;">${product.name}</h2>
                        <button class="close-quick-view" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">&times;</button>
                    </div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="color: var(--text-secondary); margin-bottom: 1rem;">${product.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">$${product.price.toFixed(2)}</span>
                        <div class="product-rating">
                            <span>${this.generateStarRating(product.rating)}</span>
                            <span style="margin-left: 0.5rem;">${product.rating}/5</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" onclick="OnerExpress.addToCart(${product.id}); document.querySelector('.quick-view-overlay').remove();" style="flex: 1;">Add to Cart</button>
                        <button class="btn btn-secondary" onclick="document.querySelector('.quick-view-overlay').remove();">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing quick view
        const existingQuickView = document.querySelector('.quick-view-overlay');
        if (existingQuickView) {
            existingQuickView.remove();
        }

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', quickViewHtml);

        // Add event listeners
        const overlay = document.querySelector('.quick-view-overlay');
        const closeBtn = document.querySelector('.close-quick-view');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Re-enable body scroll when removed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const quickViewExists = document.querySelector('.quick-view-overlay');
                    if (!quickViewExists) {
                        document.body.style.overflow = 'auto';
                        observer.disconnect();
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true });
    },

    // Load more products
    loadMoreProducts() {
        this.state.currentPage += 1;
        this.displayProducts();
    },

    // Update products count display
    updateProductsCount() {
        const countElement = document.getElementById('products-count');
        if (countElement) {
            countElement.textContent = this.state.filteredProducts.length;
        }
    },

    // Update load more button
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const displayedCount = this.state.currentPage * this.state.productsPerPage;
        const totalCount = this.state.filteredProducts.length;

        if (displayedCount >= totalCount) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            const remainingCount = totalCount - displayedCount;
            loadMoreBtn.textContent = `Load More Products (${remainingCount} remaining)`;
        }
    },

    // Hide load more button
    hideLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    },

    // Clear all filters
    clearFilters() {
        this.state.currentFilter = {
            category: 'all',
            priceRange: 'all',
            searchTerm: '',
            sortBy: 'name'
        };

        // Reset form controls
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const searchInput = document.getElementById('search-products');
        const sortSelect = document.getElementById('sort-products');

        if (categoryFilter) categoryFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'name';

        // Reload products
        this.state.currentPage = 1;
        this.loadProducts();
        this.displayProducts();
        this.updateProductsCount();

        OnerExpress.showToast('Filters cleared successfully!', 'success');
    },

    // Get random products for suggestions
    getRandomProducts(count = 4) {
        const shuffled = [...OnerExpress.data.products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
};

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the products page
    if (document.getElementById('products-grid')) {
        ProductsManager.init();
    }
});