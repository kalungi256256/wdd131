// Authentication JavaScript

const AuthManager = {
    // State management
    state: {
        currentForm: 'signin', // 'signin' or 'signup'
        isLoading: false
    },

    // Initialize auth page
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupPasswordToggles();
        this.loadSavedFormData();
    },

    // Setup event listeners
    setupEventListeners() {
        // Form switch buttons
        const showSignupBtn = document.getElementById('show-signup');
        const showSigninBtn = document.getElementById('show-signin');

        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', () => {
                this.switchToForm('signup');
            });
        }

        if (showSigninBtn) {
            showSigninBtn.addEventListener('click', () => {
                this.switchToForm('signin');
            });
        }

        // Form submissions
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');

        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                this.handleSigninSubmit(e);
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                this.handleSignupSubmit(e);
            });
        }
    },

    // Setup form validation
    setupFormValidation() {
        // Real-time validation for all form inputs
        const allInputs = document.querySelectorAll('input, select');
        
        allInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });

            input.addEventListener('input', (e) => {
                this.clearFieldError(e.target);
                
                // Special handling for password strength
                if (e.target.id === 'signup-password') {
                    this.updatePasswordStrength(e.target.value);
                }
                
                // Special handling for confirm password
                if (e.target.id === 'confirm-password') {
                    this.validatePasswordMatch();
                }
            });
        });
    },

    // Setup password toggle buttons
    setupPasswordToggles() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const passwordInput = e.target.previousElementSibling;
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggle.textContent = '🙈';
                } else {
                    passwordInput.type = 'password';
                    toggle.textContent = '👁️';
                }
            });
        });
    },

    // Switch between signin and signup forms
    switchToForm(formType) {
        const signinContainer = document.getElementById('signin-container');
        const signupContainer = document.getElementById('signup-container');

        if (formType === 'signup') {
            signinContainer.style.display = 'none';
            signupContainer.style.display = 'block';
            this.state.currentForm = 'signup';
        } else {
            signinContainer.style.display = 'block';
            signupContainer.style.display = 'none';
            this.state.currentForm = 'signin';
        }
    },

    // Handle signin form submission
    async handleSigninSubmit(e) {
        e.preventDefault();
        
        if (this.state.isLoading) return;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add remember me checkbox value
        data.rememberMe = document.getElementById('remember-me').checked;

        if (this.validateSigninForm(data)) {
            this.setLoadingState(true, 'signin');
            
            try {
                await this.performSignin(data);
                this.showSuccessMessage('signin', data);
            } catch (error) {
                OnerExpress.showToast(error.message, 'error');
            } finally {
                this.setLoadingState(false, 'signin');
            }
        }
    },

    // Handle signup form submission
    async handleSignupSubmit(e) {
        e.preventDefault();
        
        if (this.state.isLoading) return;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Add checkbox values
        data.agreeTerms = document.getElementById('agree-terms').checked;
        data.newsletter = document.getElementById('newsletter-signup').checked;

        if (this.validateSignupForm(data)) {
            this.setLoadingState(true, 'signup');
            
            try {
                await this.performSignup(data);
                this.showSuccessMessage('signup', data);
            } catch (error) {
                OnerExpress.showToast(error.message, 'error');
            } finally {
                this.setLoadingState(false, 'signup');
            }
        }
    },

    // Validate signin form
    validateSigninForm(data) {
        let isValid = true;
        
        // Email validation
        if (!data.email || !OnerExpress.isValidEmail(data.email)) {
            this.showFieldError('signin-email', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            this.showFieldError('signin-password', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    },

    // Validate signup form
    validateSignupForm(data) {
        let isValid = true;

        // First name validation
        if (!data.firstName || data.firstName.trim().length < 2) {
            this.showFieldError('signup-firstname', 'First name must be at least 2 characters');
            isValid = false;
        }

        // Last name validation
        if (!data.lastName || data.lastName.trim().length < 2) {
            this.showFieldError('signup-lastname', 'Last name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        if (!data.email || !OnerExpress.isValidEmail(data.email)) {
            this.showFieldError('signup-email', 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation (optional but if provided, must be valid)
        if (data.phone && !OnerExpress.isValidPhone(data.phone)) {
            this.showFieldError('signup-phone', 'Please enter a valid phone number');
            isValid = false;
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            this.showFieldError('signup-password', 'Password must be at least 6 characters');
            isValid = false;
        }

        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            this.showFieldError('confirm-password', 'Passwords do not match');
            isValid = false;
        }

        // Terms agreement validation
        if (!data.agreeTerms) {
            this.showFieldError('agree-terms', 'You must agree to the terms and privacy policy');
            isValid = false;
        }

        return isValid;
    },

    // Validate individual field
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();

        this.clearFieldError(field);

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (value && value.length < 2) {
                    this.showFieldError(field.id, `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`);
                }
                break;

            case 'email':
                if (value && !OnerExpress.isValidEmail(value)) {
                    this.showFieldError(field.id, 'Please enter a valid email address');
                }
                break;

            case 'phone':
                if (value && !OnerExpress.isValidPhone(value)) {
                    this.showFieldError(field.id, 'Please enter a valid phone number');
                }
                break;

            case 'password':
                if (value && value.length < 6) {
                    this.showFieldError(field.id, 'Password must be at least 6 characters');
                }
                break;

            case 'confirmPassword':
                this.validatePasswordMatch();
                break;
        }
    },

    // Validate password match
    validatePasswordMatch() {
        const password = document.getElementById('signup-password');
        const confirmPassword = document.getElementById('confirm-password');

        if (password && confirmPassword && confirmPassword.value) {
            if (password.value !== confirmPassword.value) {
                this.showFieldError('confirm-password', 'Passwords do not match');
            } else {
                this.clearFieldError(confirmPassword);
            }
        }
    },

    // Update password strength indicator
    updatePasswordStrength(password) {
        const strengthIndicator = document.getElementById('password-strength');
        if (!strengthIndicator) return;

        if (password.length === 0) {
            strengthIndicator.innerHTML = '';
            return;
        }

        const strength = this.calculatePasswordStrength(password);
        const strengthColors = {
            weak: '#ef4444',
            fair: '#f59e0b',
            good: '#10b981',
            strong: '#059669'
        };

        strengthIndicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; margin-top: 0.5rem;">
                <div style="flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                    <div style="height: 100%; background: ${strengthColors[strength.level]}; width: ${strength.percentage}%; transition: width 0.3s ease;"></div>
                </div>
                <span style="color: ${strengthColors[strength.level]}; font-weight: 500; text-transform: capitalize;">
                    ${strength.level}
                </span>
            </div>
        `;
    },

    // Calculate password strength
    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 15;
        
        // Character variety checks
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;

        let level, percentage;
        
        if (score <= 30) {
            level = 'weak';
            percentage = 25;
        } else if (score <= 60) {
            level = 'fair';
            percentage = 50;
        } else if (score <= 80) {
            level = 'good';
            percentage = 75;
        } else {
            level = 'strong';
            percentage = 100;
        }

        return { level, percentage };
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
    setLoadingState(isLoading, formType) {
        this.state.isLoading = isLoading;
        
        const form = document.getElementById(`${formType}-form`);
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

    // Perform signin (simulate API call)
    performSignin(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate authentication check
                if (data.email && data.password) {
                    // Check if user exists in localStorage
                    const users = JSON.parse(localStorage.getItem('onerexpress_users') || '[]');
                    const user = users.find(u => u.email === data.email);
                    
                    if (user && user.password === data.password) {
                        OnerExpress.signInUser(user);
                        resolve(user);
                    } else {
                        reject(new Error('Invalid email or password. Please try again.'));
                    }
                } else {
                    reject(new Error('Please fill in all required fields.'));
                }
            }, 1500);
        });
    },

    // Perform signup (simulate API call)
    performSignup(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Check if email already exists
                    const users = JSON.parse(localStorage.getItem('onerexpress_users') || '[]');
                    const existingUser = users.find(u => u.email === data.email);
                    
                    if (existingUser) {
                        reject(new Error('An account with this email already exists.'));
                        return;
                    }

                    // Create new user
                    const newUser = {
                        id: Date.now(),
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone || '',
                        password: data.password, // In real app, this would be hashed
                        newsletter: data.newsletter,
                        createdAt: new Date().toISOString()
                    };

                    // Save user to localStorage
                    users.push(newUser);
                    localStorage.setItem('onerexpress_users', JSON.stringify(users));

                    // Sign in the new user
                    OnerExpress.signInUser(newUser);
                    
                    resolve(newUser);
                } catch (error) {
                    reject(new Error('Registration failed. Please try again.'));
                }
            }, 2000);
        });
    },

    // Show success message
    showSuccessMessage(type, data) {
        const signinContainer = document.getElementById('signin-container')}};