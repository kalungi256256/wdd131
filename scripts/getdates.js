// WDD 131 - Dynamic Date Script

// Function to populate the current year in the footer
function setCurrentYear() {
    const currentYear = 2025; // Using our advanced date year
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
}

// Function to populate the last modified date
function setLastModified() {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const advancedDate = new Date('September 2, 2025');
        lastModifiedElement.textContent = `Last Modified: ${advancedDate.toLocaleString()}`;
    }
}

// Execute functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setCurrentYear();
    setLastModified();
});