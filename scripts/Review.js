  
        // Product array (same as form page)
        const products = [
            {
                id: "fc-1888",
                name: "flux capacitor",
                averagerating: 4.5
            },
            {
                id: "fc-2050",
                name: "power laces",
                averagerating: 4.7
            },
            {
                id: "fs-1987",
                name: "time circuits",
                averagerating: 3.5
            },
            {
                id: "ac-2000",
                name: "low voltage reactor",
                averagerating: 3.9
            },
            {
                id: "jj-1969",
                name: "warp equalizer",
                averagerating: 5.0
            }
        ];

        // Function to get URL parameters
        function getURLParameter(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        // Function to get product name by ID
        function getProductName(productId) {
            const product = products.find(p => p.id === productId);
            return product ? product.name : 'Unknown Product';
        }

        // Function to generate star rating display
        function generateStarRating(rating) {
            const stars = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
            return `<span class="rating-display">${rating}<span class="rating-stars">${stars}</span></span>`;
        }

        // Function to format features
        function formatFeatures(features) {
            if (!features) return '<div class="info-value">None selected</div>';

            const featureLabels = {
                'easy-setup': 'Easy Setup',
                'user-friendly': 'User Friendly',
                'durable': 'Durable',
                'good-value': 'Good Value',
                'reliable': 'Reliable',
                'excellent-support': 'Excellent Support'
            };

            const featureArray = Array.isArray(features) ? features : [features];
            const featureTags = featureArray.map(feature =>
                `<span class="feature-tag">${featureLabels[feature] || feature}</span>`
            ).join('');

            return `<div class="features-list">${featureTags}</div>`;
        }

        // Function to update review counter using localStorage
        function updateReviewCounter() {
            // Get current count from localStorage
            let reviewCount = localStorage.getItem('reviewCount');

            // If no count exists, start at 0
            if (!reviewCount) {
                reviewCount = 0;
            } else {
                reviewCount = parseInt(reviewCount);
            }

            // Increment the count
            reviewCount++;

            // Save the new count to localStorage
            localStorage.setItem('reviewCount', reviewCount.toString());

            // Display the count
            document.getElementById('reviewCounter').textContent = reviewCount;
        }

        // Function to display review information
        function displayReviewInfo() {
            const productId = getURLParameter('productName');
            const rating = getURLParameter('rating');
            const installDate = getURLParameter('installDate');
            const features = getURLParameter('features');
            const writtenReview = getURLParameter('writtenReview');
            const userName = getURLParameter('userName');

            const reviewInfoDiv = document.getElementById('reviewInfo');

            let html = '<h3 style="margin-bottom: 20px; color: #2c3e50;">Review Summary</h3>';

            if (productId) {
                html += `
                    <div class="info-item">
                        <div class="info-label">Product:</div>
                        <div class="info-value">${getProductName(productId)}</div>
                    </div>
                `;
            }

            if (rating) {
                html += `
                    <div class="info-item">
                        <div class="info-label">Rating:</div>
                        <div class="info-value">${generateStarRating(rating)}</div>
                    </div>
                `;
            }

            if (installDate) {
                html += `
                    <div class="info-item">
                        <div class="info-label">Installation Date:</div>
                        <div class="info-value">${new Date(installDate).toLocaleDateString()}</div>
                    </div>
                `;
            }

            html += `
                <div class="info-item">
                    <div class="info-label">Useful Features:</div>
                    ${formatFeatures(features)}
                </div>
            `;

            if (writtenReview) {
                html += `
                    <div class="info-item">
                        <div class="info-label">Written Review:</div>
                        <div class="info-value">"${writtenReview}"</div>
                    </div>
                `;
            }

            if (userName) {
                html += `
                    <div class="info-item">
                        <div class="info-label">Reviewer:</div>
                        <div class="info-value">${userName}</div>
                    </div>
                `;
            }

            reviewInfoDiv.innerHTML = html;
        }

        // Initialize the page when DOM is loaded
        document.addEventListener('DOMContentLoaded', function () {
            displayReviewInfo();
            updateReviewCounter();
            document.getElementById('copyright-year').textContent = new Date().getFullYear();
            document.getElementById('last-modified').textContent = document.lastModified;
        });
        ;
    