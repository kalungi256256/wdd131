// Order and Checkout JavaScript

const OrderManager = {
    // State management
    state: {
        currentStep: 1,
        orderData: {
            customer: {},
            shipping: { method: 'standard' },
            payment: { method: 'card' }
        },
        totals: {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0
        },
        isProcessing: false
    },

    // Initialize order page
    init() {
        this.loadCartItems();
        this.calculateTotals();
        this.setupEventListeners();
        this.setupFormValidation();
        this.displayOrderSummary();
        this.checkCartEmpty();
    },

    // Check if cart is empty and redirect if needed
    checkCartEmpty() {
        if (OnerExpress.getCartItemCount() === 0) {
            OnerExpress.showToast('Your cart is empty. Redirecting to products...', 'warning');
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 2000);
        }
    },

    // Load cart items
    loadCartItems() {
        const cartData = OnerExpress.data.cart;
        this.state.totals.subtotal = OnerExpress.getCartTotal();
    },

    // Setup event listeners
    setupEventListeners() {
        // Checkout form submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                this.handleCheckoutSubmit(e);
            });
        }

        // Shipping method changes
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.handleShippingChange(e.target.value);
            });
        });

        // Payment method changes
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.handlePaymentMethodChange(e.target.value);
            });
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                this.formatExpiryDate(e.target);
            });
        }

        // CVV input restriction
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Auto-fill user data if signed in
        this.autoFillUserData();
    },

    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById('checkout-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });

            input.addEventListener('input', (e) => {
                this.clearFieldError(e.target);
            });
        });
    },

    // Auto-fill user data if signed in
    autoFillUserData() {
        const user = OnerExpress.getCurrentUser();
        if (user) {
            const firstNameField = document.getElementById('first-name');
            const lastNameField = document.getElementById('last-name');
            const emailField = document.getElementById('email');
            const phoneField = document.getElementById('phone');

            if (firstNameField) firstNameField.value = user.firstName || '';
            if (lastNameField) lastNameField.value = user.lastName || '';
            if (emailField) emailField.value = user.email || '';
            if (phoneField) phoneField.value = user.phone || '';
        }
    },

    // Handle shipping method change
    handleShippingChange(method) {
        this.state.orderData.shipping.method = method;
        this.calculateTotals();
        this.updateOrderSummary();
    },

    // Handle payment method change
    handlePaymentMethodChange(method) {
        this.state.orderData.payment.method = method;
        
        const cardDetails = document.getElementById('card-details');
        if (cardDetails) {
            if (method === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        }
    },

    // Format card number input
    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
        value = value.substring(0, 16); // Limit to 16 digits
        
        // Add spaces every 4 digits
        const formatted = value.replace(/(.{4})/g, '$1 ').trim();
        input.value = formatted;
    },

    // Format expiry date input
    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    },

    // Calculate order totals
    calculateTotals() {
        this.state.totals.subtotal = OnerExpress.getCartTotal();
        this.state.totals.shipping = OnerExpress.calculateShipping(this.state.orderData.shipping.method);
        this.state.totals.tax = OnerExpress.calculateTax(this.state.totals.subtotal);
        this.state.totals.total = this.state.totals.subtotal + this.state.totals.shipping + this.state.totals.tax;
    },

    // Display order summary
    displayOrderSummary() {
        this.displayOrderItems();
        this.updateOrderSummary();
    },

    // Display order items
    displayOrderItems() {
        const container = document.getElementById('order-items');
        if (!container) return;

        const cartItems = OnerExpress.data.cart;
        
        if (cartItems.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No items in cart</p>';
            return;
        }

        const itemsHtml = cartItems.map(item => `
            <div class="order-item">
                <div class="item-info">
                    <img src="${item.image}" alt="${item.name}" class="item-image" width="50" height="50">
                    <div class="item-details">
                        <h5>${item.name}</h5>
                        <p class="item-quantity">Qty: ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        container.innerHTML = itemsHtml;
    },

    // Update order summary totals
    updateOrderSummary() {
        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping-cost');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `$${this.state.totals.subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${this.state.totals.tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${this.state.totals.total.toFixed(2)}`;
        
        if (shippingEl) {
            if (this.state.totals.shipping === 0) {
                shippingEl.textContent = 'FREE';
            } else {
                shippingEl.textContent = `$${this.state.totals.shipping.toFixed(2)}`;
            }
        }
    },

    // Handle checkout form submission
    async handleCheckoutSubmit(e) {
        e.preventDefault();
        
        if (this.state.isProcessing) return;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (this.validateCheckoutForm(data)) {
            this.state.isProcessing = true;
            this.setLoadingState(true);

            try {
                // Prepare order data
                const orderData = this.prepareOrderData(data);
                
                // Process the order
                const order = await OnerExpress.processOrder(orderData);
                
                // Show confirmation
                this.showOrderConfirmation(order);
                
            } catch (error) {
                OnerExpress.showToast(error.message, 'error');
            } finally {
                this.state.isProcessing = false;
                this.setLoadingState(false);
            }
        }
    },

    // Validate checkout form
    validateCheckoutForm(data) {
        let isValid = true;

        // Required field validation
        const requiredFields = {
            firstName: 'First name is required',
            lastName: 'Last name is required',
            email: 'Email address is required',
            phone: 'Phone number is required',
            address: 'Street address is required',
            city: 'City is required',
            state: 'State is required',
            zip: 'ZIP code is required'
        };

        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!data[field] || !data[field].trim()) {
                this.showFieldError(field, message);
                isValid = false;
            }
        });

        // Email validation
        if (data.email && !OnerExpress.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation
        if (data.phone && !OnerExpress.isValidPhone(data.phone)) {
            this.showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // ZIP code validation
        if (data.zip && !OnerExpress.isValidZip(data.zip)) {
            this.showFieldError('zip', 'Please enter a valid 5-digit ZIP code');
            isValid = false;
        }

        // Payment validation (if card payment)
        if (data.payment === 'card') {
            if (!data.cardNumber || !OnerExpress.isValidCardNumber(data.cardNumber)) {
                this.showFieldError('card-number', 'Please enter a valid card number');
                isValid = false;
            }

            if (!data.expiry || !OnerExpress.isValidExpiry(data.expiry)) {
                this.showFieldError('expiry', 'Please enter a valid expiry date (MM/YY)');
                isValid = false;
            }

            if (!data.cvv || !OnerExpress.isValidCVV(data.cvv)) {
                this.showFieldError('cvv', 'Please enter a valid CVV');
                isValid = false;
            }
        }

        return isValid;
    },

    // Validate individual field
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();

        this.clearFieldError(field);

        // Skip validation if field is empty (will be caught by required validation)
        if (!value) return;

        switch (fieldName) {
            case 'email':
                if (!OnerExpress.isValidEmail(value)) {
                    this.showFieldError(field.id, 'Please enter a valid email address');
                }
                break;

            case 'phone':
                if (!OnerExpress.isValidPhone(value)) {
                    this.showFieldError(field.id, 'Please enter a valid phone number');
                }
                break;

            case 'zip':
                if (!OnerExpress.isValidZip(value)) {
                    this.showFieldError(field.id, 'Please enter a valid 5-digit ZIP code');
                }
                break;

            case 'cardNumber':
                if (!OnerExpress.isValidCardNumber(value)) {
                    this.showFieldError(field.id, 'Please enter a valid card number');
                }
                break;

            case 'expiry':
                if (!OnerExpress.isValidExpiry(value)) {
                    this.showFieldError(field.id, 'Please enter a valid expiry date (MM/YY)');
                }
                break;

            case 'cvv':
                if (!OnerExpress.isValidCVV(value)) {
                    this.showFieldError(field.id, 'Please enter a valid CVV');
                }
                break;
        }
    },

    // Show field error
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const field = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (field) {
            field.style.borderColor = '#ef4444';
        }
    },

    // Clear field error
    clearFieldError(field) {
        const fieldId = field.id;
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.style.borderColor = '#e2e8f0';
    },

    // Set loading state
    setLoadingState(isLoading) {
        const form = document.getElementById('checkout-form');
        const submitBtn = form?.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        
        if (submitBtn && btnText && btnLoading) {
            submitBtn.disabled = isLoading;
            
            if (isLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
            } else {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }
    },

    // Prepare order data
    prepareOrderData(formData) {
        return {
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                }
            },
            shipping: {
                method: formData.shipping
            },
            payment: {
                method: formData.payment,
                // In a real app, payment details would be handled securely
                cardLastFour: formData.payment === 'card' ? formData.cardNumber.slice(-4) : null
            }
        };
    },

    // Show order confirmation
    showOrderConfirmation(order) {
        // Hide checkout section
        const checkoutSection = document.getElementById('checkout-section');
        const confirmationSection = document.getElementById('confirmation-section');

        if (checkoutSection) checkoutSection.style.display = 'none';
        if (confirmationSection) confirmationSection.style.display = 'block';

        // Populate confirmation details
        this.populateConfirmationDetails(order);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show success toast
        OnerExpress.showToast('Order placed successfully! Thank you for your purchase.', 'success');
    },

    // Populate confirmation details
    populateConfirmationDetails(order) {
        // Order information
        const orderNumber = document.getElementById('order-number');
        const orderDate = document.getElementById('order-date');
        const finalTotal = document.getElementById('final-total');

        if (orderNumber) orderNumber.textContent = order.orderNumber;
        if (orderDate) orderDate.textContent = OnerExpress.formatDate(order.orderDate);
        if (finalTotal) finalTotal.textContent = OnerExpress.formatCurrency(order.totals.total);

        // Shipping information
        const shippingDetails = document.getElementById('shipping-details');
        if (shippingDetails) {
            const customer = order.customer;
            const shippingMethod = this.getShippingMethodName(order.shipping.method);
            
            shippingDetails.innerHTML = `
                <div class="detail-row">
                    <span>Name:</span>
                    <span>${customer.firstName} ${customer.lastName}</span>
                </div>
                <div class="detail-row">
                    <span>Address:</span>
                    <span>${customer.address.street}<br>
                          ${customer.address.city}, ${customer.address.state} ${customer.address.zip}</span>
                </div>
                <div class="detail-row">
                    <span>Method:</span>
                    <span>${shippingMethod}</span>
                </div>
                <div class="detail-row">
                    <span>Email:</span>
                    <span>${customer.email}</span>
                </div>
                <div class="detail-row">
                    <span>Phone:</span>
                    <span>${OnerExpress.formatPhoneNumber(customer.phone)}</span>
                </div>
            `;
        }

        // Ordered items
        const orderedItems = document.getElementById('ordered-items');
        if (orderedItems) {
            const itemsHtml = order.items.map(item => `
                <div class="order-item">
                    <div class="item-info">
                        <img src="${item.image}" alt="${item.name}" class="item-image" width="50" height="50">
                        <div class="item-details">
                            <h5>${item.name}</h5>
                            <p class="item-quantity">Quantity: ${item.quantity}</p>
                            <p class="item-unit-price">$${item.price.toFixed(2)} each</p>
                        </div>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');
            
            orderedItems.innerHTML = itemsHtml;
        }
    },

    // Get shipping method display name
    getShippingMethodName(method) {
        const methods = {
            'standard': 'Standard Delivery (5-7 business days)',
            'express': 'Express Delivery (2-3 business days)',
            'overnight': 'Overnight Delivery (Next business day)'
        };
        return methods[method] || 'Standard Delivery';
    }
};

// Initialize order manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the order page
    if (document.getElementById('checkout-form')) {
        OrderManager.init();
    }
});