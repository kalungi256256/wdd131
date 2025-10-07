// Help page functionality
function initializeHelpPage() {
    // Help sidebar navigation
    const helpLinks = document.querySelectorAll('.help-sidebar li');
    const helpSections = document.querySelectorAll('.help-section');
    
    helpLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetHelp = this.getAttribute('data-help');
            
            // Remove active class from all links and sections
            helpLinks.forEach(l => l.classList.remove('active'));
            helpSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            document.getElementById(`${targetHelp}-section`).classList.add('active');
        });
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submissionData = {};
            
            for (let [key, value] of formData.entries()) {
                submissionData[key] = value;
            }
            
            // Store submission data
            localStorage.setItem('helpSubmission', JSON.stringify(submissionData));
            
            // Show success page
            showSuccessPage(submissionData);
        });
    }
    
    // Success page functionality
    const backToHelpBtn = document.getElementById('back-to-help');
    const backToHomeBtn = document.getElementById('back-to-home');
    
    if (backToHelpBtn) {
        backToHelpBtn.addEventListener('click', function() {
            document.getElementById('success').classList.remove('active');
            document.getElementById('help').classList.add('active');
            if (contactForm) contactForm.reset();
        });
    }
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            // This would navigate back to home page
            // For now, we'll just show a message
            alert('Navigating to homepage...');
        });
    }
}

// Function to show success page
function showSuccessPage(data) {
    // Hide help page and show success page
    document.getElementById('help').classList.remove('active');
    document.getElementById('success').classList.add('active');
    
    // Display submission details
    displaySubmissionDetails(data);
}

// Function to display submission details
function displaySubmissionDetails(data) {
    const detailsContainer = document.getElementById('submission-details-content');
    if (!detailsContainer) return;
    
    let detailsHTML = '';
    
    // Format and display each field
    for (const [key, value] of Object.entries(data)) {
        let label = key;
        let displayValue = value;
        
        // Format labels for better readability
        switch(key) {
            case 'fullName':
                label = 'Full Name';
                break;
            case 'email':
                label = 'Email Address';
                break;
            case 'phone':
                label = 'Phone Number';
                break;
            case 'subject':
                label = 'Subject';
                // Format subject value
                switch(value) {
                    case 'order':
                        displayValue = 'Order Issue';
                        break;
                    case 'product':
                        displayValue = 'Product Question';
                        break;
                    case 'shipping':
                        displayValue = 'Shipping Problem';
                        break;
                    case 'return':
                        displayValue = 'Return Request';
                        break;
                    case 'account':
                        displayValue = 'Account Issue';
                        break;
                    case 'payment':
                        displayValue = 'Payment Problem';
                        break;
                    case 'other':
                        displayValue = 'Other';
                        break;
                }
                break;
            case 'orderNumber':
                label = 'Order Number';
                break;
            case 'message':
                label = 'Your Message';
                break;
            case 'urgency':
                label = 'Urgency Level';
                // Format urgency value
                switch(value) {
                    case 'low':
                        displayValue = 'Low - General inquiry';
                        break;
                    case 'medium':
                        displayValue = 'Medium - Need response within 24 hours';
                        break;
                    case 'high':
                        displayValue = 'High - Urgent issue affecting my order';
                        break;
                }
                break;
            case 'subscribe':
                label = 'Newsletter Subscription';
                displayValue = value ? 'Subscribed' : 'Not Subscribed';
                break;
        }
        
        // Skip empty values
        if (!displayValue || displayValue === '') {
            continue;
        }
        
        detailsHTML += `
            <div class="detail-item">
                <div class="detail-label">${label}:</div>
                <div class="detail-value">${displayValue}</div>
            </div>
        `;
    }
    
    detailsContainer.innerHTML = detailsHTML;
}