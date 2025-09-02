// WDD 131 - Dynamic Date Script

// Function to populate the current year in the footer
function setCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }
}

// Function to populate the last modified date
function setLastModified() {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
    }
}

// Execute functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setCurrentYear();
    setLastModified();
});