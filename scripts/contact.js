// Contact Form JavaScript

const ContactForm = {
    init() {
        this.setupEventListeners();
        this.setupFAQ();
        this.loadFormData();
    },

    setupEventListeners() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', (e) => this.validateField(e.target));
                input.addEventListener('input', (e) => this.clearErrors(e.target));
            });

            // Character counter for message
            const messageField = document.getElementById('message');
            const charCounter = document.getElementById('char-count');
            if (messageField && charCounter) {
                messageField.addEventListener('input', (e) => {
                    charCounter.textContent = e.target.value.length;
                    
                    // Visual feedback for character limit
                    if (e.target.value.length > 900) {
                        charCounter.style.color = '#f59e0b'; // Warning
                    } else if (e.target.value.length > 950) {
                        charCounter.style.color = '#ef4444'; // Error
                    } else {
                        charCounter.style.color = '#64748b'; // Normal
                    }
                });
            }

            // Auto-save form data
            inputs.forEach(input => {
                if (input.type !== 'checkbox') {
                    input.addEventListener('input', 
                        EcoTracker.utils.debounce(() => this.saveFormData(), 1000)
                    );
                }
            });
        }
    },

    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items
                faqQuestions.forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    const answer = q.nextElementSibling;
                    if (answer) {
                        answer.style.display = 'none';
                    }
                });
                
                // Toggle current FAQ item
                if (!isExpanded) {
                    question.setAttribute('aria-expanded', 'true');
                    const answer = question.nextElementSibling;
                    if (answer) {
                        answer.style.display = 'block';
                    }
                }
            });
        });
    },

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add checkbox values
        data.newsletter = form.querySelector('#newsletter').checked;
        data.privacy = form.querySelector('#privacy').checked;
        
        if (this.validateForm(data)) {
            this.submitForm(data);
        }
    },

    validateForm(data) {
        let isValid = true;
        const errors = {};

        // Required field validation
        const requiredFields = {
            firstName: 'First name is required',
            lastName: 'Last name is required',
            email: 'Email address is required',
            subject: 'Please select a subject',
            message: 'Message is required',
            privacy: 'You must agree to the privacy policy'
        };

        Object.entries(requiredFields).forEach(([field, message]) => {
            if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
                errors[field] = message;
                isValid = false;
            }
        });

        // Field-specific validation
        if (data.firstName && (data.firstName.length < 2 || data.firstName.length > 30)) {
            errors.firstName = 'First name must be between 2 and 30 characters';
            isValid = false;
        }

        // Email validation
        if (data.email && !this.isValidEmail(data.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Message length validation
        if (data.message && data.message.length > 1000) {
            errors.message = 'Message must be less than 1000 characters';
            isValid = false;
        }

        // Display errors
        this.displayErrors(errors);
        
        return isValid;
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validateField(field) {
        const errors = {};
        const value = field.value.trim();
        const fieldName = field.name;

        switch (fieldName) {
            case 'firstName':
                if (!value) {
                    errors[fieldName] = 'First name is required';
                } else if (value.length < 2 || value.length > 30) {
                    errors[fieldName] = 'First name must be between 2 and 30 characters';
                }
                break;
            case 'email':
                if (!value) {
                    errors[fieldName] = 'Email address is required';
                } else if (!this.isValidEmail(value)) {
                    errors[fieldName] = 'Please enter a valid email address';
                }
                break;
            case 'message':
                if (!value) {
                    errors[fieldName] = 'Message is required';
                } else if (value.length > 1000) {
                    errors[fieldName] = 'Message must be less than 1000 characters';
                }
                break;
        }

        this.displayErrors(errors);
    },

    clearErrors(field) {
        const fieldName = field.name;
        const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
    },

    displayErrors(errors) {
        // Clear all errors first
        document.querySelectorAll('[data-error]').forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });

        document.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });

        // Display new errors
        Object.entries(errors).forEach(([fieldName, message]) => {
            const errorElement = document.querySelector(`[data-error="${fieldName}"]`);
            const fieldElement = document.querySelector(`[name="${fieldName}"]`);
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
            
            if (fieldElement) {
                fieldElement.classList.add('error');
            }
        });
    },

    submitForm(data) {
        // Show loading state
        const submitButton = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success handling
            this.showNotification('Message sent successfully!', 'success');
            this.clearForm();
            this.clearFormData();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    },

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            transition: opacity 0.3s;
        `;
        
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else {
            notification.style.background = '#ef4444';
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    clearForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.reset();
            document.getElementById('char-count').textContent = '0';
        }
    },

    saveFormData() {
        const form = document.getElementById('contact-form');
        if (form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.newsletter = form.querySelector('#newsletter').checked;
            
            localStorage.setItem('contactFormData', JSON.stringify(data));
        }
    },

    loadFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const form = document.getElementById('contact-form');
            
            if (form) {
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'newsletter') {
                        const checkbox = form.querySelector(`#${key}`);
                        if (checkbox) checkbox.checked = value;
                    } else {
                        const field = form.querySelector(`[name="${key}"]`);
                        if (field) field.value = value;
                    }
                });
                
                // Update character counter
                const messageField = document.getElementById('message');
                const charCounter = document.getElementById('char-count');
                if (messageField && charCounter) {
                    charCounter.textContent = messageField.value.length;
                }
            }
        }
    },

    clearFormData() {
        localStorage.removeItem('contactFormData');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ContactForm.init();
});